"""Runtime configuration (env-driven)."""
from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", BASE_DIR / "uploads")).resolve()
SAMPLES_DIR = BASE_DIR / "samples"
MAX_CACHED_MODELS = 20
