"""Holes are measured from the face the tool enters, and that end is the hole's entry.

The MF corpus only drills from +Z, so these build parts in-test where the open end, counterbore or
countersink is on the *underside*: a recognizer that just took "the higher-Z end" would put the drill in the
wrong end, starting inside solid material.
"""
from __future__ import annotations

import pytest
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCone, BRepPrimAPI_MakeCylinder
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt

from app import config
from app.services.feature_recognition import recognize_features
from app.services.step_loader import load_step

H = 20.0   # plate thickness; top face at Z=20, bottom at Z=0


def _plate():
    return BRepPrimAPI_MakeBox(gp_Pnt(0, 0, 0), gp_Pnt(60, 40, H)).Shape()


def _cyl(origin, direction, r, h):
    return BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(*origin), gp_Dir(*direction)), r, h).Shape()


def _cut(a, b):
    return BRepAlgoAPI_Cut(a, b).Shape()


def _hole(shape):
    holes = [f for f in recognize_features(shape) if f.type.value == "hole"]
    assert len(holes) == 1, [h.params for h in holes]
    return holes[0].params


def _corpus_hole(stem):
    return _hole(load_step(str(config.SAMPLES_DIR / "mf_corpus" / f"{stem}.step")).shape)


def _plan(shape):
    feats = [f.to_dict() for f in recognize_features(shape)]
    bbox = {"min": [0.0, 0.0, 0.0], "max": [60.0, 40.0, H]}
    return run_manufacturing("PART", bbox, feats, [])


# --- recognition -------------------------------------------------------------------------------

@pytest.mark.parametrize("stem", ["h13_cyl_countersunk_hole", "h15_stepped_hole"])
def test_counterbore_shoulder_is_not_a_blind_floor(stem):
    """A counterbore's shoulder is perpendicular to the axis like a floor, but it sits between two
    diameters — not at the end of the stack — so a counterbored through hole is still through."""
    assert _corpus_hole(stem)["through"] is True


def test_stepped_hole_reports_each_step_depth_from_entry():
    p = _corpus_hole("h15_stepped_hole")
    assert p["steps"] == [{"diameter": 14.0, "depth": 5.0}, {"diameter": 10.0, "depth": 13.0},
                          {"diameter": 6.0, "depth": 20.0}]
    assert (p["counterbore_diameter"], p["counterbore_depth"]) == (14.0, 5.0)


def test_countersink_params():
    p = _corpus_hole("h14_taper_countersunk_hole")
    assert p["countersink_diameter"] == pytest.approx(16.0, abs=0.01)
    assert p["countersink_angle_deg"] == pytest.approx(90.0, abs=0.1)
    assert p["countersink_tip_depth"] == pytest.approx(8.0, abs=0.01)   # 90° tool: tip sits r below the face


def test_center_hole_depth_runs_from_the_part_surface():
    """The 60° cone leaves only 0.5 mm of pilot cylinder; the hole is still 8 deep from Z=20."""
    p = _corpus_hole("h16_center_hole")
    assert p["depth"] == pytest.approx(8.0, abs=0.01)
    assert p["entry"][2] == pytest.approx(H, abs=0.01)


def test_blind_hole_from_below_enters_from_below():
    p = _hole(_cut(_plate(), _cyl((30, 20, -1), (0, 0, 1), 4.0, 13.0)))   # Ø8, open at Z=0, floor at Z=12
    assert p["through"] is False
    assert p["access_dir"] == [0.0, 0.0, -1.0]
    assert p["entry"][2] == pytest.approx(0.0, abs=1e-3)
    assert p["bottom"][2] == pytest.approx(12.0, abs=1e-3)
    assert p["depth"] == pytest.approx(12.0, abs=1e-3)


def test_through_hole_enters_from_its_counterbored_side():
    """Counterbore on the underside: the hole is drilled from below, so its steps are measured from Z=0."""
    s = _cut(_plate(), _cyl((30, 20, -1), (0, 0, 1), 4.0, H + 2))
    s = _cut(s, _cyl((30, 20, -1), (0, 0, 1), 7.0, 7.0))                  # Ø14 × 6 deep from the bottom
    p = _hole(s)
    assert p["through"] is True
    assert p["access_dir"] == [0.0, 0.0, -1.0]
    assert p["entry"][2] == pytest.approx(0.0, abs=1e-3)
    assert (p["counterbore_diameter"], p["counterbore_depth"]) == (14.0, 6.0)


def test_countersink_on_the_underside():
    s = _cut(_plate(), _cyl((30, 20, -1), (0, 0, 1), 4.0, H + 2))
    cone = BRepPrimAPI_MakeCone(gp_Ax2(gp_Pnt(30, 20, 4.0), gp_Dir(0, 0, -1)), 4.0, 8.0, 4.0).Shape()
    p = _hole(_cut(s, cone))
    assert p["access_dir"] == [0.0, 0.0, -1.0]
    assert p["depth"] == pytest.approx(H, abs=1e-3)
    assert p["countersink_diameter"] == pytest.approx(16.0, abs=0.01)









