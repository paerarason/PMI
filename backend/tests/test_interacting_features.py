"""WP-9: recognition on the interacting-feature set (samples/interacting_corpus, scripts/make_interacting_corpus.py).

Each part has two features that meet (a hole through a pocket floor, into a chamfer, through a boss, …). The
ground truth (ground_truth.json) was written by hand from each builder's geometry before the recognizer
was run on it. It is synthetic and written by us, so this is a regression set, not an accuracy figure
(RISKS R14).

Checked per part: the multiset of non-plane archetypes; every true hole matched by diameter, through/blind,
access direction ("±" = either sense, "oblique" = not axis-aligned), depth and counterbore where the truth
gives them; and the pocket's MFDataset class where the truth gives it.

`RESULTS` records the first run (before any recognizer change) and what changed since:
* i01, i06, i11 — a closed pocket read as `opened_pocket`: the rim of a hole drilled into the floor counted
  as an open side. Fixed in PrismaticRecognizer._build (a floor edge shared with a coaxial internal
  cylinder/cone is not an open side).
* i08 — a through hole from the −Y face into an enclosed pocket got access +Y, an entry no straight tool can
  reach. Fixed in HoleRecognizer: when nothing marks a through hole's entry, an end with no line of sight
  out along the axis gives way to one that has it.
  The i08 truth was first written "±Y"; on review only −Y is reachable, so it was tightened to −Y. That
  exposed the error rather than hiding it.
Status `GAP` would be `xfail(strict=True)`, as in test_mf_coverage.py. None remains on this set.
"""
from __future__ import annotations

import json
from collections import Counter

import pytest

from app import config
from app.services.feature_recognition import recognize_features


def dir_name(v):
    """'+Z', '-X', … for an axis-aligned direction, otherwise the rounded vector."""
    n = sum(c * c for c in v) ** 0.5
    a = [c / n for c in v]
    for i, ax in enumerate("XYZ"):
        if abs(abs(a[i]) - 1.0) < 1e-6:
            return f"{'+' if a[i] > 0 else '-'}{ax}"
    return "[" + ", ".join(f"{c:.3f}" for c in a) + "]"

from app.services.step_loader import load_step

DIR = config.SAMPLES_DIR / "interacting_corpus"
TRUTH = json.loads((DIR / "ground_truth.json").read_text())["parts"]
OK, GAP = "OK", "GAP"

# part -> (status now, first-run result before any recognizer change)
RESULTS = {
    "i01_hole_through_pocket_floor":    (OK, "pocket read as opened_pocket (hole rim counted as an open side)"),
    "i02_hole_breaks_into_chamfer":     (OK, "correct"),
    "i03_tapped_hole_near_edge":        (OK, "correct"),
    "i04_cross_drilled_holes":          (OK, "correct"),
    "i05_hole_in_slot_floor":           (OK, "correct"),
    "i06_counterbore_in_pocket":        (OK, "pocket read as opened_pocket (counterbore rim counted as an open side)"),
    "i07_hole_on_step_floor":           (OK, "correct"),
    "i08_side_hole_into_pocket":        (OK, "hole access +Y: entry inside the enclosed pocket"),
    "i09_hole_through_boss":            (OK, "correct"),
    "i10_opposed_holes_meet":           (OK, "correct (one counterbored through hole)"),
    "i11_hole_breaks_into_pocket_wall": (OK, "pocket read as opened_pocket"),
    "i12_hole_on_inclined_face":        (OK, "correct (oblique access 0, 0.5, 0.866)"),
}


def test_every_part_has_a_result_row():
    assert sorted(RESULTS) == sorted(TRUTH) and len(TRUTH) >= 10


def _access_ok(want: str, got) -> bool:
    name = dir_name(got)
    if want == "oblique":
        return name.startswith("[")
    if want.startswith("±"):
        return name[1:] == want[1:]
    return name == want


def _hole_matches(t: dict, f) -> bool:
    p = f.params
    return (abs(p["diameter"] - t["diameter"]) <= 0.01 and bool(p["through"]) == t["through"]
            and _access_ok(t["access_dir"], p["access_dir"])
            and ("depth" not in t or abs(p["depth"] - t["depth"]) <= 0.05)
            and ("counterbored" not in t or bool(p.get("counterbored")) == t["counterbored"]))


@pytest.mark.parametrize("stem", list(TRUTH))
def test_interacting_part(stem, request):
    status, first_run = RESULTS[stem]
    if status == GAP:
        request.node.add_marker(pytest.mark.xfail(strict=True, reason=first_run))
    truth = TRUTH[stem]["features"]
    feats = recognize_features(load_step(str(DIR / f"{stem}.step")).shape)
    assert Counter(f.type.value for f in feats if f.type.value != "plane") == Counter(t["type"] for t in truth)
    holes = [f for f in feats if f.type.value == "hole"]
    for t in (t for t in truth if t["type"] == "hole"):
        assert any(_hole_matches(t, f) for f in holes), (t, [h.params for h in holes])
    for t in (t for t in truth if t.get("mf_class")):
        assert t["mf_class"] in {f.mf_class for f in feats if f.type.value == t["type"]}, t
