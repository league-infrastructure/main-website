"""Print location codes and names from src/data/locations.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOCATIONS_PATH = ROOT / "src" / "data" / "locations.json"


def main() -> None:
    with LOCATIONS_PATH.open("r", encoding="utf-8") as locations_file:
        locations = json.load(locations_file)

    for location in locations:
        code = location.get("code", "").strip()
        name = location.get("name", "").strip()
        if not code and not name:
            continue
        if( 'library' in name.lower() ):
            print(f"{code}, ", end='')


if __name__ == "__main__":
    main()
