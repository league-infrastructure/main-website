from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, Iterable, List

import click
import yaml

IMAGE_URL_PATTERN = re.compile(
    r'https?://(?:www\.)?jointheleague\.org/wp-content/uploads/[\w./%-]+',
    re.IGNORECASE,
)

SUPPORTED_EXTENSIONS = {'.astro', '.md', '.mdx'}


def find_files(root: Path) -> Iterable[Path]:
    for path in sorted(root.rglob('*')):
        if not path.is_file():
            continue
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        yield path


def extract_urls(content: str) -> List[str]:
    return IMAGE_URL_PATTERN.findall(content)


def to_project_relative(path: Path, project_root: Path) -> str:
    try:
        relative = path.relative_to(project_root)
    except ValueError:
        relative = path.resolve().relative_to(project_root)
    return str(relative).replace('\\', '/')


def map_new_url(original: str, base_path: str) -> str | None:
    match = re.search(r'/wp-content/uploads/(.+)$', original)
    if not match:
        return None
    relative = match.group(1)
    return f'{base_path}/{relative}'


def build_mapping(paths: Iterable[Path], project_root: Path) -> Dict[str, Dict[str, str]]:
    mapping: Dict[str, Dict[str, str]] = {}

    for path in paths:
        content = path.read_text(encoding='utf-8')
        urls = {url for url in extract_urls(content)}
        if not urls:
            continue

        key = to_project_relative(path, project_root)
        mapping[key] = {}
        base_path = '/images' if key.startswith('src/pages/') else '/uploads'
        for url in sorted(urls):
            new_url = map_new_url(url, base_path)
            if not new_url:
                continue
            mapping[key][url] = new_url

    return mapping


@click.command()
@click.option(
    '--pages-dir',
    type=click.Path(path_type=Path, exists=True, file_okay=False),
    default=Path('src/pages'),
    help='Directory containing Astro page components to scan.',
)
@click.option(
    '--posts-dir',
    type=click.Path(path_type=Path, exists=True, file_okay=False),
    default=Path('src/posts'),
    help='Directory containing Markdown posts to scan.',
)
@click.option(
    '--output',
    type=click.Path(path_type=Path),
    default=Path('docs/images.yaml'),
    help='Destination YAML file for the generated map.',
)
def main(pages_dir: Path, posts_dir: Path, output: Path) -> None:
    project_root = Path.cwd()
    page_files = list(find_files(pages_dir))
    post_files = list(find_files(posts_dir))

    mapping = build_mapping(page_files + post_files, project_root)

    sorted_mapping = dict(sorted(mapping.items(), key=lambda item: item[0]))

    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('w', encoding='utf-8') as fh:
        yaml.safe_dump(sorted_mapping, fh, sort_keys=True, allow_unicode=False)

    click.echo(f'Wrote image map for {len(sorted_mapping)} files to {output}.')


if __name__ == '__main__':
    main()
