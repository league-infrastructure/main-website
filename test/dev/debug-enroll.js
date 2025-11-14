import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve("src/content/categories.md"), "utf-8");

function extractContentBlock(sectionBody) {
  const contentMatch = sectionBody.match(/<content>\s*([\s\S]*?)\s*<\/content>/m);
  if (!contentMatch) {
    return {
      preContent: sectionBody.trim(),
      contentHtml: "",
      remainder: sectionBody.trim(),
    };
  }

  const preContent = sectionBody.slice(0, contentMatch.index).trim();
  const remainder = sectionBody.slice(contentMatch.index + contentMatch[0].length).trim();
  const contentHtml = contentMatch[1].trim();

  return { preContent, contentHtml, remainder };
}

function extractTaggedSection(source, tagName) {
  if (!source) {
    return { content: "", remainder: "" };
  }

  const tagPattern = new RegExp(`<${tagName}>\\s*([\\s\\S]*?)\\s*<\\/${tagName}>`, "m");
  const match = source.match(tagPattern);
  if (!match) {
    return { content: "", remainder: source };
  }

  const before = source.slice(0, match.index);
  const after = source.slice(match.index + match[0].length);
  return {
    content: match[1].trim(),
    remainder: `${before}${after}`.trim(),
  };
}

const sections = source.split(/^#\s+/m).map((section) => section.trim()).filter(Boolean);
const first = sections[0];
const lines = first.split("\n");
const title = lines.shift();
const body = lines.join("\n").trim();
const { preContent, remainder } = extractContentBlock(body);
const { content: enrollContent } = extractTaggedSection(remainder, "enroll");
console.log({ title, preContent, remainder, enrollContent });
