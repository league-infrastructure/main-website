from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INPUT_PATH = ROOT / "scrape" / "about" / "policies" / "page-cleaned.txt"
OUTPUT_PATH = ROOT / "scrape" / "about" / "policies" / "page-cleaned.md"

TOKEN_PATTERN = re.compile(r"\[(\/)?fusion_(title|text)\]")


def parse_sections(text: str) -> list[tuple[str, str]]:
    sections: list[tuple[str, str]] = []
    pos = 0
    current_heading: str | None = None

    while True:
        match = TOKEN_PATTERN.search(text, pos)
        if not match:
            break

        token_start = match.start()
        token_end = match.end()
        closing = match.group(1) == "/"
        token_type = match.group(2)

        if not closing and token_type == "title":
            end_tag = TOKEN_PATTERN.search(text, token_end)
            if not end_tag or not (end_tag.group(1) == "/" and end_tag.group(2) == "title"):
                pos = token_end
                continue
            heading_text = text[token_end:end_tag.start()].strip()
            current_heading = heading_text
            pos = end_tag.end()
            continue

        if current_heading and not closing and token_type == "text":
            end_tag = TOKEN_PATTERN.search(text, token_end)
            if not end_tag or not (end_tag.group(1) == "/" and end_tag.group(2) == "text"):
                pos = token_end
                continue
            body = text[token_end:end_tag.start()].strip()
            sections.append((current_heading, body))
            current_heading = None
            pos = end_tag.end()
            continue

        pos = token_end

    return sections


HEADING_IN_BODY_PATTERN = re.compile(r"^(#{1,6})\s+(.*)$", re.MULTILINE)


def bump_heading_levels(body: str) -> str:
    def _replace(match: re.Match[str]) -> str:
        hashes, text = match.groups()
        bumped = "#" * min(len(hashes) + 1, 6)
        return f"{bumped} {text}"

    return HEADING_IN_BODY_PATTERN.sub(_replace, body)


def convert_to_markdown(sections: list[tuple[str, str]]) -> str:
    entries: list[str] = []
    for heading, body in sections:
        normalized_body = bump_heading_levels(body.strip())
        entry_lines = [
            f"# {heading.strip()}",
            "",
            "<blurb_placeholder>",
            "",
            "<description_placeholder>",
            "",
            "<content>",
            normalized_body,
            "</content>",
            "",
            "```",
            "slug: <slug_placeholder>",
            "```",
            "",
        ]
        entries.append("\n".join(entry_lines))

    return "\n".join(entry.rstrip() for entry in entries) + "\n"


def main() -> None:
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"Missing cleaned input file: {INPUT_PATH}")

    raw = INPUT_PATH.read_text(encoding="utf-8")
    sections = parse_sections(raw)
    if not sections:
        raise ValueError("No sections parsed from cleaned input.")

    markdown = convert_to_markdown(sections)
    OUTPUT_PATH.write_text(markdown, encoding="utf-8")
    print(f"Wrote markdown to {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
