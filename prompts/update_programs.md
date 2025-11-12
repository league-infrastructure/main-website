# Update Programs and Classes

## ⚠️ MAJOR CHANGE: Short vs Long Descriptions

**The major change is that the programs page uses SHORT descriptions, while LONG descriptions are used only on individual class or program pages.**

- **Programs Page**: Uses the first line after the title (short description) for both ProgramCards and ClassCards
- **Individual Pages**: Uses the full detailed paragraphs (long description) for comprehensive content

To generate the programs page, you will need to use the content in two files:

- `src/content/classes.md` - Contains all class definitions with metadata
- `src/content/programs.md` - Contains all program definitions with metadata

Before you generate the pages, make sure the images are built with:
`npm run process-cards`

## Content File Structure

### Classes.md Format
Each class entry follows this structure:
```markdown
## Class Title

Brief description line.

Full detailed description paragraph(s).

slug: class_slug
image: image_filename.png
level: beginner|intermediate|advanced|all levels
topics: topic1, topic2, topic3
```

### Programs.md Format
Each program entry follows this structure:
```markdown
## Program Title ( Link to program page )

Brief description line.

slug: program_slug
image: image_filename.png
topics: topic1, topic2, topic3
classes: class_slug1, class_slug2, class_slug3
```

## Programs Page Structure

The programs page (`src/pages/programs.astro`) has this structure:

- Hero Section
- Programs Section with ProgramCard components for each program
- Classes Section with H3 headings, images, and descriptions for each class

## Dynamic Content Loading

The page uses utility functions from `/src/utils/markdown.js` to parse the markdown files:

```javascript
import { parseMarkdownSections, getTopicColor } from "../utils/markdown.js";

// Parse content using utility functions
const classes = parseMarkdownSections(classesContent);
const programs = parseMarkdownSections(programsContent);
```

### Data Structure
The `parseMarkdownSections` function returns objects with this structure:
```javascript
{
  title: "Class/Program Title",
  shortDescription: "Brief description line (used on programs page)",
  fullDescription: "Full detailed description (used on individual pages)",
  metadata: {
    slug: "url-friendly-slug",
    image: "image-filename.png",
    level: "beginner", // for classes
    topics: ["topic1", "topic2"], // array
    classes: ["class1", "class2"] // array, for programs only
  }
}
```

### Content Usage
- **Programs Page**: Uses `shortDescription` for both ProgramCards and ClassCards
- **Individual Pages**: Uses `fullDescription` for detailed content on single class/program pages 

## Program Cards

Program cards use ProgramCard components with three sections:
- **Header**: Program image from `image` metadata
- **Body**: Program title and **short description** (not full description)
- **Footer**: Colored lozenges for each class with links

### Lozenge Generation
Class lozenges are generated using the `getTopicColor()` utility function:

```javascript
// Imported from utils/markdown.js
const color = getTopicColor(classItem.metadata.topics);
```

### CSS Color Variables
```css
:root {
  --color-python: #306998;
  --color-java: #f89820;
  --color-robotics: #e74c3c;
  --color-electronics: #9b59b6;
  --color-games: #2ecc71;
  --color-web: #3498db;
  --color-default: #95a5a6;
}

.class-lozenge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;
}
```

## Class Cards

Classes are displayed using ClassCard components - horizontal, full-width cards with:
- **Left Side**: 700x400 card image from `image` metadata (280px wide in display)
- **Right Side**: Class content including title, level badge, **short description**, and learn more link
- **Responsive**: Stacks vertically on mobile devices

### ClassCard Features
- **Horizontal Layout**: Image on left, content on right
- **Full Width**: Stacks vertically with spacing between cards
- **Hover Effects**: Subtle shadow and transform effects
- **Level Badge**: Styled pill showing class difficulty level
- **Linked Title**: Class title links to individual class page
- **Learn More Link**: Additional call-to-action at bottom

### ClassCard Usage
```astro
<ClassCard
  img={`/images/cards/${classItem.metadata.image}`}
  alt={classItem.title}
  slug={classItem.metadata.slug}
  title={classItem.title}
  level={classItem.metadata.level}
  description={classItem.shortDescription}
/>
``` 

## Image Requirements

All card images must be:
- **Dimensions**: 700x400 pixels (7:4 aspect ratio)
- **Format**: PNG with transparent background for non-conforming aspect ratios
- **Location**: `/public/images/cards/` directory
- **Processing**: Use `npm run process-cards` to standardize images from `/public/images/cards-orig/`

## File Dependencies

To recreate the system, ensure these files exist:
- `/src/utils/markdown.js` - Utility functions for parsing markdown content
- `/src/pages/programs.astro` - Main programs page
- `/src/content/classes.md` - Class definitions with metadata
- `/src/content/programs.md` - Program definitions with metadata
- `/src/components/ProgramCard.astro` - Program card component (vertical)
- `/src/components/ClassCard.astro` - Class card component (horizontal)
- `/scripts/process-cards.js` - Image processing script
- Individual class pages in `/src/pages/classes/[slug].astro`
- Individual program pages in `/src/pages/programs/[slug].astro`

## Metadata Requirements

### Required Class Metadata
- `slug`: URL-friendly identifier
- `image`: Filename in `/public/images/cards/`
- `level`: beginner|intermediate|advanced|all levels
- `topics`: Comma-separated list for color coding

### Required Program Metadata
- `slug`: URL-friendly identifier  
- `image`: Filename in `/public/images/cards/`
- `topics`: Comma-separated list for color coding
- `classes`: Comma-separated list of class slugs for lozenges 
