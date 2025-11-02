
Add python modules with uv add. 

Use `uv run` to run programs. 

Do not create test programs in Here Docs on the terminal. Create a separate .py
file instead.

This project uses Astro. For mor information on astro, get an LLM overview at
https://docs.astro.build/llms-full.txt

We are using fulldev-ui components, https://ui.full.dev/docs/. Prefer to use the
components as they are, but if you can create extensions of them, or custom
components if required. However, custom components should start by copying or
extending existing fulldev-ui components. 


# Updates

In the files in docs/updates, you will find notes about changes you should make.
After you have verified that each change in the document is complete, put the
string "[DONE]" at the beginning of the items, just after the number or dash
that indicates it is a list item, or at the beginning of the paragraph if it is
not a list item.

When you make changes to the codebase based on these update notes.

For visual changes to pages, as opposed to just content changes, use browsermcp
or puppeteer to check that the page has definitely changed. 

# CSS

This project uses two main CSS files with specific purposes:

## `styles/global.css`
- **Purpose**: Foundation styles and site-wide defaults
- **Contains**:
  - CSS custom properties (variables) for colors, typography, spacing
  - CSS resets and base element styles (html, body, headings, links)
  - Utility classes (.sr-only, .container, .button, etc.)
  - Global typography and form styles
- **Usage**: Imported once in BaseLayout.astro, affects entire site

## `styles/site.css`  
- **Purpose**: Specific component and layout implementations
- **Contains**:
  - Header/navigation styles (.site-header, .site-nav)
  - Footer styles (.site-footer)
  - Component styles (.hero, .section, .card variants)
  - Layout-specific CSS for complex components
- **Usage**: Imported in BaseLayout.astro for structural components

## Guidelines
- **Add variables** to `global.css` for reusable values (colors, spacing)
- **Add component styles** to `site.css` or create component-specific CSS files
- **Use scoped `<style>` blocks in page components** for page-specific styles instead of separate files in `styles/pages/`
- **Prefer CSS custom properties** over hardcoded values for maintainability
- **Follow fulldev-ui patterns** when extending or customizing components

## Page-Specific CSS Best Practices
- **Use scoped styles in Astro components**:
  ```astro
  ---
  // Page logic here
  ---
  
  <BaseLayout>
    <div class="page-hero">Content</div>
  </BaseLayout>
  
  <style>
    .page-hero {
      background: var(--color-primary);
      padding: 2rem 0;
    }
  </style>
  ```
- **Use `define:vars` for dynamic styling**:
  ```astro
  ---
  const bgColor = '#f37121';
  ---
  
  <div class="dynamic-section">Content</div>
  
  <style define:vars={{ bgColor }}>
    .dynamic-section {
      background-color: var(--bgColor);
    }
  </style>
  ```
- **Avoid creating files in `styles/pages/`** - keep styles co-located with components
- **Astro automatically scopes styles** to prevent conflicts between components

