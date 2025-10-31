from __future__ import annotations

import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable, List, Tuple

import click
import yaml

SPECIAL_TOKEN_OVERRIDES = {
    'ftc': 'FTC',
    'frc': 'FRC',
    'ai': 'AI',
    'ap': 'AP',
    'covid': 'COVID',
    'faq': 'FAQ',
    'sd': 'SD',
    'usa': 'USA',
    'nasa': 'NASA',
    'cs': 'CS',
    'stem': 'STEM',
}


UPLOAD_URL_PATTERN = re.compile(
    r'https?://(?:www\.)?(?:jointheleague\.org|eryary\.sautebrandpartners\.com)/wp-content/uploads/([\w./%-]+)',
    re.IGNORECASE,
)


class ImageExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: List[Tuple[str, str | None]] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, str | None]]) -> None:
        if tag.lower() != 'img':
            return
        attr_map = {name.lower(): value for name, value in attrs}
        src = attr_map.get('src')
        if not src:
            return
        alt = attr_map.get('alt')
        self.images.append((src, alt if alt else None))


def slug_to_title(slug: str) -> str:
    tokens = re.split(r'-+', slug.strip('-'))
    title_tokens: List[str] = []

    for token in tokens:
        lower = token.lower()
        if lower in SPECIAL_TOKEN_OVERRIDES:
            title_tokens.append(SPECIAL_TOKEN_OVERRIDES[lower])
        else:
            title_tokens.append(token.capitalize())

    return ' '.join(title_tokens)


def extract_images(html: str) -> List[Tuple[str, str | None]]:
    parser = ImageExtractor()
    parser.feed(html)
    return parser.images


def to_local_upload(url: str) -> str:
    match = UPLOAD_URL_PATTERN.search(url)
    if not match:
        return url
    return f'/uploads/{match.group(1)}'


def rewrite_upload_urls(text: str) -> str:
    return UPLOAD_URL_PATTERN.sub(lambda match: f'/uploads/{match.group(1)}', text)


def normalise_content(raw: str) -> str:
    content = raw.replace('\r\n', '\n').strip()
    # Collapse more than two blank lines to two for readability.
    content = re.sub(r'\n{3,}', '\n\n', content)
    return content


def discover_pages(source_dir: Path) -> Iterable[Path]:
    return sorted(source_dir.rglob('page.txt'))


@click.command()
@click.option(
    '--input-dir',
    type=click.Path(path_type=Path, exists=True, file_okay=False),
    default=Path('scrape/posts'),
    help='Directory containing scraped WordPress post content.',
)
@click.option(
    '--output-dir',
    type=click.Path(path_type=Path, file_okay=False),
    default=Path('src/posts'),
    help='Directory to write generated Markdown posts into.',
)
@click.option(
    '--clean/--no-clean',
    default=False,
    help='Remove the output directory before generating posts.',
)
@click.option(
    '--force/--no-force',
    default=False,
    help='Overwrite existing Markdown files when regenerating.',
)
def main(input_dir: Path, output_dir: Path, clean: bool, force: bool) -> None:
    """Convert scraped WordPress posts into Markdown files for Astro."""
    if clean and output_dir.exists():
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    generated = 0
    skipped = 0

    for page_txt in discover_pages(input_dir):
        relative = page_txt.relative_to(input_dir)
        if len(relative.parts) < 4:
            click.echo(f'Skipping unexpected path {relative}', err=True)
            skipped += 1
            continue

        year, month, day, slug = relative.parts[:4]
        destination = output_dir / year / month / day / f'{slug}.md'

        if destination.exists() and not force:
            skipped += 1
            continue

        destination.parent.mkdir(parents=True, exist_ok=True)

        raw_content = page_txt.read_text(encoding='utf-8')
        content = normalise_content(raw_content)
        content = rewrite_upload_urls(content)
        images = extract_images(content)
        first_image = images[0] if images else None

        frontmatter: dict[str, str | None] = {
            'title': slug_to_title(slug),
            'date': f'{year}-{month}-{day}',
        }

        if first_image:
            frontmatter['featuredImage'] = to_local_upload(first_image[0])
            if first_image[1]:
                frontmatter['featuredImageAlt'] = first_image[1]

        meta_yaml = yaml.safe_dump(frontmatter, sort_keys=False).strip()
        destination.write_text(f'---\n{meta_yaml}\n---\n\n{content}\n', encoding='utf-8')
        generated += 1

    click.echo(f'Generated {generated} posts. Skipped {skipped}.')


if __name__ == '__main__':
    main()
