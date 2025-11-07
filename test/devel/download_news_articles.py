"""Download news articles, archive HTML, and create Astro pages."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Iterable, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Comment

ROOT = Path(__file__).resolve().parents[2]
NEWS_JSON_PATH = ROOT / "data" / "news.json"
RAW_OUTPUT_DIR = ROOT / "scrape" / "news"
ASTRO_OUTPUT_DIR = ROOT / "src" / "pages" / "news"
NEWS_INDEX_PATH = ROOT / "src" / "data" / "newsPosts.json"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "LeagueScraper/1.0 (+https://www.jointheleague.org)"
})

SIZE_SUFFIX_RE = re.compile(r"-\d+x\d+(?=\.[^.]+$)")

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
    "loading",
}

KEEP_CLASSES = {
    "aligncenter",
    "alignleft",
    "alignright",
    "wp-caption",
    "wp-caption-text",
    "wp-block-image",
}


@dataclass
class ArticleRecord:
    url: str
    year: str
    month: str
    day: str
    slug: str
    title: str
    author: Optional[str]
    date: Optional[str]
    featured_image: Optional[dict[str, str]]
    body_html: str
    description: Optional[str]


def read_news_entries() -> list[dict[str, str]]:
    with NEWS_JSON_PATH.open("r", encoding="utf-8") as json_file:
        return json.load(json_file)


def parse_url_segments(url: str) -> tuple[str, str, str, str]:
    parsed = urlparse(url)
    segments = [segment for segment in parsed.path.split("/") if segment]
    if len(segments) < 4:
        raise ValueError(f"Unable to determine date for: {url}")
    year, month, day, *rest = segments
    slug = rest[-1] if rest else segments[-1]
    return year, month, day, sanitize_slug(slug)


def sanitize_slug(slug: str) -> str:
    slug = slug.strip().lower()
    slug = re.sub(r"[^a-z0-9-]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "post"


def fetch_html(url: str) -> str:
    response = SESSION.get(url, timeout=30)
    response.raise_for_status()
    return response.text


def extract_article_data(html: str, url: str, entry: dict[str, str], year: str, month: str, day: str, slug: str) -> ArticleRecord:
    soup = BeautifulSoup(html, "html.parser")
    article = soup.find("article") or soup.find("main") or soup.body or soup

    title = entry.get("title") or extract_title(article) or slug.replace("-", " ").title()
    author = extract_author(article)
    date = extract_date(article, year, month, day)
    featured_image = extract_featured_image(article, entry.get("image") or "", url)
    body_html, description = extract_body_html(article, url, featured_image.get("src") if featured_image else None)

    return ArticleRecord(
        url=url,
        year=year,
        month=month,
        day=day,
        slug=slug,
        title=title,
        author=author,
        date=date,
        featured_image=featured_image,
        body_html=body_html,
        description=description,
    )


def extract_title(article: BeautifulSoup) -> Optional[str]:
    title_tag = article.find("h1") or article.find("h2")
    if title_tag:
        text = normalize_whitespace(title_tag.get_text())
        if text:
            return text
    return None


def extract_author(article: BeautifulSoup) -> Optional[str]:
    link = article.find("a", rel=lambda value: value and "author" in value)
    if link:
        text = normalize_whitespace(link.get_text())
        if text:
            return text

    author_span = article.find(class_=lambda classes: classes and any("author" in cls for cls in ensure_iterable(classes)))
    if author_span:
        text = normalize_whitespace(author_span.get_text())
        if text:
            return text
    return None


def extract_date(article: BeautifulSoup, year: str, month: str, day: str) -> Optional[str]:
    candidates: list[str] = []
    for selector in ["time", "span.updated", "span.published"]:
        for element in article.select(selector):
            datetime_attr = element.get("datetime")
            if datetime_attr:
                candidates.append(datetime_attr.strip())
            text = normalize_whitespace(element.get_text())
            if text:
                candidates.append(text)
    fallback = f"{year}-{month}-{day}"
    fallback_normalized = normalize_date(fallback) or fallback

    for candidate in candidates:
        normalized = normalize_date(candidate)
        if normalized and normalized[:10] == fallback_normalized[:10]:
            return normalized

    return fallback_normalized


def normalize_date(value: str) -> Optional[str]:
    cleaned = value.strip()
    if not cleaned:
        return None

    if cleaned.endswith("Z"):
        cleaned = cleaned[:-1] + "+00:00"

    try:
        parsed = datetime.fromisoformat(cleaned)
    except ValueError:
        for fmt in ("%B %d, %Y", "%b %d, %Y"):
            try:
                parsed = datetime.strptime(cleaned, fmt)
            except ValueError:
                continue
            else:
                return parsed.date().isoformat()
        return None

    if "T" in cleaned or parsed.time() != datetime.min.time():
        return parsed.isoformat()
    return parsed.date().isoformat()


def extract_featured_image(article: BeautifulSoup, fallback_src: str, base_url: str) -> Optional[dict[str, str]]:
    candidates = []
    if fallback_src:
        candidates.append(fallback_src)

    first_image = article.find("img")
    if first_image and first_image.get("src"):
        candidates.append(first_image["src"])

    for candidate in candidates:
        absolute = absolutize_url(candidate, base_url)
        img_tag = article.find("img", src=lambda src: src and match_image_src(src, candidate))
        alt = img_tag.get("alt", "") if img_tag else ""
        caption = None
        srcset = None
        sizes = None
        if img_tag:
            srcset = rewrite_srcset(img_tag.get("srcset"), base_url)
            sizes = img_tag.get("sizes") or None
            figcaption = img_tag.find_parent("figure")
            if figcaption:
                caption_tag = figcaption.find("figcaption")
                if caption_tag:
                    caption = normalize_whitespace(caption_tag.get_text()) or None
        if absolute:
            image_data: dict[str, str] = {"src": absolute}
            if alt:
                image_data["alt"] = alt
            if caption:
                image_data["caption"] = caption
            if srcset:
                image_data["srcset"] = srcset
            if sizes:
                image_data["sizes"] = sizes
            return image_data
    return None


def extract_body_html(article: BeautifulSoup, base_url: str, featured_src: Optional[str]) -> tuple[str, Optional[str]]:
    content = article.select_one(".post-content") or article
    working = BeautifulSoup(content.decode(), "html.parser")

    for tag_name in ("script", "style", "noscript", "iframe", "svg", "link", "meta"):
        for tag in working.find_all(tag_name):
            tag.decompose()

    for comment in working.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    for cls in ("fusion-sharing", "fusion-share-box", "related-posts", "single-related-posts"):
        for tag in working.select(f".{cls}"):
            tag.decompose()

    for heading in working.find_all(["h2", "h3", "h4"]):
        if "related" in heading.get_text(strip=True).lower():
            container = heading
            while container and container.name not in {"body"}:
                parent = container.parent
                if container.name in {"div", "section", "ul", "ol"}:
                    container.decompose()
                    break
                container = parent

    for link in working.find_all("a"):
        label = normalize_whitespace(link.get_text()).lower()
        if label in {"view larger image", "gallery"}:
            link.decompose()

    for tag in working.find_all(True):
        if tag.has_attr("class"):
            filtered = [cls for cls in ensure_iterable(tag["class"]) if cls in KEEP_CLASSES]
            if filtered:
                tag["class"] = filtered
            else:
                del tag["class"]

        if tag.has_attr("id"):
            del tag["id"]

        if tag.has_attr("style"):
            del tag["style"]

        for attribute in list(tag.attrs):
            if attribute in {"class"}:
                continue
            if attribute not in ALLOWED_ATTRIBUTES:
                del tag[attribute]

        if tag.name == "img":
            src = tag.get("src")
            if src:
                tag["src"] = absolutize_url(src, base_url)
            if tag.get("srcset"):
                tag["srcset"] = rewrite_srcset(tag.get("srcset"), base_url)
            tag.attrs.setdefault("loading", "lazy")

        if tag.name == "a":
            href = tag.get("href")
            if href and not href.startswith("#") and not href.startswith("mailto:"):
                tag["href"] = absolutize_url(href, base_url)

    if featured_src:
        image = working.find("img", src=lambda src: src and match_image_src(src, featured_src))
        if image:
            container = image
            while container and container.name not in {"p", "figure", "li"}:
                container = container.parent
            (container or image).decompose()

    for wrapper in list(working.find_all(["div", "span"])):
        if not wrapper.attrs:
            wrapper.unwrap()

    removed = True
    while removed:
        removed = False
        for tag in list(working.find_all(True)):
            if tag.name in {"p", "div", "span"}:
                has_media = tag.find(["img", "video", "audio", "iframe", "picture", "figure", "blockquote", "ul", "ol", "table"]) is not None
                if not has_media and not normalize_whitespace(tag.get_text() or ""):
                    tag.decompose()
                    removed = True

    description = None
    for paragraph in working.find_all("p"):
        text = normalize_whitespace(paragraph.get_text())
        if text:
            description = shorten_text(text, 160)
            break

    html_fragments: list[str] = []
    for child in working.children:
        if isinstance(child, str):
            text = normalize_whitespace(child)
            if text:
                html_fragments.append(text)
        else:
            html_fragments.append(str(child).strip())

    body_html = "\n".join(fragment for fragment in html_fragments if fragment)
    return body_html, description


def rewrite_srcset(srcset: Optional[str], base_url: str) -> Optional[str]:
    if not srcset:
        return None
    rewritten: list[str] = []
    for part in srcset.split(","):
        trimmed = part.strip()
        if not trimmed:
            continue
        segments = trimmed.split()
        url = segments[0]
        descriptor = " ".join(segments[1:])
        absolute = absolutize_url(url, base_url)
        rewritten.append(" ".join(filter(None, [absolute, descriptor])))
    return ", ".join(rewritten) if rewritten else None


def ensure_iterable(value: Iterable[str] | str | None) -> Iterable[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return value


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def shorten_text(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    truncated = text[: limit - 3]
    if " " in truncated:
        truncated = truncated.rsplit(" ", 1)[0]
    return truncated + "..."


def absolutize_url(url: str, base_url: str) -> str:
    if url.startswith("http://") or url.startswith("https://") or url.startswith("mailto:"):
        return url
    return urljoin(base_url, url)


def strip_size_suffix(filename: str) -> str:
    return SIZE_SUFFIX_RE.sub("", filename)


def match_image_src(candidate: str, target: str) -> bool:
    candidate_clean = strip_size_suffix(candidate.split("?")[0])
    target_clean = strip_size_suffix(target.split("?")[0])
    return PurePosixPath(candidate_clean).name == PurePosixPath(target_clean).name


def indent_html(html: str, indent: str = "    ") -> str:
    if not html.strip():
        return ""
    lines = html.splitlines()
    return "\n".join(f"{indent}{line}" if line else "" for line in lines)


def build_post_constant(article: ArticleRecord) -> str:
    lines: list[str] = ["const post = {"]
    lines.append(f"  title: {json.dumps(article.title)},")
    lines.append(f"  author: {json.dumps(article.author) if article.author else 'null'},")
    lines.append(f"  date: {json.dumps(article.date) if article.date else 'null'},")
    lines.append(f"  description: {json.dumps(article.description) if article.description else 'null'},")
    if article.featured_image:
        lines.append("  featuredImage: {")
        for key in ("src", "alt", "caption", "srcset", "sizes"):
            value = article.featured_image.get(key)
            if value:
                lines.append(f"    {key}: {json.dumps(value)},")
        lines.append("  },")
    else:
        lines.append("  featuredImage: null,")
    lines.append("};")
    return "\n".join(lines)


def render_astro_page(article: ArticleRecord) -> str:
    depth = len((Path("news") / article.year / article.month / article.day).parts)
    prefix = "../" * (depth + 1)
    imports = (
        f"import BaseLayout from '{prefix}layouts/BaseLayout.astro';\n"
        f"import Post from '{prefix}components/Post.astro';"
    )
    post_constant = build_post_constant(article)
    body_block = indent_html(article.body_html)
    body_content = f"{body_block}\n" if body_block else ""
    return (
        f"---\n"
        f"{imports}\n\n"
        f"{post_constant}\n"
        f"---\n"
    f"<BaseLayout title={{post.title}} description={{post.description ?? undefined}}>\n"
        f"  <Post title={{post.title}} author={{post.author}} date={{post.date}} featuredImage={{post.featuredImage}}>\n"
        f"{body_content}"
        f"  </Post>\n"
        f"</BaseLayout>\n"
    )


def raw_article_path(article: ArticleRecord) -> tuple[Path, bool]:
    raw_dir = RAW_OUTPUT_DIR / article.year / article.month / article.day
    raw_dir.mkdir(parents=True, exist_ok=True)
    raw_path = raw_dir / f"{article.slug}.html"
    return raw_path, raw_path.exists()


def write_outputs(article: ArticleRecord, raw_html: str) -> None:
    raw_path, exists = raw_article_path(article)
    if exists:
        print(f"Skipping existing raw HTML: {raw_path.relative_to(ROOT)}")
    else:
        raw_path.write_text(raw_html, encoding="utf-8")

    astro_dir = ASTRO_OUTPUT_DIR / article.year / article.month / article.day
    astro_dir.mkdir(parents=True, exist_ok=True)
    astro_path = astro_dir / f"{article.slug}.astro"
    astro_path.write_text(render_astro_page(article), encoding="utf-8")
    relative_path = astro_path.relative_to(ROOT)
    print(f"Processed {article.url} -> {relative_path}")


def build_summary(article: ArticleRecord) -> dict[str, object]:
    return {
        "title": article.title,
        "author": article.author,
        "date": article.date,
        "description": article.description,
        "path": f"/news/{article.year}/{article.month}/{article.day}/{article.slug}/",
        "featuredImage": article.featured_image,
    }


def write_news_index(summaries: list[dict[str, object]]) -> None:
    def normalized_iso(value: object) -> str:
        text = str(value or "").strip()
        if not text:
            return ""
        try:
            parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return text

        if parsed.tzinfo is None:
            return parsed.isoformat()

        return parsed.astimezone(timezone.utc).isoformat()

    sorted_summaries = sorted(
        summaries,
        key=lambda summary: (
            normalized_iso(summary.get("date")),
            str(summary.get("title") or ""),
        ),
        reverse=True,
    )
    NEWS_INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    NEWS_INDEX_PATH.write_text(
        json.dumps(sorted_summaries, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def download_articles() -> None:
    entries = read_news_entries()
    summaries: list[dict[str, object]] = []
    for entry in entries:
        url = entry.get("url", "").strip()
        if not url:
            continue

        year, month, day, slug = parse_url_segments(url)
        html = fetch_html(url)
        article = extract_article_data(html, url, entry, year, month, day, slug)
        write_outputs(article, html)
        summaries.append(build_summary(article))

    write_news_index(summaries)


if __name__ == "__main__":
    download_articles()
