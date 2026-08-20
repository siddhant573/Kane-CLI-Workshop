#!/usr/bin/env bash
# Reset to a clean slate: stop a stray local server and clear kane-cli run outputs.
#   ./reset.sh          use the default port (4173)
#   ./reset.sh 5173     use a different port
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-${PORT:-4173}}"

echo "▸ Stopping any static server on port ${PORT}…"
PIDS="$(lsof -ti tcp:"${PORT}" 2>/dev/null || true)"
if [ -n "$PIDS" ]; then kill $PIDS 2>/dev/null || true; echo "  stopped."; else echo "  none running."; fi

echo "▸ Cleaning transient kane-cli run outputs…"
find "$HERE" -maxdepth 2 -type d -name 'output-*' -prune -exec rm -rf {} + 2>/dev/null || true

echo "✓ Reset complete. Start again with:  ./serve.sh"
