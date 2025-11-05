#!/usr/bin/env python3
"""Quick sanity check for the upcoming events feed."""

from __future__ import annotations

import datetime as _dt
import sys
from typing import Any, Iterable

import requests

FEED_URL = "https://snips.jtlapp.net/leaguesync/meetups.json"
MAX_EVENTS = 5

def _coerce_events(payload: Any) -> list[dict[str, Any]]:
    """Return a list of event dictionaries from the API payload."""
    if isinstance(payload, dict):
        for key in ("events", "items", "data"):
            value = payload.get(key)
            if isinstance(value, list):  # noqa: SIM102 - keep clarity
                return [item for item in value if isinstance(item, dict)]
        if all(isinstance(item, dict) for item in payload.values()):
            return list(payload.values())
    if isinstance(payload, Iterable) and not isinstance(payload, (str, bytes)):
        return [item for item in payload if isinstance(item, dict)]
    return []


def _format_date(raw: Any) -> str:
    """Format a date-like value if possible."""
    if isinstance(raw, (int, float)):
        try:
            return _dt.datetime.fromtimestamp(float(raw)).strftime("%Y-%m-%d")
        except OSError:
            return str(raw)
    if isinstance(raw, str) and raw:
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
            try:
                return _dt.datetime.strptime(raw[:19], fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
    return "(date unavailable)"


def main() -> int:
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:  # pragma: no cover - manual script
        print(f"Request failed: {exc}", file=sys.stderr)
        return 1

    payload: Any
    try:
        payload = response.json()
    except ValueError as exc:
        print(f"Invalid JSON: {exc}", file=sys.stderr)
        return 1

    events = _coerce_events(payload)

    if not events:
        print("No events available.")
        return 0

    print(f"Fetched {len(events)} events from {FEED_URL}")
    for index, event in enumerate(events[:MAX_EVENTS], start=1):
        title = str(event.get("title") or event.get("name") or "Untitled Event").strip()
        start = _format_date(event.get("start") or event.get("date"))
        location = str(event.get("location") or event.get("venue") or "").strip()
        line = f"{index}. {title} — {start}"
        if location:
            line += f" @ {location}"
        print(line)

    return 0


if __name__ == "__main__":  # pragma: no cover - script entry point
    sys.exit(main())
