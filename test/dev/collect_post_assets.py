"""Download external images used in Markdown posts and rewrite references to local assets."""
from __future__ import annotations

import re
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests
import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = ROOT / "src" / "content" / "posts"

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "LeagueContentBot/1.0"})
DOWNLOAD_CACHE: dict[str, str] = {}

IMG_TAG_RE = re.compile(r"<img\s[^>]*?>", re.IGNORECASE | re.DOTALL)
MARKDOWN_IMG_RE = re.compile(r"!\[(?P<alt>[^\]]*)\]\((?P<url>https?://[^\s)]+)(?P<title>\s+\"[^\"]*\")?\)")
FIGURE_WRAPPER_RE = re.compile(r"<figure[^>]*>(.*?)</figure>", re.IGNORECASE | re.DOTALL)
PARA_MARKDOWN_IMG_RE = re.compile(r"<p>\s*(?P<inner>!\[[^\]]*\]\([^)]*\))\s*</p>", re.IGNORECASE)
ANCHOR_MARKDOWN_IMG_RE = re.compile(
    r"<a[^>]*href=\"(?P<href>[^\"]+)\"[^>]*>\s*(?P<inner>!\[[^\]]*\]\([^)]*\)(?:\s*\"[^\"]*\")?)\s*</a>",
    re.IGNORECASE,
)
EMPTY_ANCHOR_RE = re.compile(r"<a[^>]*>\s*</a>", re.IGNORECASE)


def _format_markdown_image(alt: str, src: str, title: Optional[str] = None) -> str:
    if title:
        cleaned = title.strip()
        if cleaned.startswith('"') and cleaned.endswith('"'):
            cleaned = cleaned[1:-1]
        return f"![{alt}]({src} \"{cleaned}\")"
    return f"![{alt}]({src})"


def download_image(url: str, dest_dir: Path) -> Optional[str]:
    if not url.lower().startswith("http"):
        return url

    parsed = urlparse(url)
    filename = Path(parsed.path).name
    if not filename:
        return None

    local_name = filename
    target = dest_dir / local_name
    counter = 1
    while target.exists() and target.is_file():
        if target.stat().st_size > 0:
            break
        counter += 1
        local_name = f"{Path(filename).stem}-{counter}{Path(filename).suffix}"
        target = dest_dir / local_name

    if not target.exists() or target.stat().st_size == 0:
        candidates = [url]
        parsed = urlparse(url)
        if parsed.netloc.endswith('sautebrandpartners.com'):
            candidates.append(f"https://www.jointheleague.org{parsed.path}")

        last_error: requests.RequestException | None = None  # type: ignore[name-defined]
        for candidate in candidates:
            try:
                resp = SESSION.get(candidate, timeout=30)
                resp.raise_for_status()
            except requests.RequestException as exc:  # type: ignore[name-defined]
                last_error = exc
                continue
            target.write_bytes(resp.content)
            print(f"Downloaded {candidate} -> {target.relative_to(ROOT)}")
            DOWNLOAD_CACHE[url] = f"./{local_name}"
            DOWNLOAD_CACHE[candidate] = f"./{local_name}"
            break
        else:
            print(f"Failed to download {url}: {last_error}")
            if target.exists() and target.stat().st_size == 0:
                target.unlink()
            return None
    else:
        print(f"Already have {target.relative_to(ROOT)}; skipping download")
        DOWNLOAD_CACHE[url] = f"./{local_name}"

    return f"./{local_name}"


def process_featured_image(frontmatter: dict, post_dir: Path) -> None:
    featured = frontmatter.get("featuredImage")
    if not featured:
        return

    if isinstance(featured, str):
        if featured.startswith("./"):
            return
        new_src = download_image(featured, post_dir)
        if new_src:
            frontmatter["featuredImage"] = new_src
        return

    if isinstance(featured, dict):
        src = featured.get("src")
        if not src:
            return
        if isinstance(src, str) and src.startswith("./"):
            featured.pop("srcset", None)
            featured.pop("sizes", None)
            return
        new_src = download_image(src, post_dir)
        if new_src:
            image_data = {"src": new_src}
            alt_text = featured.get("alt")
            if alt_text:
                image_data["alt"] = alt_text
            frontmatter["featuredImage"] = image_data


def replace_html_img_tags(body: str, post_dir: Path) -> str:
    def _replace(match: re.Match[str]) -> str:
        tag_html = match.group(0)
        soup = BeautifulSoup(tag_html, "html.parser")
        img = soup.find("img")
        if not img:
            return tag_html

        src = img.get("src")
        if not src:
            return ""
        alt = img.get("alt", "")
        title = img.get("title")
        new_src = download_image(src, post_dir)
        if not new_src:
            return tag_html
        alt_clean = alt.replace("[", "(").replace("]", ")")
        return _format_markdown_image(alt_clean, new_src, title)

    updated = IMG_TAG_RE.sub(_replace, body)
    updated = FIGURE_WRAPPER_RE.sub(lambda m: m.group(1), updated)
    updated = PARA_MARKDOWN_IMG_RE.sub(lambda m: m.group("inner"), updated)
    return updated


def replace_markdown_remote_images(body: str, post_dir: Path) -> str:
    def _replace(match: re.Match[str]) -> str:
        alt = match.group("alt")
        url = match.group("url")
        title = match.group("title") or ""
        new_src = download_image(url, post_dir)
        if not new_src:
            return match.group(0)
        title_text: Optional[str] = None
        if title:
            title_text = title.strip()
        return _format_markdown_image(alt, new_src, title_text)

    return MARKDOWN_IMG_RE.sub(_replace, body)


def strip_anchor_wrappers(body: Optional[str]) -> str:
    if body is None:
        return ""

    def _replace(match: re.Match[str]) -> str:
        inner = match.group("inner")
        href = match.group("href")
        local = DOWNLOAD_CACHE.get(href)
        if local:
            return inner.replace(href, local)
        return inner

    without_wrappers = ANCHOR_MARKDOWN_IMG_RE.sub(_replace, body)
    return EMPTY_ANCHOR_RE.sub("", without_wrappers)


def process_post(path: Path) -> None:
    DOWNLOAD_CACHE.clear()
    raw_text = path.read_text(encoding="utf-8")
    try:
        prefix, front_str, body = raw_text.split("---", 2)
    except ValueError:
        print(f"Skipping {path} (missing frontmatter)")
        return

    frontmatter = yaml.safe_load(front_str) or {}
    post_dir = path.parent

    process_featured_image(frontmatter, post_dir)

    body_processed = replace_html_img_tags(body, post_dir)
    body_processed = replace_markdown_remote_images(body_processed, post_dir)
    body_processed = strip_anchor_wrappers(body_processed)

    for remote, local in DOWNLOAD_CACHE.items():
        body_processed = body_processed.replace(remote, local)

    new_front = yaml.safe_dump(frontmatter, sort_keys=False, allow_unicode=True).strip()
    new_body = body_processed.strip() + "\n"
    path.write_text(f"---\n{new_front}\n---\n\n{new_body}", encoding="utf-8")
    print(f"Updated {path.relative_to(ROOT)}")


def main() -> None:
    markdown_files = sorted(POSTS_DIR.rglob("*.md"))
    for md_file in markdown_files:
        process_post(md_file)


if __name__ == "__main__":
    main()
