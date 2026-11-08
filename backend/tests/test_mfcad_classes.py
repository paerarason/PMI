"""MFCAD++-style features our recognizers used to miss, and the MFCAD++ evaluator itself
(feature_recognition/recognizers.py PassageRecognizer, FaceGrooveRecognizer, PrismaticRecognizer._pick_floor;
services/benchmark/mfcadpp.py)."""
import math
import re
from pathlib import Path

import pytest
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeFace, BRepBuilderAPI_MakePolygon
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder, BRepPrimAPI_MakePrism
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt, gp_Vec

from app.services.benchmark.mfcadpp import exact_class, read_labelled_step, score
from app.services.feature_recognition.engine import recognize_with_topology

CORPUS = Path(__file__).resolve().parent.parent / "samples" / "mf_corpus"


def _prism(pts, h):
    poly = BRepBuilderAPI_MakePolygon()
    for p in pts:
        poly.Add(gp_Pnt(*p))
    poly.Close()
    return BRepPrimAPI_MakePrism(BRepBuilderAPI_MakeFace(poly.Wire()).Face(), gp_Vec(0, 0, h)).Shape()


def _ngon(n, z, r=15.0, cx=50.0, cy=40.0):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n), z) for i in range(n)]


def _cut(tool):
    return BRepAlgoAPI_Cut(BRepPrimAPI_MakeBox(100, 80, 40).Shape(), tool).Shape()


def _features(shape):
    found, _ = recognize_with_topology(shape)
    return [f for f in found if f.type.value != "plane"]


@pytest.mark.parametrize("n,shape", [(3, "triangular"), (4, "rectangular"), (6, "hexagonal")])
def test_a_floorless_ring_of_walls_is_a_passage(n, shape):
    feats = _features(_cut(_prism(_ngon(n, -1.0), 42.0)))
    assert len(feats) == 1
    f = feats[0]
    assert f.type.value == "pocket" and f.params["through"] and f.params["shape"] == shape
    assert f.params["wall_count"] == n and math.isclose(f.params["depth"], 40.0, abs_tol=1e-6)
    assert f.recognition_method == "FLOORLESS_WALL_RING"


@pytest.mark.parametrize("n", [3, 4, 6])
def test_a_pocket_with_a_floor_is_not_a_passage(n):
    feats = _features(_cut(_prism(_ngon(n, 25.0), 16.0)))
    assert [f.type.value for f in feats] == ["pocket"]
    assert not feats[0].params.get("through") and feats[0].params["wall_count"] == n


def test_a_triangular_pocket_keeps_its_real_floor():
    """Each wall of a triangle is within 45° of perpendicular to the others; the horizontal floor is the one
    they stand on squarely, so it must win over a larger wall."""
    f = _features(_cut(_prism(_ngon(3, 25.0), 16.0)))[0]
    assert f.params["profile"] == "rectangular" and not f.params["undercut"] and f.params["floor_normal"][2] == 1.0


def test_an_o_ring_groove_in_a_face_is_one_groove():
    ring = BRepAlgoAPI_Cut(BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(50, 40, 34), gp_Dir(0, 0, 1)), 20, 7).Shape(),
                           BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(50, 40, 33), gp_Dir(0, 0, 1)), 14, 9).Shape()).Shape()
    feats = _features(_cut(ring))
    assert len(feats) == 1
    g = feats[0]
    assert g.type.value == "groove" and g.params["face_groove"] and g.mf_class == "ring_shaped_groove"
    assert (g.params["inner_diameter"], g.params["outer_diameter"], g.params["depth"]) == (28.0, 40.0, 6.0)


# --- interacting features: the rules that came out of MFCAD++ ---------------------------------------------------

def _block(x0, y0, z0, x1, y1, z1):
    return BRepPrimAPI_MakeBox(gp_Pnt(x0, y0, z0), gp_Pnt(x1, y1, z1)).Shape()


def _cut_all(shape, *tools):
    for t in tools:
        shape = BRepAlgoAPI_Cut(shape, t).Shape()
    return shape


def _stock():
    return BRepPrimAPI_MakeBox(100, 80, 40).Shape()


