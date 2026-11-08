#!/usr/bin/env bash
# Run the backend (FastAPI/uvicorn :8001) and frontend (Vite :5174) together. Ctrl+C stops both.
# The first run bootstraps the venv, the npm deps and the STEP samples if they are missing.
#
#   ./dev.sh              # start both
#   ./dev.sh --no-setup   # skip the bootstrap
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
SETUP=1
for arg in "$@"; do
  case "$arg" in
    --no-setup) SETUP=0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

if [[ $SETUP -eq 1 ]]; then
  if [[ ! -x "$BACKEND/.venv/bin/uvicorn" ]]; then
    echo "[setup] creating backend venv + installing requirements…"
    python3 -m venv "$BACKEND/.venv"
    "$BACKEND/.venv/bin/pip" install -r "$BACKEND/requirements.txt"
  fi
  if [[ ! -d "$FRONTEND/node_modules" ]]; then
    echo "[setup] installing frontend npm deps…"
    (cd "$FRONTEND" && npm install)
  fi
  if [[ ! -f "$BACKEND/samples/demo_bracket_pmi.step" ]]; then
    echo "[setup] generating the STEP samples (they are not kept in git)…"
    (cd "$BACKEND" && .venv/bin/python scripts/make_samples.py)
  fi
fi

pids=()
cleanup() {
  echo ""
  echo "[dev] shutting down…"
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "[dev] starting backend  → http://localhost:8001"
(
  cd "$BACKEND"
  exec .venv/bin/uvicorn app.main:app --reload --port 8001
) 2>&1 | sed -u 's/^/[backend] /' &
pids+=($!)

echo "[dev] starting frontend → http://localhost:5174"
(
  cd "$FRONTEND"
  exec npm run dev
) 2>&1 | sed -u 's/^/[frontend] /' &
pids+=($!)

echo "[dev] both running. Open http://localhost:5174  (Ctrl+C to stop both)"
wait
