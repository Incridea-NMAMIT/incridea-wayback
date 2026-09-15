#!/usr/bin/env bash

set -euo pipefail

WAYBACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_ROOT="${INCRIDEA_SERVER_DIR:-$(cd "$WAYBACK_ROOT/../incridea-server-v2" && pwd)}"

read_value() {
  local supplied="${1:-}"
  local prompt="$2"
  if [[ -n "$supplied" ]]; then
    printf '%s' "$supplied"
    return
  fi
  local value
  read -r -p "$prompt" value
  printf '%s' "$value"
}

YEAR="$(read_value "${1:-}" "Wayback year (YYYY): ")"
SOURCE_COMMIT="$(read_value "${2:-}" "Immutable source commit SHA: ")"

[[ "$YEAR" =~ ^[0-9]{4}$ ]] || { echo "Error: year must be YYYY." >&2; exit 1; }
[[ "$SOURCE_COMMIT" =~ ^[0-9a-fA-F]{7,64}$ ]] || { echo "Error: source commit must be a Git SHA." >&2; exit 1; }

EDITION_ROOT="$WAYBACK_ROOT/$YEAR"
SNAPSHOT="$EDITION_ROOT/src/archive/snapshots/$YEAR.json"
ASSETS="$EDITION_ROOT/public/archive-assets/$YEAR"

[[ -f "$EDITION_ROOT/package.json" ]] || {
  echo "Error: edition frontend does not exist: $EDITION_ROOT" >&2
  echo "Create the isolated $YEAR frontend before exporting its snapshot." >&2
  exit 1
}
[[ -f "$SERVER_ROOT/package.json" ]] || {
  echo "Error: sibling server repository does not exist: $SERVER_ROOT" >&2
  exit 1
}

if [[ -f "$SNAPSHOT" ]]; then
  read -r -p "A snapshot already exists for $YEAR. Type OVERWRITE to replace it: " overwrite
  [[ "$overwrite" == "OVERWRITE" ]] || { echo "Snapshot export cancelled."; exit 0; }
fi

echo "Exporting public $YEAR data to $SNAPSHOT"
npm --prefix "$SERVER_ROOT" run archive:export -- \
  --year "$YEAR" \
  --source-commit "$SOURCE_COMMIT" \
  --output "$SNAPSHOT" \
  --assets-dir "$ASSETS"

echo "Next: cd \"$EDITION_ROOT\" && npm run archive:verify -- --year $YEAR && npm run build:archive -- --year $YEAR"
