"""Regenerate the feature-recognition golden files from the current recognizer output.

    .venv/bin/python scripts/gen_fr_golden.py

Run this only when a recognizer change is a *deliberate, reviewed* improvement — the golden files are the
accuracy baseline `tests/test_fr_accuracy.py` guards against regressions, so review the git diff of
`tests/fr_golden/*.json` before committing (a shrink in detections is a red flag, not a rubber stamp).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from app import config  # noqa: E402
from app.services.feature_recognition import recognize_features  # noqa: E402
from app.services.step_loader import load_step  # noqa: E402
from fr_harness import GOLDEN_DIR, to_golden_features  # noqa: E402

SAMPLES = [
    "demo_bracket_pmi.step",
    "demo_shaft_pmi.step",
    "comprehensive_pmi.step",
    "ap242_mbd_tolerance_sample.step",
    "demo_pocket_features.step",
    "demo_pocket_filleted.step",
]


def main():
    GOLDEN_DIR.mkdir(parents=True, exist_ok=True)
    for name in SAMPLES:
        feats = recognize_features(load_step(str(config.SAMPLES_DIR / name)).shape)
        golden = {"sample": name, "features": to_golden_features(feats)}
        (GOLDEN_DIR / f"{name}.json").write_text(json.dumps(golden, indent=2) + "\n")
        print(f"{name}: {len(golden['features'])} features → {name}.json")


if __name__ == "__main__":
    main()
