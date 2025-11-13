import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Utility functions for parsing markdown content files
 */

const contentRoot = path.resolve('./src/content');
const dataRoot = path.resolve('./src/data');

function readJsonData(baseName) {
  try {
    const filePath = path.join(dataRoot, `${baseName}.json`);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${baseName}.json:`, error);
    return undefined;
  }
}

function readContentFile(filename) {
  const filePath = path.join(contentRoot, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

const ARRAY_FIELDS = new Set(['topics', 'classes', 'category']);

function normalizeListValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter((item) => {
        if (typeof item === 'string') {
          return item.length > 0;
        }
        return item !== undefined && item !== null;
      });
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return value;
}

function normalizeMeta(meta) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return {};
  }

  const normalized = {};
  for (const [key, rawValue] of Object.entries(meta)) {
    if (ARRAY_FIELDS.has(key)) {
      normalized[key] = normalizeListValue(rawValue);
    } else {
      normalized[key] = rawValue;
    }
  }
  return normalized;
}

function extractContentBlock(sectionBody, title) {
  const contentMatch = sectionBody.match(/<content>\s*([\s\S]*?)\s*<\/content>/m);
  if (!contentMatch) {
    console.warn(`Missing <content> block while parsing section "${title}".`);
    return {
      preContent: sectionBody.trim(),
      contentHtml: '',
      postContent: '',
    };
  }

  const preContent = sectionBody.slice(0, contentMatch.index).trim();
  const postContent = sectionBody.slice(contentMatch.index + contentMatch[0].length).trim();
  const contentHtml = contentMatch[1].trim();

  return { preContent, contentHtml, postContent };
}

function extractMetadataBlock(block, title) {
  if (!block) {
    return {};
  }

  const fenceMatch = block.match(/```[^\n]*\n([\s\S]*?)\n```/);
  if (!fenceMatch) {
    console.warn(`Missing fenced metadata block while parsing section "${title}".`);
    return {};
  }

  try {
    const parsedMeta = yaml.load(fenceMatch[1]) ?? {};
    if (parsedMeta && typeof parsedMeta === 'object' && !Array.isArray(parsedMeta)) {
      return parsedMeta;
    }
    console.warn(`Metadata for section "${title}" is not an object; ignoring.`);
    return {};
  } catch (error) {
    console.error(`Failed to parse metadata YAML for section "${title}":`, error);
    return {};
  }
}

/**
 * Parse markdown sections into structured data
 * @param {string} content - Raw markdown content
 * @returns {Array} Array of parsed sections with title, blurb, description, content, and metadata
 */
export function parseMarkdownSections(content) {
  const headingRegex = content.match(/^##\s+/m) ? /^##\s+/m : /^#\s+/m;
  const sections = content
    .split(headingRegex)
    .map((section) => section.trim())
    .filter((section) => section.length > 0);

  return sections.map((section) => {
    const lines = section.split('\n');
    const title = lines.shift()?.trim() ?? '';
    const sectionBody = lines.join('\n').trim();

    const { preContent, contentHtml, postContent } = extractContentBlock(sectionBody, title);

    const paragraphs = preContent
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);

    const [blurbParagraph, ...descriptionParagraphs] = paragraphs;
    const blurb = blurbParagraph ?? '';
    const description = descriptionParagraphs.join('\n\n');

    const rawMeta = extractMetadataBlock(postContent, title);
    const normalizedMeta = normalizeMeta(rawMeta);

    const record = {
      title,
      blurb,
      description: description || '',
      content: contentHtml,
      meta: normalizedMeta,
      metadata: normalizedMeta,
      shortDescription: blurb,
      fullDescription: description || blurb,
    };

    for (const [key, value] of Object.entries(normalizedMeta)) {
      record[key] = value;
    }

    return record;
  });
}

/**
 * Get color for topic-based styling
 * @param {Array} topics - Array of topic strings
 * @returns {string} CSS color variable
 */
export function getTopicColor(topics) {
  if (topics.includes('python')) return 'var(--color-python)';
  if (topics.includes('java')) return 'var(--color-java)';
  if (topics.includes('robotics')) return 'var(--color-robotics)';
  if (topics.includes('electronics')) return 'var(--color-electronics)';
  if (topics.includes('games')) return 'var(--color-games)';
  if (topics.includes('web')) return 'var(--color-web)';
  return 'var(--color-default)';
}

/**
 * Read and parse a markdown content file
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<Array>} Promise resolving to parsed sections
 */
export async function readAndParseMarkdown(filePath) {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseMarkdownSections(content);
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error);
    return [];
  }
}

/**
 * @returns {Array}
 */
export function getProgramsData() {
  const jsonData = readJsonData('programs');
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  try {
    return parseMarkdownSections(readContentFile('programs.md'));
  } catch (error) {
    console.error('Error loading programs content:', error);
    return [];
  }
}

/**
 * @returns {Array}
 */
export function getClassesData() {
  const jsonData = readJsonData('classes');
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  try {
    return parseMarkdownSections(readContentFile('classes.md'));
  } catch (error) {
    console.error('Error loading classes content:', error);
    return [];
  }
}

/**
 * @returns {Array}
 */
export function getCategoriesData() {
  const jsonData = readJsonData('categories');
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  try {
    return parseMarkdownSections(readContentFile('categories.md'));
  } catch (error) {
    console.error('Error loading categories content:', error);
    return [];
  }
}

export function getProgramBySlug(slug) {
  try {
    const programs = getProgramsData();
    return programs.find((program) => program.metadata?.slug === slug);
  } catch (error) {
    console.error(`Error retrieving program with slug "${slug}":`, error);
    return undefined;
  }
}

export function getClassBySlug(slug) {
  try {
    const classes = getClassesData();
    return classes.find((classItem) => classItem.metadata?.slug === slug);
  } catch (error) {
    console.error(`Error retrieving class with slug "${slug}":`, error);
    return undefined;
  }
}