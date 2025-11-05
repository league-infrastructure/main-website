"""Utility to flatten remaining src/pages/**/index.astro files."""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

SRC_ROOT = Path("src/pages")
INDEX_FILENAME = "index.astro"


@dataclass(frozen=True)
class MovePlan:
    source: Path
    destination: Path

    def describe(self) -> str:
        return f"{self.source.as_posix()} -> {self.destination.as_posix()}"


def discover_moves(root: Path, excludes: Iterable[Path]) -> list[MovePlan]:
    pages_root = root / SRC_ROOT
    exclude_set = {pages_root / exclude for exclude in excludes}
    moves: list[MovePlan] = []

    for index_file in pages_root.rglob(INDEX_FILENAME):
        if not index_file.is_file():
            continue

        parent_dir = index_file.parent
        if parent_dir == pages_root:
            # This covers src/pages/index.astro; still moved unless excluded.
            pass

        if parent_dir in exclude_set:
            continue

        destination = parent_dir.with_suffix(".astro")
        moves.append(MovePlan(source=index_file, destination=destination))

    moves.sort(key=lambda plan: plan.source.as_posix())
    return moves


def validate_moves(moves: Iterable[MovePlan]) -> None:
    for plan in moves:
        if plan.destination.exists():
            raise FileExistsError(
                f"Destination already exists: {plan.destination.as_posix()}"
            )


def perform_moves(moves: Iterable[MovePlan], *, dry_run: bool) -> None:
    for plan in moves:
        if dry_run:
            print(f"dry-run: {plan.describe()}")
            continue

        plan.destination.parent.mkdir(parents=True, exist_ok=True)
        plan.source.rename(plan.destination)
        print(f"moved: {plan.describe()}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Move remaining src/pages/**/index.astro files to sibling .astro files "
            "without removing their parent directories."
        )
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[2],
        help="Repository root (defaults to project root).",
    )
    parser.add_argument(
        "--exclude",
        nargs="*",
        default=(),
        metavar="RELATIVE_DIR",
        help=(
            "Directory paths under src/pages to skip (e.g. programs/classes)."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview planned moves without modifying files.",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    moves = discover_moves(args.root, args.exclude)

    if not moves:
        print("Nothing to move; exiting.")
        return

    validate_moves(moves)
    perform_moves(moves, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
