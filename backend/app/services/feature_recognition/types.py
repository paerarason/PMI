"""Feature data model: types, lifecycle state, and the recognizer output record."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class FeatureType(str, Enum):
    HOLE = "hole"                  # internal cylinder (may be counterbored/countersunk/stepped/threaded)
    SHAFT = "shaft"                # external cylinder (pin / boss / journal)
    PLANE = "plane"                # planar face
    CHAMFER = "chamfer"            # external cone (edge break / taper)
    COUNTERSINK = "countersink"    # internal cone (usually paired with a hole)
    FILLET = "fillet"              # concave torus (internal blend)
    ROUND = "round"                # convex torus (external blend)
    SPHERICAL_SEAT = "spherical_seat"  # internal sphere
    SPHERICAL_BOSS = "spherical_boss"  # external sphere
    POCKET = "pocket"              # closed prismatic recess: planar floor + walled loop
    SLOT = "slot"                  # long-narrow prismatic recess (high aspect ratio)
    GROOVE = "groove"              # annular turned recess (ring / O-ring / retaining-ring groove)
    STEP = "step"                  # open prismatic recess: floor + walls open to the outside
    BOSS = "boss"                  # prismatic protrusion standing on a base face (MFDataset "convex hull")
    RIB = "rib"                    # wedge gusset protruding in an internal corner
    UNKNOWN = "unknown"


class FeatureState(str, Enum):
    """Lifecycle of a feature through the review workflow (spec §12)."""

    DETECTED = "detected"          # auto-recognized, awaiting review
    ACCEPTED = "accepted"          # reviewer approved as-is
    MODIFIED = "modified"          # reviewer edited a parameter/type then approved
    REJECTED = "rejected"          # reviewer discarded (not a real feature / not of interest)
    MANUAL = "manual"              # created by the user, not auto-detected


@dataclass
class FeatureCandidate:
    """One recognized (or manually created) manufacturing feature, linked to CAD topology.

    `type` is the process archetype CAPP switches on; `mf_class` narrows it to the MFDataset leaf for
    traceability against the reference taxonomy (see taxonomy.py).

    `params` carries type-specific geometry (diameter, depth, axis, origin, through, angle, area, …).
    `original_params` snapshots the auto-detected values when a reviewer edits, for traceability (§10).
    """

    id: str
    type: FeatureType
    mf_class: str | None = None     # MFDataset leaf (taxonomy.MF_CLASSES), derived from type + params
    face_ids: list[int] = field(default_factory=list)
    edge_ids: list[int] = field(default_factory=list)
    params: dict = field(default_factory=dict)
    confidence: float = 1.0
    evidence: list[str] = field(default_factory=list)
    state: FeatureState = FeatureState.DETECTED
    source: str = "auto"           # "auto" | "manual"
    original_params: dict | None = None
    # How it was found: a code per recognizer (COAXIAL_INTERNAL_CYLINDERS, CONCAVE_FLOOR_AND_WALLS, …),
    # UNCLAIMED_FACE_REGION for curved faces no recognizer could explain, MANUAL for one a person added.
    recognition_method: str = ""
    # Other readings of the same faces, each {label, type, params (a patch), confidence, method, reason}: from a
    # recognizer whose decision sat near its threshold, or from another recognizer that would have read the
    # faces differently had this one not claimed them (engine.py). `ambiguous` when one is about as likely.
    alternatives: list[dict] = field(default_factory=list)
    ambiguous: bool = False

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type.value,
            "mf_class": self.mf_class,
            "face_ids": self.face_ids,
            "edge_ids": self.edge_ids,
            "params": self.params,
            "confidence": round(self.confidence, 3),
            "evidence": self.evidence,
            "state": self.state.value,
            "source": self.source,
            "original_params": self.original_params,
            "recognition_method": self.recognition_method,
            "alternatives": self.alternatives,
            "ambiguous": self.ambiguous,
        }
