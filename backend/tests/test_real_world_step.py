"""What real exported STEP files do that the generated samples never do.

Each case here was first seen on a public NIST part, then rebuilt in-test so it runs without the download
cache:

* construction geometry next to the solid (FTC-09, STC-07): it must not grow the part or become a feature;
* analytic surfaces written as B-splines (D2MI-904): a NURBS cylinder is still a hole;
* a blind hole drawn with its drill point (CTC-02): blind, not a countersunk through hole;
* a hole that starts on a small boss (D2MI-904): the rim is not a floor;
* a line of sight through a wall thinner than 1 mm;
* several bodies, or no solid at all: said in the warnings, not hidden.

The tests at the end run on the cached NIST parts themselves when the cache is there.
"""
from __future__ import annotations

import math
from pathlib import Path

import pytest
from OCP.BRep import BRep_Builder
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut, BRepAlgoAPI_Fuse
from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeEdge, BRepBuilderAPI_MakeFace, BRepBuilderAPI_NurbsConvert
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCone, BRepPrimAPI_MakeCylinder
from OCP.GeomAPI import GeomAPI_PointsToBSplineSurface
from OCP.gp import gp_Ax2, gp_Dir, gp_Pln, gp_Pnt
from OCP.IFSelect import IFSelect_RetDone
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Writer
from OCP.TColgp import TColgp_Array2OfPnt
from OCP.TopAbs import TopAbs_FACE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS, TopoDS_Compound

from app import config
from app.services import model_checks
from app.services.canonical import canonical_face
from app.services.feature_recognition import recognize_features
from app.services.feature_recognition.engine import recognize_with_topology
from app.services.feature_recognition.topology import build_topology, line_of_sight
from app.services.feature_recognition.thread_rules import load_process_rules
from app.services.step_loader import load_step
from app.services.tessellator import iter_faces

CACHE = Path(__file__).resolve().parent.parent / "benchmark" / "data"


def _box(x=60.0, y=40.0, z=20.0):
    return BRepPrimAPI_MakeBox(gp_Pnt(0, 0, 0), gp_Pnt(x, y, z)).Shape()


def _cyl(origin, direction, r, h):
    return BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(*origin), gp_Dir(*direction)), r, h).Shape()


def _compound(*parts):
    comp, builder = TopoDS_Compound(), BRep_Builder()
    builder.MakeCompound(comp)
    for p in parts:
        builder.Add(comp, p)
    return comp


def _write(shape, path: Path) -> str:
    writer = STEPControl_Writer()
    writer.Transfer(shape, STEPControl_AsIs)
    assert writer.Write(str(path)) == IFSelect_RetDone
    return str(path)


def _faces(shape) -> list:
    out, exp = [], TopExp_Explorer(shape, TopAbs_FACE)
    while exp.More():
        out.append(TopoDS.Face_s(exp.Current()))
        exp.Next()
    return out


def _drilled_blind_hole(d=12.0, depth=15.0, point_deg=118.0, top=20.0, x=30.0, y=20.0):
    """The tool a drill leaves: a cylinder `depth` deep from Z=`top`, then a cone down to a point."""
    r = d / 2.0
    tip = r / math.tan(math.radians(point_deg / 2.0))
    bore = _cyl((x, y, top - depth), (0, 0, 1), r, depth)
    point = BRepPrimAPI_MakeCone(gp_Ax2(gp_Pnt(x, y, top - depth - tip), gp_Dir(0, 0, 1)), 0.0, r, tip).Shape()
    return BRepAlgoAPI_Fuse(bore, point).Shape(), tip


def _hole(shape) -> dict:
    holes = [f for f in recognize_features(shape) if f.type.value == "hole"]
    assert len(holes) == 1, [h.params for h in holes]
    return holes[0].to_dict()


# --- the part is the solid, not everything in the file ------------------------------------------------------

@pytest.fixture()
def with_construction_geometry(tmp_path):
    """A plate with one hole, plus what a designer leaves around it: a reference plane well outside the
    part and a centre line. Written with the loose pieces first, so they would take the first face ids."""
    plate = BRepAlgoAPI_Cut(_box(), _cyl((30, 20, 0), (0, 0, 1), 4.0, 20.0)).Shape()
    plane = BRepBuilderAPI_MakeFace(gp_Pln(gp_Pnt(0, 0, 60), gp_Dir(0, 0, 1)), -50.0, 150.0, -50.0, 120.0).Face()
    axis = BRepBuilderAPI_MakeEdge(gp_Pnt(30, 20, -80), gp_Pnt(30, 20, 90)).Edge()
    return load_step(_write(_compound(plane, axis, plate), tmp_path / "construction.step"))


