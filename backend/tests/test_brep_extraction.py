"""The B-rep layer: model properties, face / edge / vertex records, mesh normals and face mapping, and face
identity across a rewrite (step_loader.model_properties, feature_recognition/topology.py, tessellator.py,
feature_recognition/identity.py)."""
import math
from pathlib import Path

import pytest
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt
from OCP.IFSelect import IFSelect_RetDone
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Writer

from app.services.feature_recognition.topology import build_topology, face_signature
from app.services.step_loader import load_step, model_properties
from app.services.tessellator import tessellate

CORPUS = Path(__file__).resolve().parent.parent / "samples" / "mf_corpus"


def _write(shape, path: Path) -> str:
    w = STEPControl_Writer()
    w.Transfer(shape, STEPControl_AsIs)
    assert w.Write(str(path)) == IFSelect_RetDone
    return str(path)


@pytest.fixture(scope="module")
def block(tmp_path_factory):
    return _write(BRepPrimAPI_MakeBox(100.0, 60.0, 20.0).Shape(), tmp_path_factory.mktemp("brep") / "block.step")


@pytest.fixture(scope="module")
def drilled(tmp_path_factory):
    """100 × 60 × 20 block with a Ø10 through hole at (30, 30) and a Ø8 × 12 blind hole at (70, 30) from the top."""
    box = BRepPrimAPI_MakeBox(100.0, 60.0, 20.0).Shape()
    through = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(30, 30, -1), gp_Dir(0, 0, 1)), 5.0, 22.0).Shape()
    blind = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(70, 30, 8), gp_Dir(0, 0, 1)), 4.0, 13.0).Shape()
    part = BRepAlgoAPI_Cut(BRepAlgoAPI_Cut(box, through).Shape(), blind).Shape()
    return _write(part, tmp_path_factory.mktemp("brep") / "drilled.step")


# --- model level -----------------------------------------------------------------------------------------

def test_block_counts_mass_properties_and_euler(block):
    L = load_step(block)
    m = model_properties(L, block)
    assert (m["solids"], m["shells"], m["faces"], m["edges"], m["vertices"]) == (1, 1, 6, 12, 8)
    assert math.isclose(m["volume"], 100 * 60 * 20, rel_tol=1e-9)
    assert math.isclose(m["surface_area"], 2 * (100 * 60 + 100 * 20 + 60 * 20), rel_tol=1e-9)
    assert all(math.isclose(a, b, abs_tol=1e-9) for a, b in zip(m["centre_of_mass"], (50, 30, 10)))
    assert m["euler"] == {"V": 8, "E": 12, "F": 6, "R": 0, "S": 1, "chi": 2, "genus": 0.0, "manifold": True}
    assert m["valid"] and m["file_length_unit"]["name"] == "mm"
    # principal axes of a box are its edges, the smallest moment about the longest side
    axes = sorted(m["principal_axes"], key=lambda a: a["moment"])
    assert abs(axes[0]["axis"][0]) > 0.999


def test_a_through_hole_is_a_handle_a_blind_hole_is_not(drilled):
    e = model_properties(load_step(drilled), drilled)["euler"]
    assert e["genus"] == 1.0 and e["manifold"]
    assert model_properties(load_step(str(CORPUS / "h12_round_blind_hole.step")))["euler"]["genus"] == 0.0


# --- faces and edges ---------------------------------------------------------------------------------------

def test_hole_edges_curvature_and_dihedral_angles(drilled):
    from app.services.feature_recognition.topology import sample_dihedrals
    topo = build_topology(load_step(drilled).body)
    assert all(len(e.dihedral_deg) <= 1 for e in topo.edges.values())        # recognition reads the midpoint only
    sample_dihedrals(topo)
    bores = {round(f.radius, 3): f for f in topo.faces.values() if f.surface_type == "cylinder"}
    assert set(bores) == {5.0, 4.0}
    for r, f in bores.items():
        assert f.material_side == "internal"
        assert math.isclose(f.curvature["min"], -1 / r, rel_tol=1e-6) and abs(f.curvature["max"]) < 1e-9
        assert math.isclose(f.area, 2 * math.pi * r * (20.0 if r == 5.0 else 12.0), rel_tol=1e-6)
    circles = [e for e in topo.edges.values() if e.curve_type == "circle"]
    assert len(circles) == 4 and all(e.closed and math.isclose(e.length, 2 * math.pi * e.params["radius"]) for e in circles)
    rims = [e for e in circles if e.convexity == "convex"]
    floor = [e for e in circles if e.convexity == "concave"]
    assert len(rims) == 3 and all(e.dihedral_deg == [90.0, 90.0, 90.0] for e in rims)       # 2 + 1 rim
    assert len(floor) == 1 and floor[0].dihedral_deg == [270.0, 270.0, 270.0]              # blind floor
    assert sum(e.seam for e in topo.edges.values()) == 2
    # every edge's vertices know it, and every face's edges list it as a neighbour
    for e in topo.edges.values():
        assert all(e.edge_id in topo.vertices[v].edge_ids for v in e.vertex_ids)
        assert all(e.edge_id in topo.faces[f].edge_ids for f in e.face_ids)


