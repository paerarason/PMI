"""Competing readings of the same faces (feature_recognition/engine.py add_rival_readings, recognizers'
near-threshold alternatives, POST /features/{id}/choose)."""
from pathlib import Path

from app.services.feature_recognition.engine import add_rival_readings, recognize_with_topology
from app.services.feature_recognition.recognizers import ChannelRecognizer, FeatureRecognizer
from app.services.feature_recognition.topology import build_topology
from app.services.feature_recognition.types import FeatureCandidate, FeatureType
from app.services.step_loader import load_step

CORPUS = Path(__file__).resolve().parent.parent / "samples" / "mf_corpus"


class _Reads(FeatureRecognizer):
    """A stub recognizer that reads fixed faces as a fixed type."""

    def __init__(self, name, ftype, faces, confidence):
        self.name, self.ftype, self.faces, self.confidence = name, ftype, faces, confidence

    def detect(self, topo, claimed):
        if claimed & set(self.faces):
            return []
        return [FeatureCandidate(id="", type=self.ftype, face_ids=list(self.faces), confidence=self.confidence,
                                 evidence=[f"stub {self.name}"])]


def test_the_reading_that_lost_the_claim_is_kept_as_an_alternative():
    boss = FeatureCandidate(id="BOSS-001", type=FeatureType.BOSS, face_ids=[1, 2, 3], confidence=0.85)
    hole = FeatureCandidate(id="HOLE-001", type=FeatureType.HOLE, face_ids=[7], confidence=0.9)
    found = [boss, hole]
    add_rival_readings(found, object(), [
        _Reads("protrusion", FeatureType.BOSS, [1, 2, 3], 0.85),      # the same reading: not an alternative
        _Reads("rib_reader", FeatureType.RIB, [1, 2, 3], 0.8),        # same faces, other type: an alternative
        _Reads("swallow", FeatureType.POCKET, [1, 2, 3, 7], 0.9),     # also takes the hole: another decomposition
        _Reads("tiny", FeatureType.CHAMFER, [1], 0.9),                # a third of the faces: not the same reading
    ])
    assert [a["type"] for a in boss.alternatives] == ["rib"]
    assert boss.alternatives[0]["method"] == "RIB_READER" and "reads 3 of its 3 face(s)" in boss.alternatives[0]["reason"]
    assert hole.alternatives == []


def test_a_keyway_near_the_slot_pocket_split_says_so():
    feats, _ = recognize_with_topology(load_step(str(CORPUS / "s07_keyway_c.step")).body)
    slot = next(f for f in feats if f.type == FeatureType.SLOT)
    assert slot.ambiguous and slot.alternatives[0]["type"] == "pocket"
    assert slot.alternatives[0]["method"] == "NEAR_THRESHOLD" and "separates a slot from a pocket" in slot.alternatives[0]["reason"]
    # a clear case stays unambiguous
    feats, _ = recognize_with_topology(load_step(str(CORPUS / "h11_round_through_hole.step")).body)
    assert not any(f.ambiguous or f.alternatives for f in feats)


def test_the_channel_recognizer_does_not_read_a_bore_whatever_ran_first():
    topo = build_topology(load_step(str(CORPUS / "h11_round_through_hole.step")).body)
    assert ChannelRecognizer().detect(topo, set()) == []


