import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Set

import requests
from dotenv import load_dotenv
from xml.etree import ElementTree as ET


def _strip_quotes(value: str) -> str:
    """Remove wrapping quotes some .env values may include."""
    if not value:
        return value
    value = value.strip()
    if value.startswith(("'", '"')) and value.endswith(("'", '"')):
        return value[1:-1]
    return value


def _strip_ns(tag: str) -> str:
    """Remove XML namespace from a tag name."""
    if "}" in tag:
        return tag.split("}", 1)[1]
    return tag


def _find_text(node: ET.Element, name: str) -> Optional[str]:
    """Find the first child text by local name."""
    for child in node:
        if _strip_ns(child.tag) == name and child.text:
            return child.text.strip()
    return None


def _fetch(session: requests.Session, url: str) -> ET.Element:
    response = session.get(url, timeout=15)
    response.raise_for_status()
    return ET.fromstring(response.content)


def _collect_urls(url: str, session: requests.Session, seen: Set[str]) -> List[Dict[str, str]]:
    """Recursively gather URL entries from nested sitemap documents."""
    if url in seen:
        return []
    seen.add(url)

    root = _fetch(session, url)
    entries: List[Dict[str, str]] = []

    tag_name = _strip_ns(root.tag)

    if tag_name == "sitemapindex":
        for sitemap in root:
            if _strip_ns(sitemap.tag) != "sitemap":
                continue
            loc = _find_text(sitemap, "loc")
            if not loc:
                continue
            entries.extend(_collect_urls(loc, session, seen))
        return entries

    if tag_name != "urlset":
        return entries

    for url_tag in root:
        if _strip_ns(url_tag.tag) != "url":
            continue
        record: Dict[str, str] = {"source": url}
        for key in ("loc", "lastmod", "changefreq", "priority"):
            value = _find_text(url_tag, key)
            if value:
                record[key] = value
        if len(record) > 1:
            entries.append(record)

    return entries


def main() -> None:
    load_dotenv()
    sitemap_url = os.getenv("WP_SITEMAP_URL")
    if not sitemap_url:
        raise SystemExit("Missing WP_SITEMAP_URL in environment.")

    sitemap_url = _strip_quotes(sitemap_url)

    session = requests.Session()
    records = _collect_urls(sitemap_url, session, set())

    output_path = Path(__file__).with_name("sitemap.json")
    output_path.write_text(json.dumps(records, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