def _of_type(shape, t):
    found, topo = recognize_with_topology(shape)
    return [f for f in found if f.type.value == t], topo


def test_a_passage_crossed_by_a_slot_keeps_both_pieces_of_its_wall():
    """The slot cuts the passage's top wall in two, one piece after the other along the passage. The gap opens
    to the outside (up the slot), which once kept them apart, as it must for a T-slot's two ledges side by side."""
    part = _cut_all(_stock(), _block(-1, 30, 10, 101, 50, 25), _block(45, -1, 18, 55, 81, 41))
    passages, topo = _of_type(part, "pocket")
    ring = [p for p in passages if p.params.get("through")]
    assert len(ring) == 1 and ring[0].params["wall_count"] == 4
    tops = [f for f in ring[0].face_ids if topo.faces[f].normal and topo.faces[f].normal[2] < -0.99]
    assert len(tops) == 2                                      # both pieces of the top wall


def test_two_overlapping_passages_are_one_through_cut():
    """Their joint section has two corners pointing into the cut (convex edges along the axis)."""
    part = _cut_all(_stock(), _block(-1, 30, 10, 101, 40, 20), _block(-1, 35, 15, 101, 45, 25))
    passages, _ = _of_type(part, "pocket")
    assert len(passages) == 1 and passages[0].params["through"] and len(passages[0].face_ids) == 8   # an 8-sided section


def test_a_passage_opened_by_a_through_hole_on_its_axis_is_still_a_passage():
    """A through hole along the passage's axis takes one corner of the triangle away: what is left is an open
    chain of walls whose two ends open into the hole."""
    tri = _prism([(40.0, 30.0, -1.0), (60.0, 30.0, -1.0), (50.0, 47.0, -1.0)], 42.0)
    hole = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(50, 47, -1), gp_Dir(0, 0, 1)), 4, 42).Shape()
    found, topo = recognize_with_topology(_cut_all(_stock(), tri, hole))
    walls = {f.face_id for f in topo.faces.values() if f.surface_type == "plane" and f.normal and abs(f.normal[2]) < 1e-6
             and 30 <= f.centroid[0] <= 60 and 29 <= f.centroid[1] <= 48}
    passage = [f for f in found if f.type.value == "pocket" and f.params.get("through")]
    assert len(walls) == 3 and len(passage) == 1 and set(passage[0].face_ids) == walls
    assert any(f.type.value == "hole" for f in found)


def test_a_rounded_pocket_at_an_angle_is_found():
    """Its flat walls stop short of the floor's extent along x and y; only its rounded ends reach it."""
    from OCP.BRepAlgoAPI import BRepAlgoAPI_Fuse
    from OCP.BRepBuilderAPI import BRepBuilderAPI_Transform
    from OCP.gp import gp_Ax1, gp_Trsf
    from OCP.ShapeUpgrade import ShapeUpgrade_UnifySameDomain
    tool = _block(-4, -3, 30, 4, 3, 41)
    for x in (-4, 4):
        tool = BRepAlgoAPI_Fuse(tool, BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(x, 0, 30), gp_Dir(0, 0, 1)), 3, 11).Shape()).Shape()
    unify = ShapeUpgrade_UnifySameDomain(tool)                  # one floor face, as a milled stadium has
    unify.Build()
    tool = unify.Shape()
    turn, move = gp_Trsf(), gp_Trsf()
    turn.SetRotation(gp_Ax1(gp_Pnt(0, 0, 0), gp_Dir(0, 0, 1)), math.radians(30))
    move.SetTranslation(gp_Vec(50, 40, 0))
    tool = BRepBuilderAPI_Transform(BRepBuilderAPI_Transform(tool, turn).Shape(), move).Shape()
    pockets, _ = _of_type(_cut_all(_stock(), tool), "pocket")
    assert len(pockets) == 1 and not pockets[0].params["open"] and len(pockets[0].params["corner_face_ids"]) == 2


