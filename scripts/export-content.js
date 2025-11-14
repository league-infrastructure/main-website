import fs from "fs";
import path from "path";
import { parseMarkdownSections, normalizeContentRecords } from "../src/utils/markdown.js";

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

function ensureHeadingLevel(markdown, source) {
  const hasH1Headings = /^#\s+/m.test(markdown);
  if (!hasH1Headings) {
    const legacyDetected = /^##\s+/m.test(markdown);
    const guidance = legacyDetected
      ? "Found level-2 headings (##). Update the file to use '# ' for record headings."
      : "No level-1 headings ('# ') found.";
    throw new Error(`Invalid heading structure in ${source}: ${guidance}`);
  }
}

function writeJsonFile(baseName, data) {
  const targetPath = path.join(outputDir, `${baseName}.json`);
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(targetPath, payload, "utf-8");
  return targetPath;
}

function hasSelfReferentialCategory(entry) {
  const slug = typeof entry.slug === "string" ? entry.slug.trim() : "";
  if (!slug) {
    return false;
  }

  const categories = entry.category ?? entry.categories;
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
    const slug = typeof entry.slug === "string" ? entry.slug.trim() : "";
    if (!slug) {
      continue;
    }
    merged.set(slug, entry);
  }

  for (const program of programEntries) {
    if (!hasSelfReferentialCategory(program)) {
      continue;
    }

    const slug = typeof program.slug === "string" ? program.slug.trim() : "";
    if (!slug || merged.has(slug)) {
      continue;
    }

    merged.set(slug, deepClone(program));
  }

  return Array.from(merged.values());
}

function exportMarkdownToJson(source, targetBaseName, transformFn) {
  const markdown = readContentFile(source);
  ensureHeadingLevel(markdown, source);
  const parsed = parseMarkdownSections(markdown);
  const normalized = normalizeContentRecords(parsed);
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
  if (fs.existsSync(path.join(contentDir, "policies.md"))) {
    exportMarkdownToJson("policies.md", "policies");
  }
  if (fs.existsSync(path.join(contentDir, "faqs.md"))) {
    exportMarkdownToJson("faqs.md", "faqs");
  }
  if (fs.existsSync(path.join(contentDir, "content.md"))) {
    exportMarkdownToJson("content.md", "content");
  }
  console.log("Content export complete.");
} catch (error) {
  console.error("Failed to export content:", error);
  process.exitCode = 1;
}
