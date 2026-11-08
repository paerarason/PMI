"""The MFDataset machining-feature taxonomy, as data the code can be checked against.

Reference: `leiruoshan/MFPointNet_feature_dataset` — 33 machining-feature subcategories in 8 groups. That
dataset trains a *neural* classifier from point clouds; we recognize the same vocabulary *deterministically*
from the B-rep, so the taxonomy lives here as the shared contract: `tests/test_mf_coverage.py` scores one
corpus part per class against it, and every recognized feature carries the leaf class it resolved to.

**Why this is not just the `FeatureType` enum.** MFDataset's 33 leaves are shape variants; the machine only
cares about a far smaller set of *process archetypes* (you drill a hole, you mill a slot, you turn a groove).
So `FeatureType` stays the compact archetype set that CAPP switches on, and the MF leaf is derived from the
archetype plus its params by `classify()` below. Adding a leaf must not add a `FeatureType` unless it needs
a genuinely different toolpath — "round blind hole" and "round through hole" are one archetype and a
`through` flag, not two types.
"""
from __future__ import annotations

from dataclasses import dataclass

from app.services.feature_recognition.types import FeatureType

# The 8 top-level groups of the MFDataset tree.
GROUPS = ("slot", "hole", "step", "thread", "transition", "protrude", "based", "others")


@dataclass(frozen=True)
class MFClass:
    """One leaf of the MFDataset tree, and how this codebase represents it."""

    key: str                     # stable snake_case id, used by the corpus + tests
    label: str                   # the name as the MFDataset tree spells it
    group: str                   # one of GROUPS
    archetype: FeatureType       # the FeatureType a recognizer emits for it
    note: str = ""               # how it is told apart from its siblings


def _c(key, label, group, archetype, note=""):
    return MFClass(key, label, group, archetype, note)


# --- the 33 classes ----------------------------------------------------------------------------
MF_CLASSES: dict[str, MFClass] = {c.key: c for c in (
    # Slot (10) — milled channels and turned grooves. Told apart by cross-section profile and ends.
    _c("t_through_slot",        "T-through slot",        "slot", FeatureType.SLOT,   "undercut head wider than the mouth"),
    _c("v_through_slot",        "V-through slot",        "slot", FeatureType.SLOT,   "vee profile, no planar floor"),
    _c("rounded_groove",        "Rounded groove",        "slot", FeatureType.SLOT,   "round (part-cylindrical) floor"),
    _c("swallowtail_groove",    "Swallowtail groove",    "slot", FeatureType.SLOT,   "dovetail: flat floor, undercut walls"),
    _c("a_keyway",              "A-keyway",              "slot", FeatureType.SLOT,   "keyseat open at both ends"),
    _c("b_keyway",              "B-keyway",              "slot", FeatureType.SLOT,   "keyseat open at one end (runout)"),
    _c("c_keyway",              "C-keyway",              "slot", FeatureType.SLOT,   "keyseat blind at both ends"),
    _c("half_moon_keyway",      "Half-moon keyway",      "slot", FeatureType.SLOT,   "Woodruff: arc floor cut by a disc cutter"),
    _c("straight_groove",       "Straight groove",       "slot", FeatureType.SLOT,   "rectangular profile, straight run"),
    _c("ring_shaped_groove",    "Ring-shaped groove",    "slot", FeatureType.GROOVE, "annular, turned; root diameter between two larger ones"),
    # Hole (6) — one archetype, separated by `through` / `diameters` / `countersunk`.
    _c("round_through_hole",    "Round through hole",    "hole", FeatureType.HOLE,   "open at both ends"),
    _c("round_blind_hole",      "Round blind hole",      "hole", FeatureType.HOLE,   "planar cap on one end"),
    _c("cyl_countersunk_hole",  "Cylindrical countersunk hole", "hole", FeatureType.HOLE, "counterbore: 2 coaxial diameters, flat shoulder"),
    _c("tapered_countersunk_hole", "Tapered countersunk hole",  "hole", FeatureType.HOLE, "coaxial cone at the entry"),
    _c("round_stepped_hole",    "Round stepped hole",    "hole", FeatureType.HOLE,   "3 or more coaxial diameters"),
    _c("a_center_hole",         "A-center hole",         "hole", FeatureType.HOLE,   "small pilot bore under a 60 deg protecting cone"),
    # Step (3)
    _c("rect_through_step",     "Rectangular through step", "step", FeatureType.STEP, "square shoulder, open to the outside"),
    _c("general_step",          "General step",          "step", FeatureType.STEP,   "shoulder with a drafted (non-square) wall"),
    _c("shaft_step",            "Shaft step",            "step", FeatureType.SHAFT,  "turned shoulder: 2 coaxial external diameters"),
    # Thread (2) — a param block on the hole/shaft, never its own claimed face.
    _c("internal_screw_thread", "Internal screw thread", "thread", FeatureType.HOLE,  "tapped bore: thread spec on a hole"),
    _c("external_screw_thread", "External screw thread", "thread", FeatureType.SHAFT, "thread spec on a shaft"),
    # Transition (3)
    _c("rounding",              "Rounding",              "transition", FeatureType.FILLET,  "concave blend"),
    _c("chamfer",               "Chamfer",               "transition", FeatureType.CHAMFER, "oblique face bisecting two neighbours"),
    _c("round",                 "Round",                 "transition", FeatureType.ROUND,   "convex blend"),
    # Protrude (2)
    _c("convex_hull",           "Convex hull",           "protrude", FeatureType.BOSS,  "prismatic pad standing on a base face"),
    _c("boss",                  "Boss",                  "protrude", FeatureType.SHAFT, "cylindrical pad standing on a base face"),
    # Based (2) — the unmachined blank.
    _c("plane",                 "Plane",                 "based", FeatureType.PLANE, "planar face, no feature"),
    _c("external_cylindrical_surface", "External cylindrical surface", "based", FeatureType.SHAFT, "plain OD"),
    # Others (5)
    _c("opened_pocket",         "Opened pocket",         "others", FeatureType.POCKET, "floor walled on some but not all sides"),
    _c("closed_pocket",         "Closed pocket",         "others", FeatureType.POCKET, "floor fully enclosed by walls"),
    _c("triangular_rib",        "Triangular rib reinforcement", "others", FeatureType.RIB, "wedge gusset in an internal corner"),
    _c("general_removal_of_volume", "General removal of volume", "others", FeatureType.UNKNOWN, "matches no template"),
    _c("spherical_crown",       "Spherical crown",       "others", FeatureType.SPHERICAL_BOSS, "dome / spherical cap"),
)}