def test_construction_geometry_does_not_grow_the_part(with_construction_geometry):
    loaded = with_construction_geometry
    assert loaded.solids == 1 and loaded.supplemental_faces == 1
    assert [round(s, 3) for s in loaded.bbox.size] == [60.0, 40.0, 20.0]       # not 200 × 170 × 170
    assert any("outside the solid" in d for d in loaded.diagnostics)


def test_body_faces_keep_the_viewer_ids(with_construction_geometry):
    """Features are found on `body`, and the viewer draws `shape`. An id must mean the same face in both."""
    loaded = with_construction_geometry
    body, everything = _faces(loaded.body), _faces(loaded.shape)
    assert len(everything) == len(body) + 1
    assert all(a.IsSame(b) for a, b in zip(body, everything))


def test_construction_geometry_is_not_a_feature(with_construction_geometry):
    loaded = with_construction_geometry
    feats = recognize_features(loaded.body)
    n_body = len(_faces(loaded.body))
    assert all(fid < n_body for f in feats for fid in f.face_ids)
    assert sum(1 for f in feats if f.type.value == "plane") == 6               # the plate's own six faces
    assert _hole(loaded.body)["params"]["diameter"] == 8.0


def test_a_clean_single_solid_is_left_exactly_as_read():
    loaded = load_step(str(config.SAMPLES_DIR / "demo_bracket_pmi.step"))
    assert loaded.body.IsSame(loaded.shape) and loaded.solids == 1
    assert loaded.supplemental_faces == 0 and loaded.diagnostics == []


def test_several_bodies_are_reported(tmp_path):
    other = BRepPrimAPI_MakeBox(gp_Pnt(100, 0, 0), gp_Pnt(130, 30, 30)).Shape()
    loaded = load_step(_write(_compound(_box(), other), tmp_path / "two_bodies.step"))
    assert loaded.solids == 2
    assert any("2 solid bodies" in d for d in loaded.diagnostics)


def test_a_file_without_a_solid_is_reported(tmp_path):
    sheet = BRepBuilderAPI_MakeFace(gp_Pln(gp_Pnt(0, 0, 0), gp_Dir(0, 0, 1)), 0.0, 50.0, 0.0, 30.0).Face()
    loaded = load_step(_write(sheet, tmp_path / "sheet.step"))
    assert loaded.solids == 0
    assert any("no solid body" in d for d in loaded.diagnostics)


# --- analytic surfaces written as B-splines -----------------------------------------------------------------

def _as_nurbs(shape):
    return BRepBuilderAPI_NurbsConvert(shape, True).Shape()


def test_a_nurbs_cylinder_is_read_as_the_cylinder_it_is():
    nurbs = _as_nurbs(_cyl((0, 0, 0), (0, 0, 1), 5.0, 12.0))
    found = [c for c in (canonical_face(f) for f in _faces(nurbs)) if c is not None]
    kinds = sorted(c.kind for c in found)
    assert kinds == ["cylinder", "plane", "plane"]
    cyl = next(c for c in found if c.kind == "cylinder")
    assert cyl.radius == pytest.approx(5.0, abs=1e-6) and cyl.height == pytest.approx(12.0, abs=1e-6)
    assert cyl.sweep == pytest.approx(2 * math.pi) and cyl.gap < 1e-6
    assert abs(cyl.axis_dir[2]) == pytest.approx(1.0)


def test_an_analytic_face_needs_no_conversion():
    assert all(canonical_face(f) is None for f in _faces(_box()))


def test_a_real_free_form_face_stays_free_form():
    pts = TColgp_Array2OfPnt(1, 5, 1, 5)
    for i in range(1, 6):
        for j in range(1, 6):
            pts.SetValue(i, j, gp_Pnt(i * 10.0, j * 10.0, 3.0 * math.sin(i * 1.3) * math.cos(j * 0.9)))
    face = BRepBuilderAPI_MakeFace(GeomAPI_PointsToBSplineSurface(pts).Surface(), 1e-6).Face()
    assert canonical_face(face) is None
    assert build_topology(face).faces[0].surface_type == "other"


