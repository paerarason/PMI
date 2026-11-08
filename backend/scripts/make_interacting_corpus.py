"""Generate the interacting-feature test set (WP-9): blocks where two features meet, so the per-face patterns
the recognizers rely on are broken (RISKS R4).

Each builder returns (shape, ground truth, note). The ground truth is written by hand from the geometry the
builder cuts, *before* the recognizer is run on it. It is still a synthetic set written by us, so it is not
an independent benchmark (RISKS R14). Results are recorded in tests/test_interacting_features.py.

    .venv/bin/python scripts/make_interacting_corpus.py     # writes backend/samples/interacting_corpus/
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from make_mf_corpus import _box, _chamfer, _cut, _cyl, _fuse, _prism, write_step  # noqa: E402

from app import config  # noqa: E402

OUT_DIR = config.SAMPLES_DIR / "interacting_corpus"
W, D, H = 80.0, 60.0, 30.0             # standard block: X, Y, Z (top face at Z=30)


def block():
    return _box(0, 0, 0, W, D, H)


def hole(d, through, access, **extra):
    return {"type": "hole", "diameter": d, "through": through, "access_dir": access, **extra}


def i01_hole_through_pocket_floor():
    s = _cut(block(), _box(20, 15, 20, 60, 45, H + 1))               # closed pocket 40 × 30 × 10
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 4.0, 22))               # Ø8 through the pocket floor
    return s, [{"type": "pocket", "mf_class": "closed_pocket"}, hole(8.0, True, "+Z", depth=20.0)], "hole drilled from the pocket floor"


def i02_hole_breaks_into_chamfer():
    s = _chamfer(block(), (W / 2, 0, H), 5.0)                         # 5 mm chamfer on the top-front edge
    s = _cut(s, _cyl((40, 6, 15), (0, 0, 1), 3.0, 16))                # Ø6 × 15 blind, rim crosses the chamfer
    return s, [{"type": "chamfer"}, hole(6.0, False, "+Z", depth=15.0)], "hole entry runs into a chamfer"


def i03_tapped_hole_near_edge():
    s = _cut(block(), _cyl((5.0, 30, 15), (0, 0, 1), 3.4, 16))        # Ø6.8 × 15, 1.6 mm wall to the −X face
    return s, [hole(6.8, False, "+Z", depth=15.0)], "M8 tap drill with a 1.6 mm wall to the edge"


def i04_cross_drilled_holes():
    s = _cut(block(), _cyl((-1, 30, 15), (1, 0, 0), 4.0, W + 2))      # Ø8 through along X
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 3.0, H + 2))            # Ø6 through along Z, crossing it
    return s, [hole(8.0, True, "±X"), hole(6.0, True, "±Z")], "two through holes that intersect"


def i05_hole_in_slot_floor():
    s = _cut(block(), _box(-1, 24, 22, W + 1, 36, H + 1))             # through slot 12 wide × 8 deep along X
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 2.5, 24))               # Ø5 through the slot floor
    return s, [{"type": "slot"}, hole(5.0, True, "+Z", depth=22.0)], "hole drilled from a slot floor"


def i06_counterbore_in_pocket():
    s = _cut(block(), _box(20, 15, 22, 60, 45, H + 1))                # pocket 40 × 30 × 8
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 3.3, 24))               # Ø6.6 through
    s = _cut(s, _cyl((40, 30, 22 - 6.5), (0, 0, 1), 5.5, 7.0))        # Ø11 × 6.5 counterbore from the pocket floor
    return s, [{"type": "pocket", "mf_class": "closed_pocket"}, hole(6.6, True, "+Z", counterbored=True)], "M6 counterbore in a pocket floor"


def i07_hole_on_step_floor():
    s = _cut(block(), _box(W - 20, -1, 20, W + 1, D + 1, H + 1))      # open step 20 wide × 10 deep on +X
    s = _cut(s, _cyl((70, 30, 12), (0, 0, 1), 3.0, 9))                # Ø6 × 8 blind on the step floor
    return s, [{"type": "step"}, hole(6.0, False, "+Z", depth=8.0)], "hole on the lower face of a step"


def i08_side_hole_into_pocket():
    s = _cut(block(), _box(20, 15, 10, 60, 45, H + 1))                # pocket 40 × 30 × 20
    s = _cut(s, _cyl((40, -1, 20), (0, 1, 0), 3.0, 17))               # Ø6 from −Y through the 15 mm wall
    # The inner end opens into the enclosed pocket: no spindle reaches it along Y, so only −Y is an entry.
    return s, [{"type": "pocket", "mf_class": "closed_pocket"}, hole(6.0, True, "-Y", depth=15.0)], "side hole breaking into a pocket"


def i09_hole_through_boss():
    s = _fuse(_box(0, 0, 0, W, D, 15), _cyl((40, 30, 15), (0, 0, 1), 10.0, 10))   # Ø20 × 10 boss on a plate
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 4.0, 27))               # Ø8 through boss and plate
    return s, [{"type": "shaft"}, hole(8.0, True, "±Z", depth=25.0)], "hole through a cylindrical boss"


def i10_opposed_holes_meet():
    s = _cut(block(), _cyl((40, 30, H - 12), (0, 0, 1), 5.0, 13))     # Ø10 × 12 from the top
    s = _cut(s, _cyl((40, 30, -1), (0, 0, 1), 3.0, 21))               # Ø6 × 20 from the bottom: they meet
    return s, [hole(6.0, True, "±Z", counterbored=True)], "two coaxial blind holes from opposite sides meet"


def i11_hole_breaks_into_pocket_wall():
    s = _cut(block(), _box(20, 15, 20, 60, 45, H + 1))                # pocket 40 × 30 × 10
    s = _cut(s, _cyl((16, 30, 10), (0, 0, 1), 6.0, 21))               # Ø12 × 20, its side cuts into the pocket
    return s, [{"type": "pocket", "mf_class": "closed_pocket"}, hole(12.0, False, "+Z", depth=20.0)], "hole overlapping a pocket wall"


def i12_hole_on_inclined_face():
    t30 = math.tan(math.radians(30))
    # Remove everything above the plane z = 30 − (y − 40)·tan30: a 30° slope from the top edge at y=40 down
    # to z≈18.5 at the back face. Its outward normal is (0, sin30, cos30).
    s = _cut(block(), _prism([(-1, 40, H), (-1, D + 1, H - (D + 1 - 40) * t30), (-1, D + 1, H + 1), (-1, 40, H + 1)],
                             (W + 2, 0, 0)))
    n = (0.0, math.sin(math.radians(30)), math.cos(math.radians(30)))
    c = (40.0, 50.0, H - 10.0 * math.tan(math.radians(30)))           # a point on the slope
    s = _cut(s, _cyl(tuple(c[i] - 10 * n[i] for i in range(3)), n, 3.0, 12))      # Ø6 × 10 normal to the slope
    return s, [hole(6.0, False, "oblique", depth=10.0)], "hole normal to a 30° inclined face"


BUILDERS = [i01_hole_through_pocket_floor, i02_hole_breaks_into_chamfer, i03_tapped_hole_near_edge,
            i04_cross_drilled_holes, i05_hole_in_slot_floor, i06_counterbore_in_pocket, i07_hole_on_step_floor,
            i08_side_hole_into_pocket, i09_hole_through_boss, i10_opposed_holes_meet,
            i11_hole_breaks_into_pocket_wall, i12_hole_on_inclined_face]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    truth = {}
    for b in BUILDERS:
        shape, feats, note = b()
        write_step(shape, OUT_DIR / f"{b.__name__}.step", f"IF-{b.__name__.upper()}")
        truth[b.__name__] = {"note": note, "features": feats}
        print(f"  {b.__name__:34s} {note}")
    (OUT_DIR / "ground_truth.json").write_text(json.dumps(
        {"status": "Ground truth written by hand from each builder's geometry, before running the recognizer. "
                   "Synthetic and written by us: not an independent benchmark (RISKS R14).",
         "parts": truth}, indent=2) + "\n")
    print(f"\n{len(BUILDERS)} parts written to {OUT_DIR}")


if __name__ == "__main__":
    main()
