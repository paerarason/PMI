"""Load a STEP file into an XCAF document (with GD&T mode) and expose the shape + bbox."""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.IFSelect import IFSelect_RetDone
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TCollection import TCollection_ExtendedString
from OCP.TDF import TDF_LabelSequence
from OCP.TDocStd import TDocStd_Document
from OCP.TopoDS import TopoDS_Shape
from OCP.XCAFDoc import XCAFDoc_DocumentTool


class StepReadError(Exception):
    pass


@dataclass
class BBox:
    min: tuple[float, float, float]
    max: tuple[float, float, float]

    @property
    def size(self) -> tuple[float, float, float]:
        return tuple(self.max[i] - self.min[i] for i in range(3))  # type: ignore[return-value]

    @property
    def center(self) -> tuple[float, float, float]:
        return tuple((self.max[i] + self.min[i]) / 2 for i in range(3))  # type: ignore[return-value]

    @property
    def diagonal(self) -> float:
        s = self.size
        return (s[0] ** 2 + s[1] ** 2 + s[2] ** 2) ** 0.5


@dataclass
class LoadedStep:
    doc: TDocStd_Document
    # Everything in the file, in the canonical face/edge order the viewer and the PMI readers share.
    shape: TopoDS_Shape
    # Size of the part itself: the box around `body`, never around supplemental geometry.
    bbox: BBox
    part_name: str
    schema: str
    header: dict
    # The solid(s) only: what is recognized, planned and machined. Its faces and edges are the first ones of
    # `shape`, in the same order, so an id found on `body` is the same id in the viewer.
    body: TopoDS_Shape | None = None
    solids: int = 0
    # Faces of `shape` that are in no solid (construction planes, axes' surfaces, datum targets).
    supplemental_faces: int = 0
    # What a person should know about this file's geometry before trusting the results. Shown as warnings.
    diagnostics: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if self.body is None:
            self.body = self.shape


def _bbox(shape: TopoDS_Shape) -> BBox:
    # AddOptimal, not Add: at load time the shape has no triangulation yet, so the plain Add_s falls back
    # to each face's *geometric* surface - for NURBS/B-spline faces that means the control-point (pole)
    # hull, which can bulge far outside the actual trimmed surface and grossly inflates the box (observed
    # on samples/CM3G_*: a ~29mm part reported as 143mm). AddOptimal samples the real trimmed surfaces for
    # a tight box that matches the tessellated geometry - which also keeps the mesh deflection (scaled to
    # this box's diagonal in tessellator.tessellate) sane instead of over-coarse.
    box = Bnd_Box()
    BRepBndLib.AddOptimal_s(shape, box, True, False)
    xmin, ymin, zmin, xmax, ymax, zmax = box.Get()
    return BBox((xmin, ymin, zmin), (xmax, ymax, zmax))


_SCHEMA_RE = re.compile(r"FILE_SCHEMA\s*\(\s*\(\s*'([^']*)'", re.S)
_FILE_NAME_RE = re.compile(r"FILE_NAME\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\(\s*'([^']*)'", re.S)
_PRODUCT_RE = re.compile(r"PRODUCT\s*\(\s*'([^']*)'\s*,\s*'([^']*)'", re.S)


def read_header(path: str) -> dict:
    with open(path, "r", errors="ignore") as f:
        text = f.read(65536)
    out: dict = {"schema": "", "file_name": "", "timestamp": "", "author": "", "product": ""}
    m = _SCHEMA_RE.search(text)
    if m:
        out["schema"] = m.group(1)
    m = _FILE_NAME_RE.search(text)
    if m:
        out["file_name"], out["timestamp"], out["author"] = m.group(1), m.group(2), m.group(3)
    m = _PRODUCT_RE.search(text)
    if m:
        out["product"] = m.group(1) or m.group(2)
    return out