def test_features_survive_an_all_nurbs_export():
    """The same part, exported the way some CAD systems do (every surface a B-spline), gives the same
    features with the same sizes. Before, none of its curved faces were recognized."""
    hole, _tip = _drilled_blind_hole()
    part = BRepAlgoAPI_Cut(BRepAlgoAPI_Cut(_box(), hole).Shape(), _cyl((12, 12, 0), (0, 0, 1), 3.0, 20.0)).Shape()

    def summary(shape):
        return sorted((f.type.value, f.mf_class, f.params.get("diameter"), f.params.get("depth"), f.params.get("through"))
                      for f in recognize_features(shape))

    exact, nurbs = summary(part), summary(_as_nurbs(part))
    assert nurbs == exact
    assert ("hole", "round_through_hole", 6.0, 20.0, True) in nurbs
    topo = build_topology(_as_nurbs(part))
    assert all(f.surface_type != "other" for f in topo.faces.values())
    assert all(f.canonicalized for f in topo.faces.values())


# --- holes as they are really drawn -------------------------------------------------------------------------

def test_a_drill_point_makes_a_blind_hole_not_a_countersunk_through_hole():
    hole, tip = _drilled_blind_hole(d=12.0, depth=15.0)
    feature = _hole(BRepAlgoAPI_Cut(_box(), hole).Shape())
    p = feature["params"]
    assert p["through"] is False and p["bottom_type"] == "drill_point"
    assert p["countersunk"] is False and p["countersink_diameter"] is None
    assert feature["mf_class"] == "round_blind_hole"
    assert p["depth"] == pytest.approx(15.0, abs=1e-3)                 # to the end of the full diameter
    assert p["tip_depth"] == pytest.approx(15.0 + tip, abs=1e-3)
    assert p["point_angle_deg"] == pytest.approx(118.0, abs=0.01)
    assert p["entry"][2] == pytest.approx(20.0) and p["bottom"][2] == pytest.approx(5.0, abs=1e-3)
    assert p["access_dir"] == pytest.approx([0.0, 0.0, 1.0])
    assert p["steps"] == [{"diameter": 12.0, "depth": 15.0}]




def test_a_drilled_hole_from_below_enters_from_below():
    """The same hole, drilled into the underside: the point is the higher end, the entry the lower one."""
    r, depth = 4.0, 12.0
    tip = r / math.tan(math.radians(59.0))
    bore = _cyl((30, 20, 0), (0, 0, 1), r, depth)
    point = BRepPrimAPI_MakeCone(gp_Ax2(gp_Pnt(30, 20, depth), gp_Dir(0, 0, 1)), r, 0.0, tip).Shape()
    p = _hole(BRepAlgoAPI_Cut(_box(), BRepAlgoAPI_Fuse(bore, point).Shape()).Shape())["params"]
    assert p["through"] is False and p["bottom_type"] == "drill_point"
    assert p["entry"][2] == pytest.approx(0.0) and p["access_dir"] == pytest.approx([0.0, 0.0, -1.0])
    assert p["depth"] == pytest.approx(depth, abs=1e-3)


def test_a_flat_bottomed_blind_hole_is_still_flat():
    p = _hole(BRepAlgoAPI_Cut(_box(), _cyl((30, 20, 8), (0, 0, 1), 5.0, 12.0)).Shape())["params"]
    assert p["through"] is False and p["bottom_type"] == "flat"
    assert p["depth"] == pytest.approx(12.0) and p["tip_depth"] is None


def test_a_through_hole_has_no_bottom():
    p = _hole(BRepAlgoAPI_Cut(_box(), _cyl((30, 20, 0), (0, 0, 1), 5.0, 20.0)).Shape())["params"]
    assert p["through"] is True and p["bottom_type"] is None


def test_the_rim_of_a_hole_on_a_small_boss_is_not_its_floor():
    """A boss top around the hole's mouth is a small flat face square to the axis, at the end of the hole:
    everything a floor is, except that it faces away from the hole. Taking it for the floor put the entry at
    the drill point, inside the part."""
    base = BRepPrimAPI_MakeBox(gp_Pnt(0, 0, 0), gp_Pnt(40, 40, 10)).Shape()
    part = BRepAlgoAPI_Fuse(base, _cyl((20, 20, 10), (0, 0, 1), 4.0, 5.0)).Shape()          # boss top at Z=15
    hole, _tip = _drilled_blind_hole(d=6.0, depth=9.0, top=15.0, x=20.0, y=20.0)
    p = _hole(BRepAlgoAPI_Cut(part, hole).Shape())["params"]
    assert p["entry"][2] == pytest.approx(15.0) and p["access_dir"] == pytest.approx([0.0, 0.0, 1.0])
    assert p["through"] is False and p["depth"] == pytest.approx(9.0, abs=1e-3)


# --- line of sight ------------------------------------------------------------------------------------------

