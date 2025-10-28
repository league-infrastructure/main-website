import os
from pathlib import Path
from typing import Dict, Iterable, List
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from wordpress import API


SCRAPE_ROOT = Path(__file__).resolve().parent.parent / "scrape"


def _strip_quotes(value: str) -> str:
    if not value:
        return value
    value = value.strip()
    if value.startswith(("'", '"')) and value.endswith(("'", '"')):
        return value[1:-1]
    return value


def _expect(env_name: str) -> str:
    value = _strip_quotes(os.getenv(env_name))
    if not value:
        raise SystemExit(f"Missing {env_name} in environment.")
    return value


def _segments_from_url(url: str) -> List[str]:
    parsed = urlparse(url)
    segments = [segment for segment in parsed.path.split('/') if segment and segment not in ('.', '..')]
    return segments


def _path_for_page_source(target_dir: Path) -> Path:
    return target_dir / "page.txt"


def _path_for_media(url: str) -> Path:
    segments = _segments_from_url(url)
    if not segments:
        raise ValueError(f"Media URL has no path segments: {url}")
    filename = segments[-1]
    target_dir = SCRAPE_ROOT.joinpath(*segments[:-1]) if len(segments) > 1 else SCRAPE_ROOT
    target_dir.mkdir(parents=True, exist_ok=True)
    return target_dir / filename


def _create_api(url: str, username: str, token: str) -> API:
    return API(
        url=url,
        consumer_key=username,
        consumer_secret=token,
        api="wp-json",
        version="wp/v2",
        basic_auth=True,
        query_string_auth=False,
        timeout=20,
    )


def _fetch_all(api: API, endpoint: str) -> List[Dict]:
    per_page = 100
    page = 1
    results: List[Dict] = []
    total_pages: int | None = None

    while True:
        params = {"per_page": per_page, "page": page, "context": "edit"}
        try:
            response = api.get(endpoint, params=params)
        except UserWarning as exc:
            message = str(exc)
            if "invalid_page_number" in message:
                break
            raise
        data = response.json()
        if not isinstance(data, list):
            raise ValueError(f"Unexpected response for {endpoint}: {data}")

        if not data:
            break

        results.extend(data)

        if total_pages is None:
            total_pages_header = response.headers.get("X-WP-TotalPages")
            if total_pages_header:
                try:
                    total_pages = int(total_pages_header)
                except ValueError:
                    total_pages = None

        if total_pages and page >= total_pages:
            break

        if len(data) < per_page:
            break

        page += 1

    return results


def _write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def _write_binary(path: Path, content: bytes) -> None:
    path.write_bytes(content)


def _save_page_like(items: Iterable[Dict], base_dir: Path) -> None:
    for item in items:
        link = item.get("link")
        if not link:
            continue
        content_raw = item.get("content", {}).get("raw")
        if content_raw:
            segments = _segments_from_url(link)
            if not segments:
                segments = ["_root"]
            target_dir = base_dir.joinpath(*segments)
            target_dir.mkdir(parents=True, exist_ok=True)
            index_html = target_dir / "index.html"
            if index_html.exists():
                index_html.unlink()
            source_path = _path_for_page_source(target_dir)
            _write_text(source_path, content_raw)


def _save_media(items: Iterable[Dict], html_session: requests.Session) -> None:
    for item in items:
        source_url = item.get("source_url")
        if not source_url:
            continue
        target_path = _path_for_media(source_url)
        resp = html_session.get(source_url, timeout=30)
        resp.raise_for_status()
        _write_binary(target_path, resp.content)


def main() -> None:
    load_dotenv()
    base_url = _expect("WP_URL")
    username = _expect("WP_URL_USERNAME")
    token = _expect("WP_API_TOKEN")

    api = _create_api(base_url, username, token)
    media_session = requests.Session()

    pages = _fetch_all(api, "pages")
    posts = _fetch_all(api, "posts")
    media_items = _fetch_all(api, "media")

    pages_dir = SCRAPE_ROOT / "pages"
    posts_dir = SCRAPE_ROOT / "posts"
    pages_dir.mkdir(parents=True, exist_ok=True)
    posts_dir.mkdir(parents=True, exist_ok=True)

    _save_page_like(pages, pages_dir)
    _save_page_like(posts, posts_dir)
    _save_media(media_items, media_session)


if __name__ == "__main__":
    main()