def test_shaft_curves_outwards_and_pocket_edges_are_concave():
    shaft = build_topology(load_step(str(CORPUS / "b28_external_cylinder.step")).body)
    cyl = next(f for f in shaft.faces.values() if f.surface_type == "cylinder")
    assert math.isclose(cyl.curvature["max"], 1 / cyl.radius, rel_tol=1e-6)
    pocket = build_topology(load_step(str(CORPUS / "o30_closed_pocket.step")).body)
    floor_edges = [e for e in pocket.edges.values() if e.convexity == "concave"]
    assert len(floor_edges) == 8 and all(e.dihedral_deg[-1] == 270.0 for e in floor_edges)


# --- mesh ---------------------------------------------------------------------------------------------------

@pytest.mark.parametrize("name", ["h12_round_blind_hole", "b28_external_cylinder", "h13_cyl_countersunk_hole"])
def test_mesh_normals_are_the_exact_outward_normals(name):
    L = load_step(str(CORPUS / f"{name}.step"))
    mesh = tessellate(L.shape, L.bbox)
    topo = build_topology(L.body)
    P, N = mesh.positions, mesh.normals
    for fr in mesh.face_ranges:
        f = topo.faces[fr["face_id"]]
        nodes = {i for i in mesh.indices[fr["index_start"]:fr["index_start"] + fr["index_count"]]}
        for i in nodes:
            p, n = P[3 * i:3 * i + 3], N[3 * i:3 * i + 3]
            if f.surface_type == "plane":
                want = f.normal
            elif f.surface_type == "cylinder":
                rel = [p[k] - f.axis_loc[k] for k in range(3)]
                t = sum(rel[k] * f.axis_dir[k] for k in range(3))
                radial = [rel[k] - t * f.axis_dir[k] for k in range(3)]
                ln = math.sqrt(sum(c * c for c in radial))
                want = [c / ln * (-1 if f.material_side == "internal" else 1) for c in radial]
            else:
                continue
            assert sum(n[k] * want[k] for k in range(3)) > 0.999, (name, fr["face_id"], n, want)


def test_every_face_has_triangles_and_the_lookup_round_trips(drilled):
    L = load_step(drilled)
    mesh = tessellate(L.shape, L.bbox)
    assert [fr["face_id"] for fr in mesh.face_ranges] == list(range(len(build_topology(L.body).faces)))
    start = 0
    for fr in mesh.face_ranges:
        assert fr["index_start"] == start and fr["index_count"] > 0
        start += fr["index_count"]
    assert start == len(mesh.indices)


# --- identity -----------------------------------------------------------------------------------------------







# --- recognition method and unclaimed regions -----------------------------------------------------------------

def test_every_feature_says_how_it_was_found():
    from app.services.feature_recognition import recognize_features
    for name in ("h15_stepped_hole", "o30_closed_pocket", "x23_chamfer", "b28_external_cylinder"):
        feats = recognize_features(load_step(str(CORPUS / f"{name}.step")).body)
        assert feats and all(f.recognition_method for f in feats), name
    assert any(f.recognition_method == "COAXIAL_INTERNAL_CYLINDERS"
               for f in recognize_features(load_step(str(CORPUS / "h15_stepped_hole.step")).body))


def test_faces_no_recognizer_claims_become_an_open_question_not_a_guess():
    from app.services.feature_recognition.engine import UNCLAIMED, unclaimed_regions
    from app.services.model_checks import unexplained_faces
    topo = build_topology(load_step(str(CORPUS / "h12_round_blind_hole.step")).body)
    planes = {fid for fid, f in topo.faces.items() if f.surface_type == "plane"}
    regions = unclaimed_regions(topo, planes)                      # as if nothing had claimed the bore
    assert len(regions) == 1
    r = regions[0]
    assert r.type.value == "unknown" and r.recognition_method == UNCLAIMED and r.confidence < 0.5
    assert r.params["surfaces"] == {"cylinder": 1} and "no feature template matched" in r.evidence[1]
    # still counted as unexplained: an `unknown` feature does not explain its faces
    note = unexplained_faces(topo, [{**r.to_dict(), "id": "FEAT-001"}])
    assert note and note.startswith("1 curved face")


