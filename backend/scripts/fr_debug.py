"""FR microscope (PLAN.md A3): dump faces + edge-convexity per sample.

    .venv/bin/python scripts/fr_debug.py [sample.step ...]

Prints, per sample: face-type and edge-convexity histograms, then the face pair (surface type +
material side) on each concave / convex / tangent edge — the quickest way to eyeball whether the
topology + convexity classification match physical reality before writing a recognizer against them.
"""
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app import config  # noqa: E402
from app.services.feature_recognition.topology import build_topology  # noqa: E402
from app.services.step_loader import load_step  # noqa: E402

DEFAULT = ["demo_bracket_pmi.step", "demo_shaft_pmi.step",
           "comprehensive_pmi.step", "ap242_mbd_tolerance_sample.step"]


def dump(name):
    topo = build_topology(load_step(str(config.SAMPLES_DIR / name)).shape)
    print(f"\n{'='*70}\n{name}\n{'='*70}")
    print(f"faces={len(topo.faces)}  edges={len(topo.edge_faces)}")
    print(f"face types:      {dict(Counter(f.surface_type for f in topo.faces.values()))}")
    print(f"edge convexity:  {dict(Counter(topo.edge_convexity.values()))}")

    def pair(eid):
        a, b = topo.edge_faces[eid]
        fa, fb = topo.faces[a], topo.faces[b]
        return f"e{eid}: {fa.surface_type}/{fa.material_side} <-> {fb.surface_type}/{fb.material_side}"

    for kind in ("concave", "convex", "tangent"):
        ids = sorted(e for e, k in topo.edge_convexity.items() if k == kind)
        print(f"\n  {kind} ({len(ids)}):")
        for eid in ids[:12]:
            print("    " + pair(eid))
        if len(ids) > 12:
            print(f"    ... +{len(ids) - 12} more")


if __name__ == "__main__":
    for n in sys.argv[1:] or DEFAULT:
        try:
            dump(n)
        except Exception as e:  # noqa: BLE001
            print(f"{n}: ERROR {type(e).__name__}: {e}")
