"""Generate the MF reference corpus: one single-feature STEP part per MFDataset machining-feature class.

Reference taxonomy: `leiruoshan/MFPointNet_feature_dataset` (MFDataset) — 33 machining-feature
subcategories in 8 groups (slots, holes, steps, threads, transitions, protrudes, bases, others). That
dataset ships STL/voxel/point-cloud data for a *neural* classifier; we need B-rep ground truth for a
*deterministic* one, so each class is rebuilt here as a clean AP242 solid carrying exactly one feature
on a standard blank (MFDataset's own "single-feature extraction" convention).

Each part is the smallest honest instance of its class, so a miss is unambiguous: if the recognizer gets
`mf_s03_rounded_groove` wrong, nothing else in the part can be blamed.

    .venv/bin/python scripts/make_mf_corpus.py        # writes backend/samples/mf_corpus/*.step
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from OCP.BRep import BRep_Tool  # noqa: E402
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut, BRepAlgoAPI_Fuse  # noqa: E402
from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeFace, BRepBuilderAPI_MakePolygon  # noqa: E402
from OCP.BRepFilletAPI import BRepFilletAPI_MakeChamfer, BRepFilletAPI_MakeFillet  # noqa: E402
from OCP.BRepPrimAPI import (  # noqa: E402
    BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCone, BRepPrimAPI_MakeCylinder, BRepPrimAPI_MakeSphere,
    BRepPrimAPI_MakePrism,
)
from OCP.BRepAdaptor import BRepAdaptor_Curve  # noqa: E402
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt, gp_Trsf, gp_Vec  # noqa: E402
from OCP.BRepBuilderAPI import BRepBuilderAPI_Transform  # noqa: E402
from OCP.IFSelect import IFSelect_RetDone  # noqa: E402
from OCP.Interface import Interface_Static  # noqa: E402
from OCP.STEPCAFControl import STEPCAFControl_Writer  # noqa: E402
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller  # noqa: E402
from OCP.TCollection import TCollection_ExtendedString  # noqa: E402
from OCP.TDataStd import TDataStd_Name  # noqa: E402
from OCP.TDocStd import TDocStd_Document  # noqa: E402
from OCP.TopAbs import TopAbs_EDGE  # noqa: E402
from OCP.TopExp import TopExp_Explorer  # noqa: E402
from OCP.TopoDS import TopoDS  # noqa: E402
from OCP.XCAFDoc import XCAFDoc_DocumentTool  # noqa: E402

from app import config  # noqa: E402
from app.services.step_text_utils import dewrap  # noqa: E402

OUT_DIR = config.SAMPLES_DIR / "mf_corpus"

# Standard blanks. Every prismatic class is cut from BLOCK, every turned class from SHAFT, so a
# recognizer regression shows up as a diff against a fixed background of plain faces.
BW, BD, BH = 60.0, 40.0, 20.0          # block: X, Y, Z (top face at Z=20)
SR, SL = 15.0, 60.0                    # shaft: radius 15 (Ø30), length 60 along +Z


# --- primitive helpers -------------------------------------------------------------------------

def _box(x0, y0, z0, x1, y1, z1):
    return BRepPrimAPI_MakeBox(gp_Pnt(x0, y0, z0), gp_Pnt(x1, y1, z1)).Shape()


def _cyl(origin, direction, r, h):
    return BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(*origin), gp_Dir(*direction)), r, h).Shape()


def _cone(origin, direction, r1, r2, h):
    return BRepPrimAPI_MakeCone(gp_Ax2(gp_Pnt(*origin), gp_Dir(*direction)), r1, r2, h).Shape()


def _sphere(center, r):
    return BRepPrimAPI_MakeSphere(gp_Pnt(*center), r).Shape()


def _prism(points, vec):
    """Solid prism: close `points` (a planar polygon) into a face and sweep it along `vec`."""
    poly = BRepBuilderAPI_MakePolygon()
    for p in points:
        poly.Add(gp_Pnt(*p))
    poly.Close()
    face = BRepBuilderAPI_MakeFace(poly.Wire()).Face()
    return BRepPrimAPI_MakePrism(face, gp_Vec(*vec)).Shape()


def _cut(a, b):
    return BRepAlgoAPI_Cut(a, b).Shape()


def _fuse(a, b):
    return BRepAlgoAPI_Fuse(a, b).Shape()


def _rotate(shape, origin, axis, deg):
    t = gp_Trsf()
    t.SetRotation(gp_Ax2(gp_Pnt(*origin), gp_Dir(*axis)).Axis(), math.radians(deg))
    return BRepBuilderAPI_Transform(shape, t, True).Shape()


def _edge_mid(edge):
    c = BRepAdaptor_Curve(edge)
    p = c.Value(0.5 * (c.FirstParameter() + c.LastParameter()))
    return (p.X(), p.Y(), p.Z())


def _edges_near(shape, point, tol=0.6):
    """Every edge whose midpoint sits within `tol` of `point` — how the blend classes pick their edge."""
    out = []
    exp = TopExp_Explorer(shape, TopAbs_EDGE)
    seen = set()
    while exp.More():
        e = TopoDS.Edge_s(exp.Current())
        key = e.TShape()
        if key not in seen:
            seen.add(key)
            if math.dist(_edge_mid(e), point) <= tol:
                out.append(e)
        exp.Next()
    return out


def _fillet(shape, point, radius, tol=0.6):
    mk = BRepFilletAPI_MakeFillet(shape)
    edges = _edges_near(shape, point, tol)
    if not edges:
        raise RuntimeError(f"no edge near {point} to fillet")
    for e in edges:
        mk.Add(radius, e)
    return mk.Shape()


def _chamfer(shape, point, dist, tol=0.6):
    mk = BRepFilletAPI_MakeChamfer(shape)
    edges = _edges_near(shape, point, tol)
    if not edges:
        raise RuntimeError(f"no edge near {point} to chamfer")
    for e in edges:
        mk.Add(dist, e)
    return mk.Shape()


def block():
    return _box(0, 0, 0, BW, BD, BH)


def shaft():
    return _cyl((0, 0, 0), (0, 0, 1), SR, SL)


# --- the 33 MFDataset classes ------------------------------------------------------------------
# Each builder returns (shape, note). `note` records what a correct recognizer should say, in words.

# Group 1 — SLOTS (10)

def s01_t_through_slot():
    """T-slot: a narrow mouth through the top opening into a wider undercut channel below."""
    s = block()
    s = _cut(s, _box(22, -1, 12, 38, BD + 1, BH + 1))      # mouth, 16 wide
    s = _cut(s, _box(14, -1, 4, 46, BD + 1, 12))           # undercut head, 32 wide
    return s, "one T-slot (undercut) through in Y; mouth 16 wide, head 32 wide, total depth 16"


def s02_v_through_slot():
    """V-slot: two slanted planar walls meeting at an apex — no flat floor at all."""
    s = block()
    tool = _prism([(20, -1, BH + 1), (30, -1, 4), (40, -1, BH + 1)], (0, BD + 2, 0))
    return _cut(s, tool), "one V-slot through in Y; 90deg included, apex at Z=4"


def s03_rounded_groove():
    """Rounded groove: a semicircular channel milled with a ball/round tool. Cylindrical, ~180 deg sweep."""
    s = block()
    tool = _cyl((30, -1, BH), (0, 1, 0), 6.0, BD + 2)       # axis on the top face -> half buried
    return _cut(s, tool), "one rounded groove R6 through in Y, floor at Z=14 (NOT a hole)"


def s04_dovetail_groove():
    """Swallowtail/dovetail groove: flat floor, walls undercut outward at 60 deg."""
    s = block()
    tool = _prism([(26, -1, BH + 1), (24, -1, 6), (36, -1, 6), (34, -1, BH + 1)], (0, BD + 2, 0))
    return _cut(s, tool), "one dovetail groove through in Y, mouth 8 wide, floor 12 wide at Z=6 (undercut)"


def s05_keyway_a():
    """A-keyway: rectangular keyseat running the full shaft length (open at both ends)."""
    s = shaft()
    return _cut(s, _box(-4, -1, -1, 4, SR + 1, SL + 1)), "one full-length keyway 8 wide x 5 deep on the OD"


def s06_keyway_b():
    """B-keyway: keyseat open at one end, blind (runout) at the other."""
    s = shaft()
    return _cut(s, _box(-4, 4.0, 30, 4, SR + 1, SL + 1)), "one keyway 8 wide, open at the top end only"


def s07_keyway_c():
    """C-keyway: keyseat blind at both ends (a closed pocket on a cylindrical face)."""
    s = shaft()
    return _cut(s, _box(-4, 4.0, 20, 4, SR + 1, 45)), "one keyway 8 wide, blind at both ends"


def s08_half_moon_keyway():
    """Woodruff keyway: cut by a disc cutter, so the floor is a circular arc, not a plane."""
    s = shaft()
    tool = _cyl((-20, 12.0, 30), (1, 0, 0), 10.0, 40.0)     # disc axis across the shaft
    return _cut(s, tool), "one Woodruff (half-moon) keyseat, disc R10, arc floor"


def s09_straight_groove():
    """Straight groove: plain rectangular blind channel across the face."""
    s = block()
    return _cut(s, _box(-1, 16, 14, BW + 1, 24, BH + 1)), "one straight groove 8 wide x 6 deep, through in X"


def s10_ring_groove():
    """Ring groove: an annular relief turned into the OD (retaining-ring / O-ring seat)."""
    s = shaft()
    ring = _cut(_cyl((0, 0, 25), (0, 0, 1), SR + 1, 6.0), _cyl((0, 0, 24), (0, 0, 1), 11.0, 8.0))
    return _cut(s, ring), "one ring groove, root Ø22, width 6, at Z=25..31 (NOT a counterbore)"


# Group 2 — HOLES (6)

def h11_round_through_hole():
    return _cut(block(), _cyl((30, 20, -1), (0, 0, 1), 5.0, BH + 2)), "one Ø10 through hole"


def h12_round_blind_hole():
    return _cut(block(), _cyl((30, 20, 8), (0, 0, 1), 5.0, BH + 2)), "one Ø10 blind hole, 12 deep"


def h13_cyl_countersunk_hole():
    """'Cylindrical countersunk' in MFDataset = a counterbore (flat-bottomed enlargement)."""
    s = _cut(block(), _cyl((30, 20, -1), (0, 0, 1), 4.0, BH + 2))
    return _cut(s, _cyl((30, 20, 14), (0, 0, 1), 7.0, BH + 2)), "Ø8 through, counterbored Ø14 x 6 deep"


def h14_taper_countersunk_hole():
    s = _cut(block(), _cyl((30, 20, -1), (0, 0, 1), 4.0, BH + 2))
    cs = _cone((30, 20, BH - 4.0), (0, 0, 1), 4.0, 8.0, 4.0)   # 90 deg included
    return _cut(s, cs), "Ø8 through, 90deg countersink to Ø16"


def h15_stepped_hole():
    s = _cut(block(), _cyl((30, 20, -1), (0, 0, 1), 3.0, BH + 2))
    s = _cut(s, _cyl((30, 20, 7), (0, 0, 1), 5.0, BH + 2))
    return _cut(s, _cyl((30, 20, 15), (0, 0, 1), 7.0, BH + 2)), "3-diameter stepped hole Ø6/Ø10/Ø14"


def h16_center_hole():
    """Centre hole (DIN 332 A): a small pilot cylinder under a 60 deg protecting cone."""
    s = _cut(block(), _cyl((30, 20, BH - 8.0), (0, 0, 1), 2.0, 10.0))
    cone = _cone((30, 20, BH - 7.5), (0, 0, 1), 2.0, 6.33, 7.5)   # half-angle atan(4.33/7.5) = 30 deg -> 60 deg included
    return _cut(s, cone), "Ø4 centre hole with a 60deg protecting cone"


# Group 3 — STEPS (3)

def t17_rect_through_step():
    """Rectangular through step: a corner removed, open on two sides."""
    return _cut(block(), _box(40, 24, 10, BW + 1, BD + 1, BH + 1)), "one rectangular through step, 10 deep"


def t18_general_step():
    """General step: the same shoulder, but with a slanted wall (draft)."""
    tool = _prism([(38, -1, BH + 1), (44, -1, 10), (BW + 1, -1, 10), (BW + 1, -1, BH + 1)], (0, BD + 2, 0))
    return _cut(block(), tool), "one general (slanted-wall) step, 10 deep, open in X and Y"


def t19_shaft_step():
    """Shaft step: the OD turned down over part of the length, leaving a shoulder face."""
    s = shaft()
    relief = _cut(_cyl((0, 0, 35), (0, 0, 1), SR + 1, SL), _cyl((0, 0, 34), (0, 0, 1), 10.0, SL + 2))
    return _cut(s, relief), "stepped shaft Ø30 -> Ø20 at Z=35, square shoulder"


# Group 4 — THREADS (2)   [geometry is a plain cylinder; the thread lives in PMI/naming]

def r20_internal_thread():
    return _cut(block(), _cyl((30, 20, -1), (0, 0, 1), 5.2, BH + 2)), "M12x1.75 tapped through hole (Ø10.4 tap drill)"


def r21_external_thread():
    return _cyl((0, 0, 0), (0, 0, 1), 10.0, 40.0), "M20x2.5 external thread (Ø20 major)"


# Group 5 — TRANSITIONS (3)

def x22_rounding():
    """Rounding: a concave blend in an internal corner (here, the inside corner of an L-bracket)."""
    s = _cut(block(), _box(30, -1, 10, BW + 1, BD + 1, BH + 1))
    return _fillet(s, (30.0, 20.0, 10.0), 5.0), "one concave rounding R5 along the internal corner"


def x23_chamfer():
    return _chamfer(block(), (30.0, 0.0, BH), 4.0), "one 45deg chamfer, 4mm leg, along the top front edge"


def x24_round():
    """Round: a convex blend breaking an external corner (a vertical edge of the block)."""
    return _fillet(block(), (0.0, 0.0, 10.0), 6.0), "one convex round R6 on the vertical corner"


# Group 6 — PROTRUDES (2)

def p25_convex_hull():
    """Convex hull: a prismatic pad standing proud of the base face."""
    return _fuse(block(), _box(20, 12, BH, 40, 28, BH + 8)), "one rectangular pad 20x16x8 standing on the top face"


def p26_boss():
    """Boss: a cylindrical pad standing proud of the base face."""
    return _fuse(block(), _cyl((30, 20, BH), (0, 0, 1), 9.0, 10.0)), "one Ø18 x 10 cylindrical boss on the top face"


# Group 7 — BASES (2)

def b27_plane():
    return block(), "plain blank: 6 planes, no machined feature"


def b28_external_cylinder():
    return shaft(), "plain blank: one Ø30 external cylindrical surface + 2 end planes"


# Group 8 — OTHERS (5)

def o29_open_pocket():
    """Open pocket: a floor with walls on three sides, open (no wall) on the fourth."""
    return _cut(block(), _box(16, 14, 12, 44, BD + 1, BH + 1)), "one open pocket 28 x 26 x 8 deep, open on +Y"


def o30_closed_pocket():
    return _cut(block(), _box(16, 12, 12, 44, 28, BH + 1)), "one closed pocket 28 x 16 x 8 deep, 4 walls"


def o31_triangular_rib():
    """Triangular rib: a gusset standing between a floor and an upstanding wall."""
    s = _cut(block(), _box(30, -1, 10, BW + 1, BD + 1, BH + 1))          # L-bracket
    rib = _prism([(30, 16, 10), (30, 16, BH), (44, 16, 10)], (0, 8, 0))  # gusset inside the corner
    return _fuse(s, rib), "one triangular rib 8 thick in the internal corner"


def o32_general_volume():
    """General removal of volume: an oblique cut that matches no feature template."""
    tool = _rotate(_box(-10, -10, 14, 20, 50, 40), (20, 20, 14), (0, 1, 0), 25.0)
    return _cut(block(), tool), "one oblique/arbitrary volume removal (no template applies)"


def o33_spherical_crown():
    return _fuse(block(), _cut(_sphere((30, 20, BH), 10.0), _box(-1, -1, -1, BW + 1, BD + 1, BH))), \
        "one R10 spherical crown (dome) on the top face"


CLASSES = [
    ("slot", "s01_t_through_slot", s01_t_through_slot),
    ("slot", "s02_v_through_slot", s02_v_through_slot),
    ("slot", "s03_rounded_groove", s03_rounded_groove),
    ("slot", "s04_dovetail_groove", s04_dovetail_groove),
    ("slot", "s05_keyway_a", s05_keyway_a),
    ("slot", "s06_keyway_b", s06_keyway_b),
    ("slot", "s07_keyway_c", s07_keyway_c),
    ("slot", "s08_half_moon_keyway", s08_half_moon_keyway),
    ("slot", "s09_straight_groove", s09_straight_groove),
    ("slot", "s10_ring_groove", s10_ring_groove),
    ("hole", "h11_round_through_hole", h11_round_through_hole),
    ("hole", "h12_round_blind_hole", h12_round_blind_hole),
    ("hole", "h13_cyl_countersunk_hole", h13_cyl_countersunk_hole),
    ("hole", "h14_taper_countersunk_hole", h14_taper_countersunk_hole),
    ("hole", "h15_stepped_hole", h15_stepped_hole),
    ("hole", "h16_center_hole", h16_center_hole),
    ("step", "t17_rect_through_step", t17_rect_through_step),
    ("step", "t18_general_step", t18_general_step),
    ("step", "t19_shaft_step", t19_shaft_step),
    ("thread", "r20_internal_thread", r20_internal_thread),
    ("thread", "r21_external_thread", r21_external_thread),
    ("transition", "x22_rounding", x22_rounding),
    ("transition", "x23_chamfer", x23_chamfer),
    ("transition", "x24_round", x24_round),
    ("protrude", "p25_convex_hull", p25_convex_hull),
    ("protrude", "p26_boss", p26_boss),
    ("base", "b27_plane", b27_plane),
    ("base", "b28_external_cylinder", b28_external_cylinder),
    ("other", "o29_open_pocket", o29_open_pocket),
    ("other", "o30_closed_pocket", o30_closed_pocket),
    ("other", "o31_triangular_rib", o31_triangular_rib),
    ("other", "o32_general_volume", o32_general_volume),
    ("other", "o33_spherical_crown", o33_spherical_crown),
]


def write_step(shape, path: Path, product: str):
    doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
    XCAFDoc_DocumentTool.SetLengthUnit_s(doc, 0.001)
    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    root = shape_tool.AddShape(shape, False)
    TDataStd_Name.Set_s(root, TCollection_ExtendedString(product))

    STEPControl_Controller.Init_s()
    Interface_Static.SetCVal_s("write.step.schema", "AP242DIS")
    Interface_Static.SetCVal_s("write.step.product.name", product)
    w = STEPCAFControl_Writer()
    w.SetNameMode(True)
    if not w.Transfer(doc, STEPControl_AsIs):
        raise RuntimeError(f"{product}: XCAF -> STEP transfer failed")
    path.parent.mkdir(parents=True, exist_ok=True)
    if w.Write(str(path)) != IFSelect_RetDone:
        raise RuntimeError(f"{product}: STEP write failed")
    path.write_text(dewrap(path.read_text()))


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = fail = 0
    for group, name, builder in CLASSES:
        try:
            shape, note = builder()
            write_step(shape, OUT_DIR / f"{name}.step", f"MF-{name.upper()}")
            print(f"  [{group:10s}] {name:26s} {note}")
            ok += 1
        except Exception as exc:  # noqa: BLE001 - report and keep going, one bad class shouldn't stop the run
            print(f"  [{group:10s}] {name:26s} BUILD FAILED: {exc}")
            fail += 1
    print(f"\n{ok} parts written to {OUT_DIR}" + (f", {fail} failed" if fail else ""))


if __name__ == "__main__":
    main()
