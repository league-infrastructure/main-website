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

    return {
      title: entry.title,
      blurb: entry.blurb ?? entry.shortDescription ?? "",
      description:
        entry.description ?? entry.fullDescription ?? entry.shortDescription ?? "",
      content: entry.content ?? "",
      meta,
      metadata: meta,
      ...meta,
    };
  });
}

function exportMarkdownToJson(source, targetBaseName) {
  const markdown = readContentFile(source);
  const parsed = parseMarkdownSections(markdown);
  const normalized = normalizeEntries(parsed);
  const outputPath = writeJsonFile(targetBaseName, normalized);
  console.log(`Exported ${source} -> ${path.relative(process.cwd(), outputPath)}`);
}

try {
  ensureOutputDir();
  exportMarkdownToJson("classes.md", "classes");
  exportMarkdownToJson("programs.md", "programs");
  exportMarkdownToJson("categories.md", "categories");
  console.log("Content export complete.");
} catch (error) {
  console.error("Failed to export content:", error);
  process.exitCode = 1;
}
