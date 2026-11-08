"""MF taxonomy coverage — one assertion per MFDataset machining-feature class.

Reference: `leiruoshan/MFPointNet_feature_dataset` (MFDataset), 33 machining-feature subcategories in 8
groups, encoded in `feature_recognition/taxonomy.py`. `scripts/make_mf_corpus.py` rebuilds each class as a
single-feature AP242 solid; this module runs the recognizer over every one and checks two things:

  * **`mf`** — the MFDataset leaf the part is an instance of must appear among the recognized features'
    `mf_class`. This is the taxonomy check: it fails if a class is unrecognized *or* recognized as a
    sibling (a rounded groove reported as a hole, a boss reported as a step).
  * **`types`** — the full multiset of non-plane archetypes. A multiset, not a set, so a split-face false
    positive is caught: one physical feature emitted twice (a keyway splitting a shaft OD into a journal
    plus a phantom `round`) changes the multiset even though the set is unchanged.

Planes are excluded throughout because they are the blank, not the feature.

`status` records where we stand:
  * `OK`  — recognized correctly; a hard assertion, so it can never silently regress.
  * `GAP` — `xfail(strict=True)`, so implementing it fails this test as *unexpectedly passing* and forces
            the entry to flip to OK. The `mf` column is therefore the target, not today's output.
"""
from __future__ import annotations

import pytest

from app import config
from app.services.feature_recognition import recognize_features
from app.services.feature_recognition.taxonomy import GROUPS, MF_CLASSES
from app.services.step_loader import load_step

CORPUS_DIR = config.SAMPLES_DIR / "mf_corpus"

OK, GAP = "OK", "GAP"

# corpus part -> (MFDataset leaf it instantiates, archetype multiset, status, note)
MF_CORPUS = {
    # --- slots (10) ---------------------------------------------------------------------------
    "s01_t_through_slot":       ("t_through_slot",       ["slot"], OK, "overhanging faces → undercut, profile=tee"),
    "s02_v_through_slot":       ("v_through_slot",       ["slot"], OK, "two equal-area flanks at a concave apex, no floor"),
    "s03_rounded_groove":       ("rounded_groove",       ["slot"], OK, "180° cylindrical floor never closes → channel, not a bore"),
    "s04_dovetail_groove":      ("swallowtail_groove",   ["slot"], OK, "walls lean back over the floor → profile=dovetail"),
    "s05_keyway_a":             ("a_keyway",             ["shaft", "slot"], OK, "OD split 254°+74° still sums past the closure threshold → one shaft"),
    "s06_keyway_b":             ("b_keyway",             ["shaft", "slot"], OK, "one unwalled floor edge → runout end"),
    "s07_keyway_c":             ("c_keyway",             ["shaft", "slot"], OK, "floor fully walled → blind both ends"),
    "s08_half_moon_keyway":     ("half_moon_keyway",     ["shaft", "slot"], OK, "arc floor on a turned part → Woodruff"),
    "s09_straight_groove":      ("straight_groove",      ["slot"], OK, "parallel walls + aspect ≥ 3"),
    "s10_ring_groove":          ("ring_shaped_groove",   ["groove", "shaft"], OK, "root diameter below both axial neighbours → turned recess"),
    # --- holes (6) ----------------------------------------------------------------------------
    "h11_round_through_hole":   ("round_through_hole",   ["hole"], OK, ""),
    "h12_round_blind_hole":     ("round_blind_hole",     ["hole"], OK, ""),
    "h13_cyl_countersunk_hole": ("cyl_countersunk_hole", ["hole"], OK, "2 coaxial diameters"),
    "h14_taper_countersunk_hole": ("tapered_countersunk_hole", ["hole"], OK, "90° coaxial cone"),
    "h15_stepped_hole":         ("round_stepped_hole",   ["hole"], OK, "3 coaxial diameters"),
    "h16_center_hole":          ("a_center_hole",        ["hole"], OK, "60° cone ⇒ centre drill, not an 82/90/100° countersink"),
    # --- steps (3) ----------------------------------------------------------------------------
    "t17_rect_through_step":    ("rect_through_step",    ["step"], OK, ""),
    "t18_general_step":         ("general_step",         ["step"], OK, "29° drafted wall, recorded as draft_angle_deg"),
    "t19_shaft_step":           ("shaft_step",           ["shaft"], OK, "2 coaxial diameters, monotonic → step not groove"),
    # --- threads (2) --------------------------------------------------------------------------
    "r20_internal_thread":      ("internal_screw_thread", ["hole"], GAP, "tap-drill geometry is right; the thread spec needs PLAN.md §B3 (PMI/name or helical edges)"),
    "r21_external_thread":      ("external_screw_thread", ["shaft"], GAP, "major-diameter geometry is right; thread spec needs PLAN.md §B3"),
    # --- transitions (3) ----------------------------------------------------------------------
    "x22_rounding":             ("rounding",             ["fillet"], OK, ""),
    "x23_chamfer":              ("chamfer",              ["chamfer"], OK, "planar chamfer: normal bisects its two neighbours"),
    "x24_round":                ("round",                ["round"], OK, ""),
    # --- protrudes (2) ------------------------------------------------------------------------
    "p25_convex_hull":          ("convex_hull",          ["boss"], OK, "convex region with concave feet, cap absorbed"),
    "p26_boss":                 ("boss",                 ["shaft"], OK, "cylinder meeting a plane concavely → standing on a base"),
    # --- bases (2) ----------------------------------------------------------------------------
    "b27_plane":                ("plane",                [], OK, "plain blank: planes only"),
    "b28_external_cylinder":    ("external_cylindrical_surface", ["shaft"], OK, ""),
    # --- others (5) ---------------------------------------------------------------------------
    "o29_open_pocket":          ("opened_pocket",        ["pocket"], OK, "3 walls, aspect < 3 → open pocket, not a step"),
    "o30_closed_pocket":        ("closed_pocket",        ["pocket"], OK, ""),
    "o31_triangular_rib":       ("triangular_rib",       ["rib", "step"], OK, "the gusset, plus the L-bracket step it braces — both are real"),
    "o32_general_volume":       ("general_removal_of_volume", ["unknown"], GAP,
                                 "an oblique cut still presents a floor and a wall, so it is reported as a step; "
                                 "flagging it unknown needs a template-fit residual, not another threshold"),
    "o33_spherical_crown":      ("spherical_crown",      ["spherical_boss"], OK, ""),
}


