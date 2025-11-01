
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
