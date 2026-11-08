import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def _samples():
    """The STEP samples are not in git: generate them (scripts/make_samples.py) when they are missing."""
    if not (ROOT / "samples" / "demo_bracket_pmi.step").exists() or not (ROOT / "samples" / "mf_corpus").exists():
        subprocess.run([sys.executable, str(ROOT / "scripts" / "make_samples.py")], check=True, cwd=ROOT)


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def demo_model(client):
    """Function-scoped on purpose: the model store is a bounded LRU (config.MAX_CACHED_MODELS), and the
    PMI add/edit tests ingest a new model per call, so a session-scoped ingest gets evicted mid-run and
    every later test 404s. Re-ingesting per test also keeps each one working from an untouched model."""
    r = client.post("/api/models/samples/demo_bracket_pmi.step")
    assert r.status_code == 200, r.text
    return r.json()
