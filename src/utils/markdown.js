import fs from 'fs';
import path from 'path';

/**
 * Utility functions for parsing markdown content files
 */

const contentRoot = path.resolve('./src/content');

function readContentFile(filename) {
  const filePath = path.join(contentRoot, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Parse markdown sections into structured data
 * @param {string} content - Raw markdown content
 * @returns {Array} Array of parsed sections with title, shortDescription, fullDescription, and metadata
 */
export function parseMarkdownSections(content) {
  const sections = content.split(/^##\s+/m).filter(section => section.trim());

  return sections.map((section) => {
    const lines = section.split('\n');
    const title = lines.shift()?.trim() ?? '';

    const data = {};
    let currentKey = null;
    let buffer = [];

    const flushBuffer = () => {
      if (!currentKey) return;
      const rawValue = buffer.join('\n').trim();
      if (rawValue.length === 0) {
        data[currentKey] = '';
      } else if (currentKey === 'topics' || currentKey === 'classes') {
        data[currentKey] = rawValue
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      } else {
        data[currentKey] = rawValue;
      }
      currentKey = null;
      buffer = [];
    };

    lines.forEach((line) => {
      const trimmedLine = line.trimEnd();

      if (trimmedLine.trim() === '' && currentKey) {
        buffer.push('');
        return;
      }

      const match = trimmedLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (match) {
        flushBuffer();
        currentKey = match[1].trim();
        buffer = [match[2]];
      } else if (currentKey) {
        buffer.push(trimmedLine);
      }
    });

    flushBuffer();

    const { blurb = '', description = '', ...metadataFields } = data;

    return {
      title,
      shortDescription: blurb,
      fullDescription: description,
      description: description || blurb,
      metadata: metadataFields,
    };
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

export function getProgramBySlug(slug) {
  try {
    const programs = parseMarkdownSections(readContentFile('programs.md'));
    return programs.find((program) => program.metadata?.slug === slug);
  } catch (error) {
    console.error(`Error retrieving program with slug "${slug}":`, error);
    return undefined;
  }
}

export function getClassBySlug(slug) {
  try {
    const classes = parseMarkdownSections(readContentFile('classes.md'));
    return classes.find((classItem) => classItem.metadata?.slug === slug);
  } catch (error) {
    console.error(`Error retrieving class with slug "${slug}":`, error);
    return undefined;
  }
}