def _recognize(stem: str):
    return recognize_features(load_step(str(CORPUS_DIR / f"{stem}.step")).shape)


def _non_plane(stem: str):
    return [f for f in _recognize(stem) if f.type.value != "plane"]


# --- the taxonomy itself -----------------------------------------------------------------------

def test_taxonomy_has_all_33_classes_in_8_groups():
    assert len(MF_CLASSES) == 33
    assert {c.group for c in MF_CLASSES.values()} == set(GROUPS)
    sizes = {g: sum(1 for c in MF_CLASSES.values() if c.group == g) for g in GROUPS}
    assert sizes == {"slot": 10, "hole": 6, "step": 3, "thread": 2,
                     "transition": 3, "protrude": 2, "based": 2, "others": 5}


def test_every_taxonomy_class_has_exactly_one_corpus_part():
    """The corpus and the taxonomy must not drift apart: 33 classes, 33 parts, one each."""
    covered = [mf for mf, _types, _status, _note in MF_CORPUS.values()]
    assert sorted(covered) == sorted(MF_CLASSES), "corpus and taxonomy disagree"
    assert len(covered) == len(set(covered)) == 33


# --- recognition per class ---------------------------------------------------------------------

@pytest.mark.parametrize("stem", list(MF_CORPUS))
def test_mf_class_is_recognized(stem, request):
    mf, types, status, note = MF_CORPUS[stem]
    group = MF_CLASSES[mf].group
    if status == GAP:
        request.node.add_marker(pytest.mark.xfail(strict=True, reason=f"[{group}] {note}"))
    feats = _recognize(stem)
    assert sorted(f.type.value for f in feats if f.type.value != "plane") == sorted(types), \
        f"[{group}] {stem}: wrong archetypes — {note}"
    # The MF check spans planes too, since "Plane" is itself a class in the MFDataset "Based" group.
    assert mf in {f.mf_class for f in feats}, f"[{group}] {stem}: expected MF class {mf!r} — {note}"


