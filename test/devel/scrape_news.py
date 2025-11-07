"""Fetch the latest news articles and save metadata to data/news.json."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
NEWS_URL = "https://www.jointheleague.org/news/"
OUTPUT_JSON_PATH = ROOT / "data" / "news.json"
SCRAPED_HTML_PATH = ROOT / "scrape" / "news" / "news.html"


def fetch_html(url: str) -> str:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.text


def extract_articles(html: str) -> list[dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    articles: list[dict[str, str]] = []

    for article in soup.find_all("article"):
        title_tag = article.find(["h2", "h3"])
        link_tag = title_tag.find("a", href=True) if title_tag else article.find("a", href=True)
        image_tag = article.find("img")

        raw_title = link_tag.get_text(strip=True) if link_tag else title_tag.get_text(strip=True) if title_tag else ""
        if not raw_title:
            continue

        article_url = urljoin(NEWS_URL, link_tag["href"].strip()) if link_tag else ""
        if not article_url:
            continue

        image_url = ""
        if image_tag is not None:
            for attribute in ("data-src", "data-lazy-src", "src"):
                candidate = image_tag.get(attribute)
                if candidate:
                    image_url = urljoin(NEWS_URL, candidate.strip())
                    break

        articles.append({
            "title": raw_title,
            "url": article_url,
            "image": image_url,
        })

    return deduplicate_articles(articles)


def deduplicate_articles(articles: Iterable[dict[str, str]]) -> list[dict[str, str]]:
    seen: dict[str, dict[str, str]] = {}
    for article in articles:
        key = article.get("url", "")
        if not key:
            continue
        seen.setdefault(key, article)
    return list(seen.values())


def save_json(data: list[dict[str, str]], destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def save_html(html: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding="utf-8")


def main() -> None:
    html = fetch_html(NEWS_URL)
    save_html(html, SCRAPED_HTML_PATH)
    articles = extract_articles(html)
    save_json(articles, OUTPUT_JSON_PATH)
    print(f"Saved {len(articles)} articles to {OUTPUT_JSON_PATH}")


if __name__ == "__main__":
    main()