def test_a_passage_through_a_pocket_floor_leaves_the_pocket_closed():
    """The passage's rim is an inner loop of the floor, not an open side."""
    part = _cut_all(_stock(), _block(35, 30, 25, 65, 50, 41), _block(47, 37, -1, 53, 43, 26))
    pockets, _ = _of_type(part, "pocket")
    floored = [p for p in pockets if not p.params.get("through")]
    assert len(floored) == 1 and not floored[0].params["open"] and floored[0].params["open_ends"] == 0
    assert any(p.params.get("through") for p in pockets)


def test_what_a_slot_leaves_of_a_pocket_is_pocket_not_step():
    """A wide slot through the middle of a hexagonal pocket leaves two pieces, a floor and two walls each. Their
    open side leads into the slot, not onto the outside of the part, so they are not steps."""
    part = _cut_all(_stock(), _prism(_ngon(6, 25.0), 16.0), _block(40, -1, 15, 60, 81, 41))
    found, _ = recognize_with_topology(part)
    pieces = [f for f in found if f.type.value in ("pocket", "step") and not f.params.get("through")
              and f.params.get("wall_count") == 2 and f.params.get("floor_normal", [0, 0, 0])[2] == 1.0]
    assert len(pieces) == 2 and all(p.type.value == "pocket" for p in pieces)


def test_a_blind_hole_another_cut_broke_into_is_still_a_hole():
    """254° of the bore is left, standing on its flat bottom: more than a channel can wrap, and on a floor."""
    hole = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(50, 40, 20), gp_Dir(0, 0, 1)), 5, 21).Shape()
    found, _ = recognize_with_topology(_cut_all(_stock(), hole, _block(53, -1, 15, 60, 81, 41)))
    holes = [f for f in found if f.type.value == "hole"]
    assert len(holes) == 1 and holes[0].params["opened"] and not holes[0].params["through"]
    assert holes[0].params["diameter"] == 10.0 and holes[0].recognition_method == "OPENED_BORE_ON_FLOOR"
    assert not [f for f in found if f.type.value == "slot" and f.params.get("profile") == "round"]


def test_a_step_floor_a_slot_cut_off_rejoins_its_step():
    """The slot along the step leaves a strip of its floor with no edge back to the step's wall."""
    part = _cut_all(_stock(), _block(-1, -1, 30, 101, 20, 41), _block(-1, 8, 25, 101, 12, 41))
    steps, topo = _of_type(part, "step")
    floor_pieces = {f.face_id for f in topo.faces.values() if f.surface_type == "plane" and f.normal
                    and f.normal[2] > 0.99 and abs(f.point[2] - 30.0) < 1e-6}
    assert len(floor_pieces) == 2
    owner = [s for s in steps if floor_pieces <= set(s.face_ids)]
    assert len(owner) == 1 and owner[0].params["split_face_ids"]


def test_an_l_shaped_recess_with_a_rounded_inside_corner_is_one_closed_pocket():
    """An engraved letter's outline has corners that bulge into the recess (external cylinders standing on its
    floor between two of its walls). They are walls of the recess, not open sides, and not edge rounds."""
    from OCP.BRepFilletAPI import BRepFilletAPI_MakeFillet
    from OCP.BRepAlgoAPI import BRepAlgoAPI_Fuse
    from OCP.TopAbs import TopAbs_EDGE
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopoDS import TopoDS
    from OCP.BRepAdaptor import BRepAdaptor_Curve
    tool = BRepAlgoAPI_Fuse(_block(30, 30, 30, 60, 40, 45), _block(30, 30, 30, 40, 55, 45)).Shape()
    from OCP.ShapeUpgrade import ShapeUpgrade_UnifySameDomain
    unify = ShapeUpgrade_UnifySameDomain(tool)
    unify.Build()
    tool = unify.Shape()
    mk = BRepFilletAPI_MakeFillet(tool)
    exp = TopExp_Explorer(tool, TopAbs_EDGE)
    while exp.More():                                   # the L's inner corner edge, at (40, 40), vertical
        e = TopoDS.Edge_s(exp.Current())
        c = BRepAdaptor_Curve(e)
        p0, p1 = c.Value(c.FirstParameter()), c.Value(c.LastParameter())
        if all(abs(p.X() - 40) < 1e-6 and abs(p.Y() - 40) < 1e-6 for p in (p0, p1)):
            mk.Add(3.0, e)
        exp.Next()
    found, topo = recognize_with_topology(_cut_all(_stock(), mk.Shape()))
    pockets = [f for f in found if f.type.value == "pocket"]
    assert len(pockets) == 1 and not pockets[0].params["open"]
    bulge = pockets[0].params["convex_corner_face_ids"]
    assert len(bulge) == 1 and topo.faces[bulge[0]].material_side == "external"
    assert not [f for f in found if f.type.value in ("round", "unknown")]


