"""Fetch live HTML pages for reference during theme analysis."""
from __future__ import annotations

import argparse
from pathlib import Path
from urllib.parse import urlparse

import requests


def _resolve_output_path(base: Path, url: str) -> Path:
    parsed = urlparse(url)
    path = parsed.path or "/"
    if path.endswith("/"):
        filename = "index.html"
        directory = path.rstrip("/") or "_root"
    else:
        directory, _, tail = path.rpartition("/")
        directory = directory or "_root"
        filename = f"{tail}.html"
    safe_parts = [part for part in directory.split("/") if part]
    return base.joinpath(*safe_parts, filename)


def fetch(urls: list[str], output_dir: Path, timeout: int) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    for url in urls:
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        target_path = _resolve_output_path(output_dir, url)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(response.text, encoding="utf-8")
        print(f"Saved {url} -> {target_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="+", help="One or more URLs to fetch")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("scrape/live"),
        help="Directory to store downloaded HTML (default: scrape/live)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=20,
        help="Request timeout in seconds (default: 20)",
    )
    args = parser.parse_args()
    fetch(args.urls, args.output_dir, args.timeout)


if __name__ == "__main__":
    main()
