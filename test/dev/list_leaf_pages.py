import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2] / "src" / "pages"

leaves: list[Path] = []

for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    if "index.astro" not in filenames:
        continue

    filtered_subdirs = [
        name for name in dirnames
        if not name.startswith('.') and not name.startswith('_')
    ]

    if filtered_subdirs:
        continue

    rel_path = Path(dirpath).relative_to(BASE_DIR)
    leaves.append(rel_path)

for rel in sorted(leaves):
    print(rel.as_posix())