def test_a_chamfer_that_ends_on_a_step_floor_is_a_chamfer():
    """A chamfered vertical edge, then a corner step cut under it: the chamfer now stands on the step's floor.
    Narrow next to the faces it breaks, so it stays a chamfer (a triangular step's diagonal wall is wide)."""
    from OCP.BRepFilletAPI import BRepFilletAPI_MakeChamfer
    from OCP.TopAbs import TopAbs_EDGE
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopoDS import TopoDS
    box = _stock()
    mk = BRepFilletAPI_MakeChamfer(box)
    exp = TopExp_Explorer(box, TopAbs_EDGE)
    while exp.More():
        e = TopoDS.Edge_s(exp.Current())
        from OCP.BRepAdaptor import BRepAdaptor_Curve
        c = BRepAdaptor_Curve(e)
        p0, p1 = c.Value(c.FirstParameter()), c.Value(c.LastParameter())
        if abs(p0.X() - 100) < 1e-6 and abs(p1.X() - 100) < 1e-6 and abs(p0.Y() - 80) < 1e-6 and abs(p1.Y() - 80) < 1e-6:
            mk.Add(2.0, e)
        exp.Next()
    part = _cut_all(mk.Shape(), _block(70, 50, -1, 101, 81, 20))
    found, topo = recognize_with_topology(part)
    chamfers = [f for f in found if f.type.value == "chamfer"]
    assert len(chamfers) == 1
    n = topo.faces[chamfers[0].face_ids[0]].normal
    assert abs(n[0] - n[1]) < 1e-6 and abs(n[2]) < 1e-6         # the 45° face on the vertical corner


# --- the evaluator ------------------------------------------------------------------------------------------

def test_our_features_map_to_mfcad_classes():
    assert exact_class({"type": "hole", "params": {"through": True}}) == "through_hole"
    assert exact_class({"type": "hole", "params": {"through": False}}) == "blind_hole"
    assert exact_class({"type": "pocket", "params": {"through": True, "wall_count": 6}}) == "6sides_passage"
    assert exact_class({"type": "pocket", "params": {"wall_count": 3}}) == "triangular_pocket"
    assert exact_class({"type": "groove", "params": {"face_groove": True}}) == "Oring"
    assert exact_class({"type": "step", "params": {"open": True, "open_ends": 2, "wall_count": 1}}) == "rectangular_through_step"
    assert exact_class({"type": "plane", "params": {}}) == "stock"


def test_face_labels_are_read_from_the_advanced_face_names(tmp_path):
    src = (CORPUS / "h12_round_blind_hole.step").read_text()
    n = iter(range(1000))
    p = tmp_path / "labelled.step"
    p.write_text(re.sub(r"ADVANCED_FACE\(''", lambda m: f"ADVANCED_FACE('{next(n) % 25}'", src))
    shape, labels = read_labelled_step(str(p))
    assert sorted(labels.values()) == list(range(8))           # every face found once, with its own label


def test_score_counts_faces_at_both_levels():
    s = score([{"file": "a", "pairs": [("through_hole", "through_hole"), ("blind_hole", "through_hole"),
                                       ("stock", "stock"), ("rectangular_pocket", "6sides_pocket")]},
               {"file": "b", "error": "ValueError: unreadable STEP"}])
    assert s["faces"] == 4 and s["errors"] == 1
    assert s["exact_accuracy"] == 0.5                         # hole kind right twice, pocket shape wrong
    assert s["process_accuracy"] == 1.0                       # but every face is the right kind of feature