def test_line_of_sight_sees_a_wall_thinner_than_a_millimetre():
    """A 0.3 mm skin over the line, placed between the points a test every millimetre would look at
    (4.5, 5.5, … 10.5 from a start at Z=4), so that test stepped over it and called the line clear."""
    skin = BRepPrimAPI_MakeBox(gp_Pnt(0, 0, 10.6), gp_Pnt(40, 40, 10.9)).Shape()
    block = BRepPrimAPI_MakeBox(gp_Pnt(0, 0, 0), gp_Pnt(40, 40, 4)).Shape()
    topo = build_topology(_compound(block, skin))
    assert line_of_sight(topo, [20.0, 20.0, 4.0], [0.0, 0.0, 1.0]) is False
    assert line_of_sight(topo, [20.0, 20.0, 10.9], [0.0, 0.0, 1.0]) is True


def test_line_of_sight_through_an_open_hole_is_clear():
    part = BRepAlgoAPI_Cut(_box(), _cyl((30, 20, 0), (0, 0, 1), 5.0, 20.0)).Shape()
    topo = build_topology(part)
    assert line_of_sight(topo, [30.0, 20.0, 10.0], [0.0, 0.0, 1.0]) is True
    assert line_of_sight(topo, [10.0, 10.0, 10.0], [0.0, 0.0, 1.0]) is False     # starts inside the material


# --- what the user is told ----------------------------------------------------------------------------------

def test_unexplained_curved_faces_are_named():
    topo = build_topology(_cyl((0, 0, 0), (0, 0, 1), 5.0, 12.0))
    note = model_checks.unexplained_faces(topo, [])
    assert note and "1 curved face(s)" in note and "1 cylinder" in note
    feats, topo = recognize_with_topology(_box())
    assert model_checks.unexplained_faces(topo, [f.to_dict() for f in feats]) is None


def test_a_size_25_4_times_off_is_called_a_unit_error():
    feature = {"id": "HOLE-001", "type": "hole", "face_ids": [3], "params": {"diameter": 8.001}}
    pmi = {"id": "C12", "kind": "dimension", "type_label": "Diameter", "nominal": 203.2, "face_ids": [3]}
    notes = model_checks.pmi_size_conflicts([feature], [pmi], inch_declared=True)
    assert len(notes) == 1 and "C12" in notes[0] and "HOLE-001" in notes[0] and "wrong unit" in notes[0]
    assert model_checks.pmi_size_conflicts([feature], [{**pmi, "nominal": 8.0}], inch_declared=True) == []


def test_samples_load_without_new_warnings():
    from app.routers.models import ingest

    rec = ingest(config.SAMPLES_DIR / "comprehensive_pmi.step", "comprehensive_pmi.step")
    assert rec.warnings == []


# --- the public parts themselves (only where the benchmark cache has been downloaded) -----------------------

def _cached(source: str, part: str) -> str:
    path = CACHE / source / "parts" / f"{part}.stp"
    if not path.exists():
        pytest.skip(f"{part} is not in the benchmark cache")
    return str(path)


def test_ftc_09_is_the_size_of_its_solid():
    """FTC-09 and STC-09 are two exports of one sheet-metal part, 3 mm thick. FTC-09 adds construction
    surfaces, which used to make it 227 × 5.3 mm."""
    ftc = load_step(_cached("nist-pmi-step", "nist_ftc_09"))
    stc = load_step(_cached("nist-pmi-step", "nist_stc_09"))
    assert ftc.supplemental_faces == 5
    assert [round(s, 1) for s in ftc.bbox.size] == [round(s, 1) for s in stc.bbox.size] == [190.5, 3.0, 279.4]


def test_d2mi_904_has_no_face_left_as_free_form():
    """Its 20 B-spline faces are exact spheres, tori and cones."""
    feats, topo = recognize_with_topology(load_step(_cached("nist-d2mi", "nist_d2mi_904")).body)
    assert sum(1 for f in topo.faces.values() if f.canonicalized) == 20
    assert all(f.surface_type != "other" for f in topo.faces.values())
    assert model_checks.unexplained_faces(topo, [f.to_dict() for f in feats]) is None


def test_ctc_02_blind_holes_are_blind():
    holes = [f for f in recognize_features(load_step(_cached("nist-pmi-step", "nist_ctc_02")).body) if f.type.value == "hole"]
    drilled = [h for h in holes if h.params["bottom_type"] == "drill_point"]
    assert len(drilled) == 54 and all(h.params["through"] is False and not h.params["countersunk"] for h in drilled)
    first = min(drilled, key=lambda h: h.id).params
    assert first["diameter"] == 12.0 and first["depth"] == 25.0 and first["point_angle_deg"] == 118.0
