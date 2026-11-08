"""Deterministic feature recognition + the feature-review API."""
from collections import Counter

from app import config
from app.services.feature_recognition import recognize_features
from app.services.step_loader import load_step


def _feats(name):
    return recognize_features(load_step(str(config.SAMPLES_DIR / name)).shape)


def test_bracket_holes_and_planes():
    feats = _feats("demo_bracket_pmi.step")
    kinds = Counter(f.type.value for f in feats)
    assert kinds["hole"] == 2 and kinds["plane"] == 6
    holes = [f for f in feats if f.type.value == "hole"]
    dias = sorted(round(h.params["diameter"]) for h in holes)
    assert dias == [10, 16]                       # bore Ø16 + hole Ø10
    assert all(h.params["through"] for h in holes)  # a flat bracket plate → both through
    assert all(0 < h.confidence <= 1 and h.evidence for h in holes)


def test_shaft_has_shaft_and_hole():
    feats = _feats("demo_shaft_pmi.step")
    kinds = Counter(f.type.value for f in feats)
    assert kinds["shaft"] >= 1 and kinds["hole"] >= 1


def test_comprehensive_counterbore_and_sphere():
    feats = _feats("comprehensive_pmi.step")
    holes = [f for f in feats if f.type.value == "hole"]
    assert any(h.params.get("counterbored") for h in holes)             # stepped counterbore present
    assert any(f.type.value == "spherical_boss" for f in feats)          # hemispherical boss
    # a face belongs to at most one feature (engine claims faces in priority order)
    all_faces = [fid for f in feats for fid in f.face_ids]
    assert len(all_faces) == len(set(all_faces))


def test_ids_are_stable_across_runs():
    a = [f.id for f in _feats("comprehensive_pmi.step")]
    b = [f.id for f in _feats("comprehensive_pmi.step")]
    assert a == b and a == sorted(a)


# --- API / review workflow -------------------------------------------------------------------

def test_features_endpoint_and_summary(client, demo_model):
    mid = demo_model["model_id"]
    assert demo_model["feature_count"] == len(demo_model["features"]) > 0
    r = client.get(f"/api/models/{mid}/features")
    assert r.status_code == 200
    feats = r.json()
    hole = next(f for f in feats if f["type"] == "hole")
    assert hole["state"] == "detected" and hole["evidence"] and 0 < hole["confidence"] <= 1




