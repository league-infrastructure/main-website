import fs from "fs";
import path from "path";
import { parseMarkdownSections } from "../src/utils/markdown.js";

const contentDir = path.resolve("src/content");
const outputDir = path.resolve("src/data");

function ensureOutputDir() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

function readContentFile(filename) {
  const filePath = path.join(contentDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

function writeJsonFile(baseName, data) {
  const targetPath = path.join(outputDir, `${baseName}.json`);
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(targetPath, payload, "utf-8");
  return targetPath;
}

function normalizeEntries(entries) {
  return entries.map((entry) => {
    const meta = { ...(entry.meta ?? entry.metadata ?? {}) };

    if (entry.curriculum && !meta.curriculum) {
      meta.curriculum = entry.curriculum;
    }

    const curriculum = meta.curriculum ?? entry.curriculum ?? "";

    return {
      title: entry.title,
      blurb: entry.blurb ?? entry.shortDescription ?? "",
      description:
        entry.description ?? entry.fullDescription ?? entry.shortDescription ?? "",
      content: entry.content ?? "",
      enroll: entry.enroll ?? "",
      curriculum,
      meta,
      ...meta,
    };
  });
}

function hasSelfReferentialCategory(entry) {
  const slug = entry.slug ?? entry.meta?.slug;
  if (!slug) {
    return false;
  }

  const categories = entry.category ?? entry.categories ?? entry.meta?.category;
  if (!categories) {
    return false;
  }

  const categoryList = Array.isArray(categories) ? categories : [categories];
  return categoryList.some((value) => typeof value === "string" && value.trim() === slug);
}

function deepClone(record) {
  return JSON.parse(JSON.stringify(record));
}

function mergeCategoryRecords(baseCategories, programEntries) {
  const merged = new Map();

  for (const entry of baseCategories) {
    const slug = entry.slug ?? entry.meta?.slug;
    if (!slug) {
      continue;
    }
    merged.set(slug, entry);
  }

  for (const program of programEntries) {
    if (!hasSelfReferentialCategory(program)) {
      continue;
    }

    const slug = program.slug ?? program.meta?.slug;
    if (!slug || merged.has(slug)) {
      continue;
    }

    merged.set(slug, deepClone(program));
  }

  return Array.from(merged.values());
}

function exportMarkdownToJson(source, targetBaseName, transformFn) {
  const markdown = readContentFile(source);
  const parsed = parseMarkdownSections(markdown);
  const normalized = normalizeEntries(parsed);
  const data = typeof transformFn === "function" ? transformFn(normalized) : normalized;
  const outputPath = writeJsonFile(targetBaseName, data);
  console.log(`Exported ${source} -> ${path.relative(process.cwd(), outputPath)}`);
  return data;
}

try {
  ensureOutputDir();
  exportMarkdownToJson("classes.md", "classes");
  const programs = exportMarkdownToJson("programs.md", "programs");
  exportMarkdownToJson("categories.md", "categories", (categories) =>
    mergeCategoryRecords(categories, programs),
  );
  console.log("Content export complete.");
} catch (error) {
  console.error("Failed to export content:", error);
  process.exitCode = 1;
}
