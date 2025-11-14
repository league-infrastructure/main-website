from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_PATH = ROOT / "scrape" / "about" / "policies" / "page.txt"
OUTPUT_PATH = ROOT / "scrape" / "about" / "policies" / "page-cleaned.txt"

SHORTCODE_PATTERN = re.compile(r"\[([a-zA-Z0-9_]+)(?:\s+[^\]]*?)?(\s*/?)\]")


def simplify_shortcodes(source_text: str) -> str:
    def _replace(match: re.Match[str]) -> str:
        name = match.group(1)
        trailing = match.group(2) or ""
        trailing = trailing.strip()
        if trailing == "/":
            return f"[{name} /]"
        return f"[{name}]"

    return SHORTCODE_PATTERN.sub(_replace, source_text)


def main() -> None:
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Missing source file: {SOURCE_PATH}")

    original = SOURCE_PATH.read_text(encoding="utf-8")
    cleaned = simplify_shortcodes(original)
    OUTPUT_PATH.write_text(cleaned, encoding="utf-8")
    print(f"Wrote simplified shortcodes to {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
