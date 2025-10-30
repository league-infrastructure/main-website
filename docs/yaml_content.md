# YAML Content Format for Astro Pages

This document describes the format for separating content from Astro pages into parallel YAML files.

## Overview

For each Astro page, create a parallel `.yaml` file that contains all the text content, structured to mirror the page's component hierarchy. This allows for cleaner separation of content from presentation logic.

## Format Rules

1. **File Naming**: For `src/pages/path/index.astro`, create `src/pages/path/_index.yaml` (underscore prefix prevents Astro from treating it as a page)
2. **Structure**: The YAML structure mirrors the page's component hierarchy
3. **Attributes**: Each component's attributes become keys in the YAML
4. **Content**: Use a special `_content` key for the inner content/text of components
5. **Arrays**: Use YAML arrays for repeated components (like cards, list items, etc.)

## Example

Based on `src/pages/coding-programs/index.astro`, here's how the content structure works:

### Original Astro Component Usage
```astro
<HeroSection
  class="section programs-hero"
  title="Weekly Coding That Grows With Students"
  description="Python and Java tracks guide 5th through 12th graders..."
  note="Grades 5-12"
>
  <figure slot="media" class="programs-hero__media">
    <img src="https://example.com/image.png" alt="Description" loading="lazy" />
  </figure>
</HeroSection>
```

### Corresponding YAML Structure
```yaml
hero_section:
  class: "section programs-hero"
  title: "Weekly Coding That Grows With Students"
  description: |
    Python and Java tracks guide 5th through 12th graders from their first line of code to professional certifications. 
    Students can learn in Carmel Valley, at partner schools, or online from anywhere.
  note: "Grades 5-12"
  details:
    - Curriculum designed to keep pace with students for four to six years of mastery.
    - Classes run seven days a week with in-person and live online options.
  actions:
    - label: "View Weekly Classes"
      href: "/coding-programs/classes/"
      variant: "primary"
    - label: "Explore Tech Club"
      href: "/coding-programs/tech-club/"
      variant: "secondary"
  media:
    image:
      src: "https://www.jointheleague.org/wp-content/uploads/2021/09/programs.png"
      alt: "League students collaborating during a coding class"
      loading: "lazy"
```

### Using YAML Content in Astro
```astro
---
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

// Load YAML content from parallel file
const yamlPath = path.resolve('./src/pages/coding-programs/_index.yaml');
const yamlContent = yaml.load(fs.readFileSync(yamlPath, 'utf8')) as any;
---

<HeroSection
  class={yamlContent.hero_section.class}
  title={yamlContent.hero_section.title}
  description={yamlContent.hero_section.description}
  note={yamlContent.hero_section.note}
  details={yamlContent.hero_section.details}
  actions={yamlContent.hero_section.actions}
>
  <figure slot="media" class="programs-hero__media">
    <img 
      src={yamlContent.hero_section.media.image.src} 
      alt={yamlContent.hero_section.media.image.alt} 
      loading={yamlContent.hero_section.media.image.loading} 
    />
  </figure>
</HeroSection>
```

## Key Benefits

1. **Content Management**: Non-technical users can edit content without touching code
2. **Internationalization**: Easy to create multiple language versions
3. **Consistency**: Ensures content structure matches component expectations
4. **Version Control**: Content changes are clearly visible in diffs
5. **Reusability**: Content can be shared across different page layouts

## YAML Block Scalars for Long Text

For longer text content, use YAML's literal block scalar format with `|` (pipe):

```yaml
description: |
  This is a multi-line description that can span
  multiple lines while preserving line breaks.
  This makes long content much more readable.
```

Alternative formats:
- `|` (literal) - preserves line breaks
- `>` (folded) - converts line breaks to spaces
- `|-` (literal strip) - removes final newlines

## Special Keys

- `_content`: Used for the inner text content of components
- `_class`: Used when `class` is a reserved word in some contexts
- Arrays are used for repeated elements (cards, list items, table rows, etc.)

## Nested Components

For complex nested structures, create nested objects in the YAML:

```yaml
main_programs:
  section:
    class: "section"
    header:
      title: "Main Programs"
      description: "Choose the learning path that matches your schedule, skill level, and goals."
    program_grid:
      - title: "Python Coding Classes"
        level: "Beginner"
        description: "Start with the most approachable programming language..."
        # ... more properties
      - title: "Java Coding Classes"
        # ... more program cards
```

This format provides a clean separation between content and presentation while
maintaining the flexibility to handle complex component hierarchies.

## Candidate Pages for YAML Migration

The following Astro pages still define large content collections inline. Each
centers on one primary object type with many entries, making them good fits for
`_index.yaml` files:

- `src/pages/index.astro` — hero actions, program cards, testimonials, gallery
  items, tuition bullets, and recognition badges all live in `src/data/home.ts`;
  moving to YAML would let content editors adjust home messaging without
  touching TypeScript.
