"""Convert Astro-based posts in src/content/posts to Markdown content collection entries."""
from __future__ import annotations

import re
from pathlib import Path
from textwrap import dedent

import json5
import yaml

ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = ROOT / "src" / "content" / "posts"


class ConversionError(RuntimeError):
    pass


def _extract_post_object(frontmatter: str) -> dict:
    match = re.search(r"const\s+post\s*=", frontmatter)
    if not match:
        raise ConversionError("const post object not found in frontmatter")

    brace_start = frontmatter.find("{", match.end())
    if brace_start == -1:
        raise ConversionError("Opening brace for post object not found")

    depth = 0
    brace_end = None
    for index, char in enumerate(frontmatter[brace_start:], start=brace_start):
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                brace_end = index
                break

    if brace_end is None:
        raise ConversionError("Could not find closing brace for post object")

    obj_text = frontmatter[brace_start : brace_end + 1]
    return json5.loads(obj_text)


def _prune_none(value):
    if isinstance(value, dict):
        return {k: _prune_none(v) for k, v in value.items() if v not in (None, "")}
    if isinstance(value, list):
        return [_prune_none(v) for v in value if v not in (None, "")]
    return value


def _extract_post_content(body: str) -> str:
    match = re.search(r"<Post[^>]*>", body)
    if not match:
        raise ConversionError("<Post> component start not found")

    start = match.end()
    end = body.find("</Post>", start)
    if end == -1:
        raise ConversionError("</Post> closing tag not found")

    inner = body[start:end]
    normalized = dedent(inner.replace("\r\n", "\n")).strip()
    return normalized + "\n"


def convert_file(path: Path) -> None:
    raw_text = path.read_text(encoding="utf-8")
    try:
        _, frontmatter, body = raw_text.split("---", 2)
    except ValueError as err:
        raise ConversionError("Unable to split Astro file frontmatter") from err

    post_data = _extract_post_object(frontmatter)
    content = _extract_post_content(body)

    frontmatter_map = {
        "title": post_data.get("title"),
        "author": post_data.get("author"),
        "date": post_data.get("date"),
        "description": post_data.get("description"),
    }

    featured = post_data.get("featuredImage")
    if featured:
        frontmatter_map["featuredImage"] = _prune_none(featured)

    cleaned = {k: _prune_none(v) for k, v in frontmatter_map.items() if v not in (None, "")}

    yaml_frontmatter = yaml.safe_dump(
        cleaned,
        sort_keys=False,
        allow_unicode=True,
    ).strip()

    markdown = f"---\n{yaml_frontmatter}\n---\n\n{content}"

    target = path.with_suffix(".md")
    target.write_text(markdown, encoding="utf-8")
    path.unlink()


def main() -> None:
    astro_files = sorted(POSTS_DIR.rglob("*.astro"))
    if not astro_files:
        print("No Astro posts found; nothing to convert.")
        return

    for astro_path in astro_files:
        target = astro_path.with_suffix(".md")
        if target.exists():
            print(f"Skipping {astro_path.relative_to(ROOT)} (Markdown already exists)")
            continue
        try:
            convert_file(astro_path)
            print(f"Converted {astro_path.relative_to(ROOT)} -> {target.relative_to(ROOT)}")
        except ConversionError as err:
            raise ConversionError(f"Failed to convert {astro_path}: {err}") from err


if __name__ == "__main__":
    main()
