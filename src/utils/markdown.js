/**
 * Utility functions for parsing markdown content files
 */

/**
 * Parse markdown sections into structured data
 * @param {string} content - Raw markdown content
 * @returns {Array} Array of parsed sections with title, shortDescription, fullDescription, and metadata
 */
export function parseMarkdownSections(content) {
  const sections = content.split(/^## /m).filter(section => section.trim());
  return sections.map(section => {
    const lines = section.split('\n');
    const title = lines[0];
    
    // Find metadata section (starts after empty line)
    const metadataStart = lines.findIndex((line, index) => 
      index > 0 && line.trim() === '' && lines[index + 1]?.includes(':')
    );
    
    if (metadataStart === -1) return { title, shortDescription: '', fullDescription: '', metadata: {} };
    
    // Parse content between title and metadata
    const contentLines = lines.slice(1, metadataStart);
    const nonEmptyLines = contentLines.filter(line => line.trim() !== '');
    
    // First non-empty line is short description, rest is full description
    const shortDescription = nonEmptyLines.length > 0 ? nonEmptyLines[0].trim() : '';
    const fullDescription = nonEmptyLines.length > 1 ? 
      nonEmptyLines.slice(1).join('\n').trim() : '';
    
    const metadataLines = lines.slice(metadataStart + 1).filter(line => line.includes(':'));
    
    const metadata = {};
    metadataLines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      if (key.trim() === 'classes' || key.trim() === 'topics') {
        metadata[key.trim()] = value.split(',').map(item => item.trim());
      } else {
        metadata[key.trim()] = value;
      }
    });
    
    return { 
      title, 
      shortDescription, 
      fullDescription, 
      description: shortDescription, // For backward compatibility
      metadata 
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