#!/usr/bin/env bash
# Serve the V16 Food web app locally for the workshop.
# Run this in its own terminal tab; drive it from another with kane-cli.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-${PORT:-4173}}"

echo "▸ Serving V16 Food (web) at http://localhost:${PORT}"
echo "  root: ${HERE}/app   ·   Ctrl-C to stop"
cd "$HERE/app"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