def _faces_without_surface(shape) -> tuple[int, int]:
    from OCP.BRep import BRep_Tool
    from OCP.TopAbs import TopAbs_FACE
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopoDS import TopoDS

    meshed = total = 0
    exp = TopExp_Explorer(shape, TopAbs_FACE)
    while exp.More():
        total += 1
        if BRep_Tool.Surface_s(TopoDS.Face_s(exp.Current())) is None:
            meshed += 1
        exp.Next()
    return meshed, total


def _count(shape: TopoDS_Shape, kind) -> int:
    from OCP.TopExp import TopExp_Explorer

    n = 0
    exp = TopExp_Explorer(shape, kind)
    while exp.More():
        n += 1
        exp.Next()
    return n


def _compound(parts: list[TopoDS_Shape]) -> TopoDS_Shape:
    from OCP.BRep import BRep_Builder
    from OCP.TopoDS import TopoDS_Compound

    comp = TopoDS_Compound()
    builder = BRep_Builder()
    builder.MakeCompound(comp)
    for part in parts:
        builder.Add(comp, part)
    return comp


def split_body(shape: TopoDS_Shape) -> tuple[list[TopoDS_Shape], list[TopoDS_Shape]]:
    """(solids, everything else) among the top-level pieces of `shape`, looking through compounds. Each
    piece keeps its placement, so a solid inside an assembly comes back where the assembly puts it."""
    from OCP.TopAbs import TopAbs_COMPOUND, TopAbs_COMPSOLID, TopAbs_SOLID
    from OCP.TopoDS import TopoDS_Iterator

    solids: list[TopoDS_Shape] = []
    rest: list[TopoDS_Shape] = []

    def walk(s: TopoDS_Shape) -> None:
        kind = s.ShapeType()
        if kind == TopAbs_COMPOUND:
            it = TopoDS_Iterator(s)
            while it.More():
                walk(it.Value())
                it.Next()
        elif kind in (TopAbs_SOLID, TopAbs_COMPSOLID):
            solids.append(s)
        else:
            rest.append(s)

    walk(shape)
    return solids, rest


def _invalid_faces(body: TopoDS_Shape) -> tuple[int, int]:
    """(faces OCCT's checker rejects, all faces) of `body`. (0, n) for a healthy B-rep."""
    from OCP.BRepCheck import BRepCheck_Analyzer
    from OCP.TopAbs import TopAbs_FACE
    from OCP.TopExp import TopExp_Explorer

    analyzer = BRepCheck_Analyzer(body)
    total = _count(body, TopAbs_FACE)
    if analyzer.IsValid():
        return 0, total
    bad = 0
    exp = TopExp_Explorer(body, TopAbs_FACE)
    while exp.More():
        if not analyzer.IsValid(exp.Current()):
            bad += 1
        exp.Next()
    return bad, total


def _diagnose(body: TopoDS_Shape, solids: int, supplemental_faces: int, check: bool = True) -> list[str]:
    from OCP.TopAbs import TopAbs_FACE, TopAbs_SHELL

    notes: list[str] = []
    if solids == 0:
        notes.append(f"This file has no solid body, only {_count(body, TopAbs_FACE)} surface(s) in "
                     f"{_count(body, TopAbs_SHELL)} open shell(s). Feature recognition needs a "
                     "closed solid, so their results for this file are unreliable. Export the part as a solid.")
    elif solids > 1:
        notes.append(f"This file holds {solids} solid bodies (an assembly or a multi-body part). They are analysed "
                     "together as one part: features are found on every body, but the part's size treats "
                     "them as a single workpiece. Open one component at a time for reliable results.")
    if supplemental_faces:
        notes.append(f"{supplemental_faces} surface(s) outside the solid (supplemental or construction geometry) are "
                     "shown, but left out of the part's size and feature recognition.")
    try:
        bad, total = _invalid_faces(body) if check else (0, 0)
    except Exception:  # noqa: BLE001 - the check is advice; a checker failure must not block the load
        bad, total = 0, 0
    if bad:
        notes.append(f"The geometry check fails on {bad} of {total} face(s) (bad trimming, self-intersection or an "
                     "open boundary). Sizes and features on or next to those faces may be wrong.")
    return notes