assert len(MF_CLASSES) == 33, f"MFDataset has 33 leaves, found {len(MF_CLASSES)}"


def classes_in(group: str) -> list[MFClass]:
    return [c for c in MF_CLASSES.values() if c.group == group]


# --- archetype + params -> MF leaf -------------------------------------------------------------

def _hole_class(p: dict) -> str:
    if p.get("thread"):
        return "internal_screw_thread"
    if p.get("center_hole"):
        return "a_center_hole"
    if len(p.get("diameters") or []) >= 3:
        return "round_stepped_hole"
    if p.get("counterbored"):
        return "cyl_countersunk_hole"
    if p.get("countersunk"):
        return "tapered_countersunk_hole"
    return "round_through_hole" if p.get("through") else "round_blind_hole"


def _shaft_class(p: dict) -> str:
    if p.get("thread"):
        return "external_screw_thread"
    if len(p.get("diameters") or []) > 1:
        return "shaft_step"
    if p.get("standing_on_base"):
        return "boss"
    return "external_cylindrical_surface"


def _slot_class(p: dict) -> str:
    profile = p.get("profile")
    if profile == "tee":
        return "t_through_slot"
    if profile == "vee":
        return "v_through_slot"
    if profile == "round":
        return "half_moon_keyway" if p.get("arc_floor") else "rounded_groove"
    if profile == "dovetail":
        return "swallowtail_groove"
    if p.get("on_cylinder"):                       # a keyseat: named by how its ends are terminated
        open_ends = p.get("open_ends", 0)
        return {0: "c_keyway", 1: "b_keyway"}.get(open_ends, "a_keyway")
    return "straight_groove"


def classify(feature) -> str | None:
    """The MFDataset leaf class for a recognized feature, or None when it is outside the taxonomy.

    Takes the recognizer's archetype (`FeatureType`) and narrows it with the params that distinguish the
    leaves — the same discriminators `MFClass.note` names, so the mapping stays auditable.
    """
    ftype = feature.type.value if hasattr(feature.type, "value") else feature.type
    p = feature.params or {}
    if ftype == "hole":
        return _hole_class(p)
    if ftype == "shaft":
        return _shaft_class(p)
    if ftype == "slot":
        return _slot_class(p)
    if ftype == "groove":
        return "ring_shaped_groove"
    if ftype == "step":
        return "general_step" if p.get("draft_angle_deg") else "rect_through_step"
    if ftype == "pocket":
        return "opened_pocket" if p.get("open") else "closed_pocket"
    if ftype == "boss":
        return "convex_hull"
    if ftype == "rib":
        return "triangular_rib"
    if ftype == "fillet":
        return "rounding"
    if ftype in ("chamfer", "round", "plane"):
        return ftype
    if ftype in ("spherical_boss", "spherical_seat"):
        return "spherical_crown"
    if ftype == "unknown":
        return "general_removal_of_volume"
    return None          # countersink is folded into its hole; nothing else maps