# --- invariants that make the table above trustworthy -------------------------------------------

def test_every_face_is_claimed_by_some_feature():
    """Coverage invariant: no face may fall out of the feature tree, on any class in the taxonomy.

    This is what makes the GAP list trustworthy — a miss always shows up as a *wrong type*, never as a
    face that quietly vanished."""
    from app.services.feature_recognition.topology import build_topology
    for stem in MF_CORPUS:
        shape = load_step(str(CORPUS_DIR / f"{stem}.step")).shape
        n_faces = len(build_topology(shape).faces)
        claimed = {fid for f in recognize_features(shape) for fid in f.face_ids}
        assert len(claimed) == n_faces, f"{stem}: {n_faces - len(claimed)} face(s) unclaimed"


def test_no_face_is_claimed_twice():
    """Each face belongs to at most one feature, so face-id driven PMI association stays unambiguous."""
    for stem in MF_CORPUS:
        seen: dict[int, str] = {}
        for feat in _recognize(stem):
            for fid in feat.face_ids:
                assert fid not in seen, f"{stem}: face {fid} claimed by {seen[fid]} and {feat.id}"
                seen[fid] = feat.id


def test_every_feature_resolves_to_a_taxonomy_class():
    """`mf_class` must always name a real leaf — never None, never a typo."""
    for stem in MF_CORPUS:
        for feat in _recognize(stem):
            assert feat.mf_class in MF_CLASSES, f"{stem}: {feat.id} has mf_class {feat.mf_class!r}"


def test_hole_depth_spans_the_countersink():
    """Drilling depth must be measured from the *entry face*, not from the top of the drilled cylinder.

    h14 is a Ø8 hole through a 20 mm plate with a 90° countersink on top. The bore cylinder only spans
    Z=0..16 because the cone ate the top 4 mm, so `depth` reports 16 and `entry` sits 4 mm below the real
    surface — the drill cycle would start its R-plane inside the countersink."""
    hole = next(f for f in _non_plane("h14_taper_countersunk_hole") if f.type.value == "hole")
    assert hole.params["depth"] == pytest.approx(20.0, abs=0.05)


def test_tee_slot_depth_spans_the_mouth():
    """A T-slot's depth must reach the head floor from the opening, and it needs both widths.

    s01 is a 16-wide mouth over a 32-wide head, 16 deep overall. The mouth walls carry no concave edge of
    their own, so they never join the head's region: `depth` reports only the head's 8 mm and `width` only
    the head's 32 mm. Cutting it needs mouth width (for the shank), head width and the full depth, so a
    T-slot cutter can be chosen and sunk to the right level."""
    slot = next(f for f in _non_plane("s01_t_through_slot") if f.type.value == "slot")
    assert slot.params["depth"] == pytest.approx(16.0, abs=0.05)
    assert slot.params.get("mouth_width") == pytest.approx(16.0, abs=0.05)


def test_confidence_cannot_separate_right_answers_from_wrong_ones():
    """`confidence` is a per-recognizer constant, so no threshold can route the bad ones to review.

    Scored over the whole taxonomy: the least-confident *correct* recognition sits at or below the
    most-confident *wrong* one, so the two populations overlap and any auto-accept cutoff either admits a
    misread feature or rejects a good one. This is the concrete reason to recompute confidence as a
    distance to the decision boundary (sweep vs `_MIN_BORE_SWEEP`, aspect vs `_SLOT_ASPECT`, wall angle vs
    `_WALL_DRAFT_DEG`) rather than a literal. When that lands, this test should start failing — delete it.
    """
    correct, wrong = [], []
    for stem, (_mf, _types, status, _note) in MF_CORPUS.items():
        for feat in _non_plane(stem):
            (correct if status == OK else wrong).append(feat.confidence)
    assert correct and wrong
    assert max(wrong) >= min(correct), (
        f"confidence now separates the populations (wrong≤{max(wrong):.2f} < correct≥{min(correct):.2f}) "
        "— it can drive review triage, so drop this test")