_UNIT_RECORD = re.compile(r"#\d+\s*=[^;]*(?:UNIT|CONTEXT|MEASURE)[^;]*;", re.S)


def file_length_unit(path: str) -> tuple[str, float]:
    """The length unit the file's geometry is written in, and mm per unit ('in', 25.4). OCCT converts every
    coordinate to mm on reading; this says what the designer worked in. Only the unit and context records
    are tokenized, so a 6 MB file costs a regex pass, not a full parse."""
    from app.services.pmi_part21 import context_length_unit, parse_step_entities

    with open(path, "r", errors="ignore") as f:
        text = f.read()
    records = "\n".join(m.group(0) for m in _UNIT_RECORD.finditer(text))
    return context_length_unit(parse_step_entities(records))


def model_properties(loaded: LoadedStep, path: str | None = None) -> dict:
    """Model-level facts about the part (its solids): mass properties at unit density, principal axes, entity
    counts, validity and the Euler–Poincaré check.

    Euler–Poincaré on a closed, manifold B-rep: V − E + F − R = 2 (S − H), with R the inner loops of faces
    (wires beyond each face's outer one), S the shells and H the genus: the number of through holes (handles).
    Degenerated edges (a sphere's pole) are left out of E, as they are points. A result that is not a
    non-negative whole number means the topology is not a closed manifold."""
    from OCP.BRep import BRep_Tool
    from OCP.BRepGProp import BRepGProp
    from OCP.GProp import GProp_GProps
    from OCP.TopAbs import TopAbs_EDGE, TopAbs_FACE, TopAbs_SHELL, TopAbs_SOLID, TopAbs_VERTEX, TopAbs_WIRE
    from OCP.TopExp import TopExp, TopExp_Explorer
    from OCP.TopoDS import TopoDS
    from OCP.TopTools import TopTools_IndexedMapOfShape

    body = loaded.body

    def unique(kind) -> TopTools_IndexedMapOfShape:
        m = TopTools_IndexedMapOfShape()
        TopExp.MapShapes_s(body, kind, m)
        return m

    solids, shells, faces = unique(TopAbs_SOLID), unique(TopAbs_SHELL), unique(TopAbs_FACE)
    edges, vertices, wires = unique(TopAbs_EDGE), unique(TopAbs_VERTEX), unique(TopAbs_WIRE)
    n_edges = sum(1 for i in range(1, edges.Extent() + 1) if not BRep_Tool.Degenerated_s(TopoDS.Edge_s(edges.FindKey(i))))
    rings = wires.Extent() - faces.Extent()
    closed_shells = sum(1 for i in range(1, shells.Extent() + 1) if BRep_Tool.IsClosed_s(shells.FindKey(i)))

    out: dict = {
        "solids": solids.Extent(), "shells": shells.Extent(), "closed_shells": closed_shells,
        "faces": faces.Extent(), "wires": wires.Extent(), "edges": edges.Extent(), "vertices": vertices.Extent(),
        "bbox": {"min": list(loaded.bbox.min), "max": list(loaded.bbox.max), "size": list(loaded.bbox.size)},
        "supplemental_faces": loaded.supplemental_faces, "diagnostics": list(loaded.diagnostics),
    }
    euler = vertices.Extent() - n_edges + faces.Extent() - rings
    genus = shells.Extent() - euler / 2.0
    out["euler"] = {"V": vertices.Extent(), "E": n_edges, "F": faces.Extent(), "R": rings, "S": shells.Extent(),
                    "chi": euler, "genus": genus if closed_shells == shells.Extent() else None,
                    "manifold": closed_shells == shells.Extent() and genus >= 0 and float(genus).is_integer()}

    area = GProp_GProps()
    BRepGProp.SurfaceProperties_s(body, area)
    out["surface_area"] = area.Mass()
    if solids.Extent():
        vol = GProp_GProps()
        BRepGProp.VolumeProperties_s(body, vol)
        c = vol.CentreOfMass()
        out["volume"] = vol.Mass()
        out["centre_of_mass"] = [c.X(), c.Y(), c.Z()]
        pp = vol.PrincipalProperties()
        i1, i2, i3 = pp.Moments()
        axes = [pp.FirstAxisOfInertia(), pp.SecondAxisOfInertia(), pp.ThirdAxisOfInertia()]
        # Moments of inertia at unit density (mm⁵): only their ratios and the axes mean anything here.
        out["principal_axes"] = [{"moment": m, "axis": [a.X(), a.Y(), a.Z()]} for m, a in zip((i1, i2, i3), axes)]
    else:
        out["volume"] = None
        out["centre_of_mass"] = None
        out["principal_axes"] = None
    try:
        from OCP.BRepCheck import BRepCheck_Analyzer
        out["valid"] = bool(BRepCheck_Analyzer(body).IsValid())
    except Exception:  # noqa: BLE001
        out["valid"] = None
    if path:
        try:
            name, mm = file_length_unit(path)
            out["file_length_unit"] = {"name": name, "mm_per_unit": mm, "note": "coordinates are converted to mm on reading"}
        except Exception:  # noqa: BLE001
            out["file_length_unit"] = None
    return out


