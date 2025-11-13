import { readFileSync } from "fs";
import path from "path";
import { parseMarkdownSections } from "../../src/utils/markdown.js";

const categoriesPath = path.resolve("src/content/categories.md");
const raw = readFileSync(categoriesPath, "utf-8");
const parsed = parseMarkdownSections(raw);

for (const record of parsed) {
  console.log(record.title, record.enroll, Object.keys(record));
}
