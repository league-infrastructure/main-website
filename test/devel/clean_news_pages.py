"""Normalize scraped news article HTML files."""

from __future__ import annotations

from pathlib import Path

from bs4 import BeautifulSoup, Comment

ROOT = Path(__file__).resolve().parents[2]
NEWS_SCRAPE_DIR = ROOT / "scrape" / "news"
ALLOWED_ATTRIBUTES = {
    "href",
    "src",
    "alt",
    "title",
    "rel",
    "target",
    "type",
    "datetime",
    "width",
    "height",
    "srcset",
    "sizes",
}
KEEP_CLASSES = {"aligncenter", "wp-caption", "wp-caption-text", "wp-block-image"}


def clean_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    for tag_name in ("script", "style", "noscript", "iframe", "svg", "link", "meta"):
        for tag in soup.find_all(tag_name):
            tag.decompose()

    article = soup.find("article")
    if article is None:
        article = soup.find("main") or soup.body or soup

    # Work on a copy of the article HTML to avoid bringing the rest of the page back in.
    working = BeautifulSoup(article.decode(), "html.parser")

    for comment in working.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    for tag in working.find_all(True):
        if tag.has_attr("class"):
            filtered = [cls for cls in tag["class"] if "fusion" not in cls and cls in KEEP_CLASSES]
            if filtered:
                tag["class"] = filtered
            else:
                del tag["class"]

        if tag.has_attr("id"):
            del tag["id"]

        if tag.has_attr("style"):
            del tag["style"]

        for attribute in list(tag.attrs):
            if attribute in {"class", "id"}:
                continue
            if attribute not in ALLOWED_ATTRIBUTES:
                del tag[attribute]

    for section in working.find_all(["section", "div"]):
        heading = section.find(["h1", "h2", "h3"])
        if heading and "related" in heading.get_text(strip=True).lower():
            section.decompose()

    for tag in list(working.find_all(True)):
        if tag.name in {"div", "span", "p"}:
            has_media = tag.find(["img", "video", "audio", "iframe", "picture", "figure", "blockquote", "ul", "ol", "table"]) is not None
            if not has_media and not tag.get_text(strip=True):
                tag.decompose()

    title_tag = working.find("h1") or working.find("h2")
    title_text = title_tag.get_text(strip=True) if title_tag else ""

    cleaned_doc = BeautifulSoup("<html><head><meta charset='utf-8'><title></title></head><body></body></html>", "html.parser")
    if title_text:
        cleaned_doc.title.string = title_text
    elif soup.title and soup.title.string:
        cleaned_doc.title.string = soup.title.string
    else:
        cleaned_doc.title.string = ""

    root_element = working.find()
    if root_element is not None:
        cleaned_doc.body.append(root_element.extract())

    return "<!DOCTYPE html>\n" + cleaned_doc.prettify()


def clean_directory(directory: Path) -> None:
    for html_file in sorted(directory.glob("*.html")):
        if html_file.name == "news.html":
            continue
        original_html = html_file.read_text(encoding="utf-8", errors="ignore")
        cleaned_html = clean_html(original_html)
        html_file.write_text(cleaned_html, encoding="utf-8")
        print(f"Cleaned {html_file.name}")


if __name__ == "__main__":
    clean_directory(NEWS_SCRAPE_DIR)
