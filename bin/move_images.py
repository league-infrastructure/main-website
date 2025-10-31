from __future__ import annotations

import shutil
from pathlib import Path
from typing import Dict

import click
import yaml


def flatten_mapping(data: Dict[str, Dict[str, str]]) -> Dict[str, str]:
    flat: Dict[str, str] = {}
    for images in data.values():
        for original, new in images.items():
            if original in flat and flat[original] != new:
                raise click.ClickException(
                    f'Conflicting targets for {original}: {flat[original]} vs {new}'
                )
            flat[original] = new
    return flat


def resolve_source_path(original_url: str, source_root: Path) -> Path:
    try:
        relative = original_url.split('/wp-content/uploads/', maxsplit=1)[1]
    except IndexError as exc:  # pragma: no cover - defensive guard
        raise click.ClickException(f'Cannot parse upload path from {original_url}') from exc
    return source_root / relative


def resolve_destination_path(new_url: str, destination_root: Path) -> Path:
    normalised = new_url.lstrip('/')
    return destination_root / normalised


@click.command()
@click.option(
    '--mapping',
    'mapping_path',
    type=click.Path(path_type=Path, exists=True, dir_okay=False),
    default=Path('docs/images.yaml'),
    help='Path to the YAML file describing image moves.',
)
@click.option(
    '--source-root',
    type=click.Path(path_type=Path, exists=True, file_okay=False),
    default=Path('scrape/wp-content/uploads'),
    help='Root directory containing downloaded WordPress uploads.',
)
@click.option(
    '--destination-root',
    type=click.Path(path_type=Path, file_okay=False),
    default=Path('public'),
    help='Destination root for moved images (typically Astro `public/`).',
)
@click.option(
    '--dry-run/--no-dry-run',
    default=False,
    help='When enabled, only log the operations that would occur.',
)
@click.option(
    '--overwrite/--no-overwrite',
    default=False,
    help='Replace files at the destination when they already exist.',
)
def main(
    mapping_path: Path,
    source_root: Path,
    destination_root: Path,
    dry_run: bool,
    overwrite: bool,
) -> None:
    """Move scraped uploads into the Astro public directory using a YAML map."""
    data = yaml.safe_load(mapping_path.read_text(encoding='utf-8')) or {}
    if not isinstance(data, dict):
        raise click.ClickException('Mapping file must describe a dictionary of image mappings.')

    flat_mapping = flatten_mapping(data)
    if not flat_mapping:
        click.echo('No images to process.')
        return

    operations = 0
    skipped = 0
    missing = 0

    for original_url, new_url in flat_mapping.items():
        source_path = resolve_source_path(original_url, source_root)
        destination_path = resolve_destination_path(new_url, destination_root)

        if not source_path.exists():
            click.echo(f'[missing] {source_path}', err=True)
            missing += 1
            continue

        destination_path.parent.mkdir(parents=True, exist_ok=True)

        if destination_path.exists() and not overwrite:
            click.echo(f'[skip] {destination_path} already exists', err=True)
            skipped += 1
            continue

        operations += 1
        if dry_run:
            click.echo(f'[dry-run] {source_path} -> {destination_path}')
            continue

        if destination_path.exists() and overwrite:
            if destination_path.is_file():
                destination_path.unlink()
            else:  # pragma: no cover - defensive guard
                shutil.rmtree(destination_path)

        shutil.move(str(source_path), str(destination_path))
        click.echo(f'Moved {source_path} -> {destination_path}')

    click.echo(
        f'Processed {operations} images (skipped {skipped}, missing {missing}).'
    )


if __name__ == '__main__':
    main()
