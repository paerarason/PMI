"""B2 — prismatic recognizers (pocket / slot / step) on the dedicated sample.

`demo_pocket_features.step` carries exactly one closed rectangular pocket, one blind slot and one open
corner step, so each recognizer branch has clean ground truth.
"""
from app import config
from app.services.feature_recognition import recognize_features
from app.services.step_loader import load_step


def _feats():
    return recognize_features(load_step(str(config.SAMPLES_DIR / "demo_pocket_features.step")).shape)


def _feats_filleted():
    return recognize_features(load_step(str(config.SAMPLES_DIR / "demo_pocket_filleted.step")).shape)


def _one(feats, kind):
    got = [f for f in feats if f.type.value == kind]
    assert len(got) == 1, f"expected exactly one {kind}, got {len(got)}"
    return got[0]


def test_closed_pocket():
    f = _one(_feats(), "pocket")
    p = f.params
    assert p["open"] is False and p["wall_count"] == 4
    assert round(p["length"]) == 40 and round(p["width"]) == 30 and round(p["depth"]) == 10
    assert p["floor_face_id"] not in p["wall_face_ids"]
    assert f.confidence > 0.8 and f.evidence


def test_blind_slot_by_aspect():
    f = _one(_feats(), "slot")
    p = f.params
    assert p["open"] is False and round(p["length"]) == 50 and round(p["width"]) == 12
    assert round(p["depth"]) == 8 and p["aspect"] >= 3.0     # long-narrow → slot, not pocket


def test_open_step():
    f = _one(_feats(), "step")
    p = f.params
    assert p["open"] is True and p["wall_count"] == 2 and round(p["depth"]) == 15


def test_floor_and_walls_are_claimed_once():
    """Every face belongs to at most one feature (floor/walls claimed away from the plane recognizer)."""
    feats = _feats()
    all_faces = [fid for f in feats for fid in f.face_ids]
    assert len(all_faces) == len(set(all_faces))
    # the six outer box faces remain bare planes; floor+walls do not
    assert sum(1 for f in feats if f.type.value == "plane") == 6


def test_flat_plate_has_no_prismatic_features():
    """Guard against false positives: a flat plate with through-holes has no pocket/slot/step."""
    feats = recognize_features(load_step(str(config.SAMPLES_DIR / "demo_bracket_pmi.step")).shape)
    assert not [f for f in feats if f.type.value in ("pocket", "slot", "step")]


def test_filleted_pocket_extracts_corner_radius():
    """A rounded-corner pocket → one pocket carrying its corner radius; the 90° corner cylinders must NOT
    be mis-read as holes (they belong to the pocket, capping the finishing-tool radius)."""
    feats = _feats_filleted()
    assert not [f for f in feats if f.type.value == "hole"]     # corner rounds are not holes
    f = _one(feats, "pocket")
    p = f.params
    assert len(p["corner_face_ids"]) == 4 and p["min_corner_radius"] == 6.0
    assert p["open"] is False and p["wall_count"] == 4
    assert round(p["length"]) == 40 and round(p["width"]) == 30 and round(p["depth"]) == 12


def test_straight_edge_round_not_a_shaft():
    """A filleted straight edge (partial external cylinder) is a round/edge-break, not a turnable shaft."""
    feats = recognize_features(load_step(str(config.SAMPLES_DIR / "comprehensive_pmi.step")).shape)
    rounds = [f for f in feats if f.type.value == "round"]
    assert any(round(r.params.get("radius") or 0) == 6 for r in rounds)