def load_step(path: str, diagnose: bool = True) -> LoadedStep:
    """Read a STEP file. `diagnose=False` skips the geometry check (the slow part of `diagnostics`), for a
    caller that reloads a file already checked when it was first opened."""
    reader = STEPCAFControl_Reader()
    reader.SetGDTMode(True)
    reader.SetNameMode(True)
    reader.SetColorMode(True)
    if reader.ReadFile(path) != IFSelect_RetDone:
        raise StepReadError("STEP file could not be parsed")
    doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
    if not reader.Transfer(doc):
        raise StepReadError("STEP transfer to XCAF document failed")

    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    free = TDF_LabelSequence()
    shape_tool.GetFreeShapes(free)
    if free.Length() == 0:
        raise StepReadError("STEP file contains no shapes")
    if free.Length() == 1:
        shape = shape_tool.GetShape_s(free.Value(1))
    else:
        shape = _compound([shape_tool.GetShape_s(free.Value(i)) for i in range(1, free.Length() + 1)])
    if shape.IsNull():
        raise StepReadError("STEP file produced an empty shape")
    meshed, faces = _faces_without_surface(shape)
    if meshed:
        # Every stage after this (PMI face matching, balloons, recognition, ray casting) evaluates exact
        # surfaces; OCCT dereferences a missing one and crashes the process instead of raising.
        raise StepReadError(f"{meshed} of {faces} faces are tessellated (faceted) geometry with no exact surface. "
                            "This app needs exact B-rep geometry: export the part as a solid (AP242/AP214 B-rep), "
                            "not as tessellated or mesh geometry.")

    # Real files carry more than the part: construction planes, axis surfaces and datum targets sit next to
    # the solid as loose faces and curves (NIST FTC-09, STC-07). They belong in the view, since PMI can point
    # at them, but not in the part: left in, they inflate the bounding box (and so the stock) and get
    # recognized as machinable faces. So the solids go first and `body` is the solids alone.
    from OCP.TopAbs import TopAbs_FACE

    solids, rest = split_body(shape)
    body = shape
    supplemental_faces = 0
    if solids and rest:
        body = solids[0] if len(solids) == 1 else _compound(solids)
        shape = _compound(solids + rest)
        supplemental_faces = sum(_count(r, TopAbs_FACE) for r in rest)

    header = read_header(path)
    part_name = header.get("product") or header.get("file_name") or "Unnamed part"
    return LoadedStep(doc=doc, shape=shape, bbox=_bbox(body), part_name=part_name, schema=header.get("schema", ""),
                      header=header, body=body, solids=len(solids), supplemental_faces=supplemental_faces,
                      diagnostics=_diagnose(body, len(solids), supplemental_faces, check=diagnose))
