"""Generate every STEP file the tests and the Samples menu use.

The STEP files are not kept in git: they are generated here, from code. Run it once after cloning:

    .venv/bin/python scripts/make_samples.py

It writes backend/samples/*.step (PMI demo parts), backend/samples/mf_corpus/ (one part per machining-feature class)
and backend/samples/interacting_corpus/ (features that cut into each other).
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
GENERATORS = ["make_sample.py", "make_sample_shaft.py", "make_sample_comprehensive.py", "make_sample_pocket.py",
              "make_sample_pocket_filleted.py", "make_mf_corpus.py", "make_interacting_corpus.py"]


def main() -> int:
    failed = []
    for name in GENERATORS:
        r = subprocess.run([sys.executable, str(HERE / name)], cwd=HERE.parent, capture_output=True, text=True)
        print(f"{'ok  ' if r.returncode == 0 else 'FAIL'} {name}")
        if r.returncode != 0:
            failed.append(name)
            print(r.stdout[-800:] + r.stderr[-800:])
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
