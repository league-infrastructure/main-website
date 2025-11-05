#!/usr/bin/env bash
# Bulk rename leaf Astro pages from <dir>/index.astro to <dir>.astro.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

declare -a PAGE_DIRS=(
  "src/pages/donate/supporters"
  "src/pages/donate/create-a-fundraiser"
  "src/pages/donate/the-league-at-work"
  "src/pages/donate/volunteer"
  "src/pages/about/policies/enroll"
  "src/pages/about/policies/privacy-policy"
  "src/pages/about/policies/nondiscrimination-policy"
  "src/pages/about/policies/covid-policy"
  "src/pages/about/locations"
  "src/pages/camps/summer-2025"
  "src/pages/camps/summer-camp"
  "src/pages/camps/summer-camps-2024"
  "src/pages/programs/classes/python"
  "src/pages/programs/classes/python-vs-java"
  "src/pages/programs/classes/java"
  "src/pages/programs/tech-club/programming-merit-badge"
  "src/pages/programs/tech-club/code-clinic"
  "src/pages/programs/tech-club/robot-garage"
)

for dir in "${PAGE_DIRS[@]}"; do
  src="${dir}/index.astro"
  dest="${dir}.astro"

  if [[ ! -e "$src" ]]; then
    echo "skip: $src missing" >&2
    continue
  fi

  if [[ -e "$dest" ]]; then
    echo "skip: $dest already exists" >&2
    continue
  fi

  mv "$src" "$dest"
  echo "renamed: $src -> $dest"
done
