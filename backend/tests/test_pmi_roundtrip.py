"""A PMI write rewrites the whole STEP file, so it must leave every other characteristic as it was.

OCCT's reader and writer do not agree with each other on three points, and each one used to damage PMI that
nobody had edited:

* the reader loads a datum-referenced angularity, concentricity, coaxiality or circular run-out as a
  position tolerance, and the writer saved it as one;
* the reader gives an angle in degrees, and the writer tags whatever it holds as radians (90° became
  5156.6°);
* the writer negates the lower deviation it is given, so a signed -0.02 went into the file as +0.02.

`pmi_writer` now repairs the document before writing, and the router refuses a write that still changes
a characteristic it was not asked to change (real files: OCCT cannot always put their PMI back).
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

from app import config
from app.routers import models as models_router
from app.services import model_checks, pmi_extractor
from app.services.step_loader import load_step
from app.services.step_text_utils import dewrap
from app.store import store

CACHE = Path(__file__).resolve().parent.parent / "benchmark" / "data"
SAMPLES = ("demo_bracket_pmi.step", "demo_shaft_pmi.step", "comprehensive_pmi.step")


def _load(client, sample: str) -> dict:
    r = client.post(f"/api/models/samples/{sample}")
    assert r.status_code == 200, r.text
    return r.json()


def _add_flatness(client, model: dict):
    plane = next(f for f in model["features"] if f["type"] == "plane")["face_ids"][0]
    return client.post(f"/api/models/{model['model_id']}/pmi",
                       json={"kind": "geom_tolerance", "type_label": "Flatness", "feature_name": "probe flat",
                             "refs": [{"kind": "face", "ref_id": plane}], "value": 0.07})


def _by_faces(model: dict, type_label: str, faces: list[int]) -> dict:
    return next(c for c in model["characteristics"] if c["type_label"] == type_label and sorted(c["face_ids"]) == sorted(faces))


# --- a write leaves the rest of the drawing alone -----------------------------------------------------------

@pytest.mark.parametrize("sample", SAMPLES)
def test_adding_one_tolerance_changes_nothing_else(client, sample):
    before = _load(client, sample)
    r = _add_flatness(client, before)
    assert r.status_code == 200, r.text
    after = r.json()
    assert len(after["characteristics"]) == len(before["characteristics"]) + 1
    assert model_checks.pmi_damaged_by_write(before["characteristics"], after["characteristics"]) == []


def test_tolerance_types_survive_a_write(client):
    """These four came back as Position after any write to the file."""
    before = _load(client, "comprehensive_pmi.step")
    after = _add_flatness(client, before).json()
    for kind in ("Angularity", "Concentricity", "Coaxiality", "Circular Runout"):
        old = next(c for c in before["characteristics"] if c["type_label"] == kind)
        new = _by_faces(after, kind, old["face_ids"])
        assert new["usl"] == pytest.approx(old["usl"]) and new["datum_refs"] == old["datum_refs"]


def test_an_angle_is_read_in_degrees_with_its_tolerance_in_degrees(client):
    """The generator asks for 90° ± 0.5°. Written with the deviations in degrees but tagged as radians,
    the sample read as 90° ± 28.65°."""
    angle = next(c for c in _load(client, "comprehensive_pmi.step")["characteristics"] if "Angular" in c["type_label"])
    assert (angle["nominal"], angle["lsl"], angle["usl"]) == pytest.approx((90.0, 89.5, 90.5))
    assert angle["unit"] == "deg"


def test_an_angle_survives_a_write_and_an_edit(client):
    before = _load(client, "comprehensive_pmi.step")
    angle = next(c for c in before["characteristics"] if "Angular" in c["type_label"])
    after = _add_flatness(client, before).json()
    kept = _by_faces(after, angle["type_label"], angle["face_ids"])
    assert (kept["nominal"], kept["lsl"], kept["usl"]) == pytest.approx((90.0, 89.5, 90.5))     # was 5156.6

    r = client.put(f"/api/models/{after['model_id']}/pmi/{kept['id']}",
                   json={"type_label": kept["type_label"], "feature_name": "wedge angle",
                         "refs": [{"kind": "face", "ref_id": f} for f in kept["face_ids"]],
                         "nominal": 90.0, "usl": 90.25, "lsl": 89.9})
    assert r.status_code == 200, r.text
    edited = _by_faces(r.json(), kept["type_label"], kept["face_ids"])
    assert (edited["nominal"], edited["lsl"], edited["usl"]) == pytest.approx((90.0, 89.9, 90.25))


def test_unequal_limits_are_written_and_read_as_given(client, demo_model):
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi",
                    json={"kind": "dimension", "type_label": "Radius", "feature_name": "fillet radius",
                          "refs": [{"kind": "face", "ref_id": 3}], "nominal": 4.0, "usl": 4.0, "lsl": 3.97})
    assert r.status_code == 200, r.text
    new = next(c for c in r.json()["characteristics"] if c["type_label"] == "Radius")
    assert (new["lsl"], new["usl"]) == pytest.approx((3.97, 4.0))

    # In the file, the lower bound is the negative number AP242 asks for, not its magnitude.
    text = dewrap(Path(store.get(r.json()["model_id"]).path).read_text())
    ents = dict(re.findall(r"#(\d+)\s*=\s*(.*?);\n", text, flags=re.S))
    bounds = []
    for body in ents.values():
        if body.startswith("TOLERANCE_VALUE"):
            lower, upper = (float(re.search(r"(-?\d[\d.]*(?:E[-+]?\d+)?)\s*\)?\s*,\s*#", ents[i]).group(1))
                            for i in re.findall(r"#(\d+)", body)[:2])
            bounds.append((lower, upper))
    assert (-0.03, 0.0) in [(round(lo, 6), round(up, 6)) for lo, up in bounds]
    assert all(lo <= up for lo, up in bounds)


# --- reading -------------------------------------------------------------------------------------------------

def test_a_lower_deviation_written_as_a_magnitude_is_not_swapped(tmp_path):
    """Older OCCT-written files give 0/-0.02 as (lower +0.02, upper 0). That is not a pair of swapped bounds
    (NIST D2MI-904's (+0.005, -0.005) is), and reading it as one turned the limit into +0.02/0."""
    text = dewrap((config.SAMPLES_DIR / "demo_shaft_pmi.step").read_text())
    legacy, n = re.subn(r"MEASURE_WITH_UNIT\(-2\.E-02,", "MEASURE_WITH_UNIT(2.E-02,", text)
    assert n >= 1
    path = tmp_path / "legacy_sign.step"
    path.write_text(legacy)
    chars, _datums, _source = pmi_extractor.extract_pmi(str(path), load_step(str(path)))
    journals = [c for c in chars if c.type_label == "Diameter" and c.nominal == 30.0]
    assert journals and all((c.lsl, c.usl) == pytest.approx((29.98, 30.0)) for c in journals)


def test_editing_one_of_two_equal_dimensions_shows_on_that_one(client):
    """The shaft's two journals are both Ø30 0/-0.02. After one was edited, each was shown with the
    other's limits: the readers' copies were paired by nominal alone."""
    shaft = _load(client, "demo_shaft_pmi.step")
    left, right = [c for c in shaft["characteristics"] if c["type_label"] == "Diameter" and c["nominal"] == 30.0]
    r = client.put(f"/api/models/{shaft['model_id']}/pmi/{left['id']}",
                   json={"type_label": "Diameter", "feature_name": "left journal dia",
                         "refs": [{"kind": "face", "ref_id": left["face_ids"][0]}],
                         "nominal": 30.0, "usl": 30.04, "lsl": 29.99})
    assert r.status_code == 200, r.text
    after = r.json()
    edited, untouched = _by_faces(after, "Diameter", left["face_ids"]), _by_faces(after, "Diameter", right["face_ids"])
    assert (edited["lsl"], edited["usl"]) == pytest.approx((29.99, 30.04))
    assert (untouched["lsl"], untouched["usl"]) == pytest.approx((right["lsl"], right["usl"]))


# --- the check that a write damaged nothing -----------------------------------------------------------------

def _char(cid, type_label="Diameter", nominal=10.0, usl=10.1, lsl=9.9, faces=(1,), datums=(), kind="dimension"):
    return {"id": cid, "kind": kind, "type_label": type_label, "nominal": nominal, "usl": usl, "lsl": lsl,
            "unit": "mm", "face_ids": list(faces), "datum_refs": list(datums)}


def test_damage_check_passes_when_ids_are_renumbered_and_one_is_added():
    before = [_char("C1"), _char("C2", faces=(2,))]
    after = [_char("C1", "Flatness", 0.0, 0.05, 0.0, (7,), kind="geom_tolerance"), _char("C2"), _char("C3", faces=(2,))]
    assert model_checks.pmi_damaged_by_write(before, after) == []


def test_damage_check_names_what_changed_and_what_is_gone():
    before = [_char("C1"), _char("C2", "Straightness", 0.0, 0.2, 0.0, (9,), kind="geom_tolerance"),
              _char("C3", "Position", 0.0, 0.8, 0.0, (4,), ("D", "E-F"), kind="geom_tolerance")]
    after = [_char("C1", usl=10.0, lsl=9.8), _char("C2", "Position", 0.0, 0.8, 0.0, (4,), ("D", "E", "F"), kind="geom_tolerance")]
    damage = model_checks.pmi_damaged_by_write(before, after)
    assert len(damage) == 3
    assert any(d.startswith("C1 Diameter") and "usl" in d and "lsl" in d for d in damage)
    assert "C2 Straightness would be lost" in damage
    assert any(d.startswith("C3 Position") and "datum_refs" in d for d in damage)


def test_damage_check_ignores_the_characteristic_being_edited():
    before = [_char("C1"), _char("C2", faces=(2,))]
    after = [_char("C1", usl=10.5), _char("C2", faces=(2,))]
    assert model_checks.pmi_damaged_by_write(before, after, edited_id="C1") == []
    assert len(model_checks.pmi_damaged_by_write(before, after)) == 1


def test_a_write_that_damages_other_pmi_is_refused_and_leaves_nothing_behind(client, demo_model, monkeypatch):
    monkeypatch.setattr(model_checks, "pmi_damaged_by_write", lambda *a, **k: ["C2 Straightness would be lost"])
    models_before = {m["model_id"] for m in client.get("/api/models").json()}
    files_before = set(config.UPLOAD_DIR.glob("*.step"))
    r = _add_flatness(client, demo_model)
    assert r.status_code == 422
    assert "Not saved" in r.json()["detail"] and "C2 Straightness would be lost" in r.json()["detail"]
    assert {m["model_id"] for m in client.get("/api/models").json()} == models_before
    assert set(config.UPLOAD_DIR.glob("*.step")) == files_before
    assert client.get(f"/api/models/{demo_model['model_id']}").json()["characteristics"] == demo_model["characteristics"]


def test_ftc_10_is_refused_with_the_characteristics_it_would_lose(client):
    """One added tolerance used to drop a straightness tolerance and merge three position tolerances."""
    if not (CACHE / "nist-pmi-step" / "parts" / "nist_ftc_10.stp").exists():
        pytest.skip("nist_ftc_10 is not in the benchmark cache")
    with open(CACHE / "nist-pmi-step" / "parts" / "nist_ftc_10.stp", "rb") as fh:
        model = client.post("/api/models", files={"file": ("nist_ftc_10.stp", fh, "application/octet-stream")}).json()
    r = _add_flatness(client, model)
    assert r.status_code == 422
    assert "Straightness would be lost" in r.json()["detail"]
    assert isinstance(models_router.store.get(model["model_id"]).characteristics, list)
