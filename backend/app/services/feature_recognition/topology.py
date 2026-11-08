"""Face/edge adjacency graph + per-face geometry, the substrate every recognizer reads.

Reuses the tessellator's canonical `iter_faces` / `iter_edges` ordering (so feature face/edge refs match
the ids the 3D viewer, PMI extractor and PMI writer all use) and `feature_classifier`'s surface/material
helpers (so the material-side call agrees with the control-plan side of the app).
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from OCP.Bnd import Bnd_Box
from OCP.BRep import BRep_Tool
from OCP.BRepAdaptor import BRepAdaptor_Curve, BRepAdaptor_Surface
from OCP.BRepBndLib import BRepBndLib
from OCP.BRepClass3d import BRepClass3d_SolidClassifier
from OCP.BRepGProp import BRepGProp
from OCP.BRepLProp import BRepLProp_SLProps
from OCP.BRepTools import BRepTools
from OCP.GCPnts import GCPnts_AbscissaPoint
from OCP.GeomAbs import (GeomAbs_BezierCurve, GeomAbs_BezierSurface, GeomAbs_BSplineCurve, GeomAbs_BSplineSurface,
                         GeomAbs_Circle, GeomAbs_Cone, GeomAbs_Cylinder, GeomAbs_Ellipse, GeomAbs_Hyperbola,
                         GeomAbs_Line, GeomAbs_OffsetCurve, GeomAbs_OffsetSurface, GeomAbs_Parabola, GeomAbs_Plane,
                         GeomAbs_Sphere, GeomAbs_SurfaceOfExtrusion, GeomAbs_SurfaceOfRevolution, GeomAbs_Torus)
from OCP.gp import gp_Dir, gp_Lin, gp_Pnt, gp_Vec
from OCP.GProp import GProp_GProps
from OCP.IntCurvesFace import IntCurvesFace_ShapeIntersector
from OCP.ShapeAnalysis import ShapeAnalysis_Surface
from OCP.TopAbs import TopAbs_EDGE, TopAbs_IN, TopAbs_REVERSED
from OCP.TopExp import TopExp, TopExp_Explorer
from OCP.TopoDS import TopoDS, TopoDS_Edge, TopoDS_Face, TopoDS_Shape

from app.services.canonical import canonical_face
from app.services.feature_classifier import (
    MaterialSide,
    _axis,
    _dot,
    _is_internal_radial,
    _mid_uv,
    _outward_normal,
    _pt,
    _sub,
    _unit,
)
from app.services.tessellator import iter_edges, iter_faces, iter_vertices

# Edges whose two faces meet at less than this angle are treated as a smooth (tangent) blend, not a real
# convex/concave feature edge — e.g. a fillet meeting the wall it blends into. cos(5°) ≈ 0.9962.
_TANGENT_COS = math.cos(math.radians(5.0))

# The surface type the file wrote, before canonical.py looks for an analytic surface under it.
_WRITTEN_AS = {
    GeomAbs_Plane: "plane", GeomAbs_Cylinder: "cylinder", GeomAbs_Cone: "cone", GeomAbs_Sphere: "sphere",
    GeomAbs_Torus: "torus", GeomAbs_BSplineSurface: "bspline", GeomAbs_BezierSurface: "bezier",
    GeomAbs_SurfaceOfRevolution: "revolution", GeomAbs_SurfaceOfExtrusion: "extrusion",
    GeomAbs_OffsetSurface: "offset",
}
_CURVE_NAMES = {
    GeomAbs_Line: "line", GeomAbs_Circle: "circle", GeomAbs_Ellipse: "ellipse", GeomAbs_Hyperbola: "hyperbola",
    GeomAbs_Parabola: "parabola", GeomAbs_BezierCurve: "bezier", GeomAbs_BSplineCurve: "bspline",
    GeomAbs_OffsetCurve: "offset",
}
# Where along an edge its dihedral angle is sampled (fraction of the parameter range). Not at the very ends:
# there the edge meets other edges and a face normal can be undefined.
_EDGE_SAMPLES = (0.1, 0.5, 0.9)

# Along a sight line, crossings closer together than this (mm) are one crossing.
_SIGHT_EPS = 1e-6

_SURFACE_NAMES = {
    GeomAbs_Plane: "plane",
    GeomAbs_Cylinder: "cylinder",
    GeomAbs_Cone: "cone",
    GeomAbs_Sphere: "sphere",
    GeomAbs_Torus: "torus",
}


@dataclass
class FaceInfo:
    face_id: int
    surface_type: str                       # plane | cylinder | cone | sphere | torus | other
    material_side: str = MaterialSide.NA.value
    area: float = 0.0
    edge_ids: list[int] = field(default_factory=list)
    # The edges of the face's outer boundary. The rest bound openings inside it (a hole through a floor, an
    # island standing on it), which never make the face open at a side.
    outer_edge_ids: list[int] = field(default_factory=list)
    point: list[float] | None = None        # a point on the surface (mid-uv)
    normal: list[float] | None = None        # solid-outward unit normal at that point
    # axisymmetric geometry (cylinder/cone/torus)
    axis_loc: list[float] | None = None
    axis_dir: list[float] | None = None
    radius: float | None = None              # cylinder radius / cone ref radius / sphere radius / torus minor
    height: float | None = None              # axial extent of the face (cylinder/cone)
    sweep: float | None = None               # angular (U) extent in radians — full bore ≈ 2π, a corner
                                             # fillet ≈ π/2; lets recognizers tell a hole from a corner round
    half_angle: float | None = None          # cone semi-angle (rad)
    major_radius: float | None = None        # torus major radius
    # World-space centres of the face's two axial ends (on the axis), for CAM entry/depth (cylinder/cone).
    axis_start: list[float] | None = None
    axis_end: list[float] | None = None
    # World-space axis-aligned bounding box of the face (for prismatic footprint/depth extraction).
    bbox_min: list[float] | None = None
    bbox_max: list[float] | None = None
    # Edges of this face by dihedral kind (populated by build_topology after edge classification).
    concave_edge_ids: list[int] = field(default_factory=list)
    convex_edge_ids: list[int] = field(default_factory=list)
    # True when the file wrote this face as a B-spline or swept surface and `surface_type` and the sizes
    # above come from the analytic surface found under it (services/canonical.py).
    canonicalized: bool = False
    # The surface type as written in the file (plane … torus, bspline, bezier, revolution, extrusion, offset).
    written_as: str = "other"
    # "forward" or "reversed": whether the face's normal is the surface's own (D1u × D1v) or its opposite.
    orientation: str = "forward"
    # Centre of area (the centroid of the face as a thin shell).
    centroid: list[float] | None = None
    # Parameter domain of the trimmed face: [umin, umax, vmin, vmax].
    uv_bounds: list[float] | None = None
    # Principal curvatures at the mid-uv point, 1/mm, signed against the solid-outward normal: positive where
    # the surface bulges outwards (a shaft, a ball), negative where it is hollow (a bore, a seat), 0 on a plane.
    curvature: dict | None = None
    # The spline's own description when the file wrote a B-spline or Bézier surface: degrees, pole counts,
    # rational or not, distinct knots and their multiplicities per direction.
    spline: dict | None = None


@dataclass
class EdgeInfo:
    """One topological edge: its curve, its length, its vertices and the faces it joins."""

    edge_id: int
    curve_type: str = "other"               # line | circle | ellipse | bspline | bezier | … | other
    params: dict = field(default_factory=dict)  # line: point, direction; circle: centre, axis, radius; …
    length: float = 0.0
    vertex_ids: list[int] = field(default_factory=list)  # [start, end]; the same id twice for a closed edge
    closed: bool = False                    # start and end vertex coincide (a full circle)
    degenerated: bool = False               # collapsed to a point (a sphere's pole, a cone's apex)
    seam: bool = False                      # the seam of a periodic surface: one face on both sides
    face_ids: list[int] = field(default_factory=list)
    midpoint: list[float] | None = None
    # convex | concave | tangent at the middle of the edge, as in Topology.edge_convexity; for an edge that is
    # not shared by exactly two faces: seam | open (one face: an open shell) | non_manifold (three or more).
    convexity: str = "unknown"
    # The material's interior angle between the two faces, in degrees: under 180 convex (90 on a block's
    # corner), over 180 concave (270 at a pocket floor), 180 smooth. build_topology fills the midpoint only;
    # sample_dihedrals adds 10 % and 90 % along the edge.
    dihedral_deg: list[float | None] = field(default_factory=list)
    # Convexity changes along the edge (a fillet that runs out, a variable blend).
    varies: bool = False


@dataclass
class VertexInfo:
    vertex_id: int
    point: list[float]
    edge_ids: list[int] = field(default_factory=list)


@dataclass
class Topology:
    faces: dict[int, FaceInfo]
    adjacency: dict[int, set[int]]           # face_id -> neighbouring face_ids (share an edge)
    edge_faces: dict[int, list[int]]         # edge_id -> face_ids on that edge
    # Dihedral classification of each 2-face edge: "convex" | "concave" | "tangent" | "unknown".
    # Concave edges bound pockets/slots/steps/blind-hole floors; convex edges bound bosses/outer corners;
    # tangent edges are smooth blends (a fillet meeting its wall). This is the primitive the prismatic
    # recognizers (pocket/slot/step/boss) read — see PLAN.md §B1/§B2.
    edge_convexity: dict[int, str] = field(default_factory=dict)
    # The full edge and vertex records: the face adjacency graph's edges with their attributes.
    edges: dict[int, EdgeInfo] = field(default_factory=dict)
    vertices: dict[int, VertexInfo] = field(default_factory=dict)
    concave_edges: set[int] = field(default_factory=set)
    convex_edges: set[int] = field(default_factory=set)
    # The solid itself, for the few questions topology cannot answer (line_of_sight).
    shape: object | None = None
    # One point-in-solid classifier and one ray caster for the whole analysis (line_of_sight). Building
    # either indexes every face, so they are made once, on first use.
    _classifier: object | None = field(default=None, repr=False, compare=False)

    _ray_caster: object | None = field(default=None, repr=False, compare=False)

    def classifier(self) -> BRepClass3d_SolidClassifier | None:
        if self._classifier is None and self.shape is not None:
            self._classifier = BRepClass3d_SolidClassifier(self.shape)
        return self._classifier

    def ray_caster(self) -> IntCurvesFace_ShapeIntersector | None:
        if self._ray_caster is None and self.shape is not None:
            self._ray_caster = IntCurvesFace_ShapeIntersector()
            self._ray_caster.Load(self.shape, 1e-7)
        return self._ray_caster

    def neighbors(self, face_id: int) -> set[int]:
        return self.adjacency.get(face_id, set())

    def convexity(self, edge_id: int) -> str:
        return self.edge_convexity.get(edge_id, "unknown")


def _face_area(face: TopoDS_Face) -> tuple[float, list[float]]:
    """(area, centre of area)."""
    props = GProp_GProps()
    BRepGProp.SurfaceProperties_s(face, props)
    c = props.CentreOfMass()
    return props.Mass(), [c.X(), c.Y(), c.Z()]


def _curvature(face: TopoDS_Face, surf: BRepAdaptor_Surface, u: float, v: float) -> dict | None:
    """Principal curvatures at (u, v), signed against the solid-outward normal (see FaceInfo.curvature)."""
    props = BRepLProp_SLProps(surf, u, v, 2, 1e-7)
    if not props.IsCurvatureDefined():
        return None
    # OCCT signs curvature against the surface's own normal, positive where the surface bends towards it.
    # Bending towards the outward normal is a hollow, so flip: positive = bulging outwards.
    s = 1.0 if face.Orientation() == TopAbs_REVERSED else -1.0
    k1, k2 = s * props.MinCurvature(), s * props.MaxCurvature()
    k_min, k_max = min(k1, k2), max(k1, k2)
    return {"min": k_min, "max": k_max, "mean": (k_min + k_max) / 2.0, "gaussian": k_min * k_max}


def _spline_info(surf: BRepAdaptor_Surface, stype) -> dict | None:
    try:
        if stype == GeomAbs_BSplineSurface:
            s = surf.BSpline()
            ku, kv = s.UKnots(), s.VKnots()
            mu, mv = s.UMultiplicities(), s.VMultiplicities()
            return {"kind": "bspline", "degree": [s.UDegree(), s.VDegree()], "poles": [s.NbUPoles(), s.NbVPoles()],
                    "rational": bool(s.IsURational() or s.IsVRational()),
                    "u_knots": [ku.Value(i) for i in range(ku.Lower(), ku.Upper() + 1)],
                    "u_multiplicities": [mu.Value(i) for i in range(mu.Lower(), mu.Upper() + 1)],
                    "v_knots": [kv.Value(i) for i in range(kv.Lower(), kv.Upper() + 1)],
                    "v_multiplicities": [mv.Value(i) for i in range(mv.Lower(), mv.Upper() + 1)],
                    "periodic": [bool(s.IsUPeriodic()), bool(s.IsVPeriodic())]}
        if stype == GeomAbs_BezierSurface:
            s = surf.Bezier()
            return {"kind": "bezier", "degree": [s.UDegree(), s.VDegree()], "poles": [s.NbUPoles(), s.NbVPoles()],
                    "rational": bool(s.IsURational() or s.IsVRational())}
    except Exception:  # noqa: BLE001 - descriptive only
        return None
    return None


def _face_edge_ids(face: TopoDS_Face, edge_id_of: dict) -> list[int]:
    ids: list[int] = []
    seen = set()
    exp = TopExp_Explorer(face, TopAbs_EDGE)
    while exp.More():
        edge = TopoDS.Edge_s(exp.Current())
        key = edge.TShape()
        if key not in seen:
            seen.add(key)
            eid = edge_id_of.get(key)
            if eid is not None:
                ids.append(eid)
        exp.Next()
    return ids


def _axial_ends(surf, axis_loc, axis_dir):
    """World-space centres of the face's two V-parameter ends, projected onto the axis line."""
    u = (surf.FirstUParameter() + surf.LastUParameter()) / 2.0

    def center_at(v):
        p = surf.Value(u, v)
        rel = [p.X() - axis_loc[0], p.Y() - axis_loc[1], p.Z() - axis_loc[2]]
        t = sum(rel[i] * axis_dir[i] for i in range(3))
        return [axis_loc[i] + t * axis_dir[i] for i in range(3)]

    return center_at(surf.FirstVParameter()), center_at(surf.LastVParameter())


def _build_face_info(face_id: int, face: TopoDS_Face, edge_id_of: dict) -> FaceInfo:
    surf = BRepAdaptor_Surface(face)
    stype = surf.GetType()
    info = FaceInfo(face_id=face_id, surface_type=_SURFACE_NAMES.get(stype, "other"),
                    written_as=_WRITTEN_AS.get(stype, "other"),
                    orientation="reversed" if face.Orientation() == TopAbs_REVERSED else "forward")
    try:
        info.area, info.centroid = _face_area(face)
    except Exception:  # noqa: BLE001
        info.area = 0.0
    try:
        umin, umax, vmin, vmax = BRepTools.UVBounds_s(face)
        info.uv_bounds = [umin, umax, vmin, vmax]
    except Exception:  # noqa: BLE001
        pass
    info.spline = _spline_info(surf, stype)
    try:
        box = Bnd_Box()
        BRepBndLib.Add_s(face, box, False)
        xmin, ymin, zmin, xmax, ymax, zmax = box.Get()
        info.bbox_min, info.bbox_max = [xmin, ymin, zmin], [xmax, ymax, zmax]
    except Exception:  # noqa: BLE001
        pass
    info.edge_ids = _face_edge_ids(face, edge_id_of)
    try:
        outer = BRepTools.OuterWire_s(face)
        info.outer_edge_ids = _face_edge_ids(outer, edge_id_of) if not outer.IsNull() else list(info.edge_ids)
    except Exception:  # noqa: BLE001
        info.outer_edge_ids = list(info.edge_ids)

    try:
        u, v = _mid_uv(surf)
        info.point = _pt(surf, u, v)
        info.normal = _outward_normal(face, surf, u, v)
        info.curvature = _curvature(face, surf, u, v)
    except Exception:  # noqa: BLE001
        pass

    try:
        if stype == GeomAbs_Cylinder:
            cyl = surf.Cylinder()
            loc, dir_ = _axis(cyl.Axis())
            info.axis_loc, info.axis_dir, info.radius = loc, dir_, cyl.Radius()
            info.height = abs(surf.LastVParameter() - surf.FirstVParameter())
            info.sweep = abs(surf.LastUParameter() - surf.FirstUParameter())
            info.axis_start, info.axis_end = _axial_ends(surf, loc, dir_)
            info.material_side = (
                MaterialSide.INTERNAL.value if _is_internal_radial(info.point, loc, dir_, info.normal) else MaterialSide.EXTERNAL.value
            )
        elif stype == GeomAbs_Cone:
            cone = surf.Cone()
            loc, dir_ = _axis(cone.Axis())
            info.axis_loc, info.axis_dir = loc, dir_
            info.radius = cone.RefRadius()
            info.half_angle = cone.SemiAngle()
            info.height = abs(surf.LastVParameter() - surf.FirstVParameter())
            info.axis_start, info.axis_end = _axial_ends(surf, loc, dir_)
            info.material_side = (
                MaterialSide.INTERNAL.value if _is_internal_radial(info.point, loc, dir_, info.normal) else MaterialSide.EXTERNAL.value
            )
        elif stype == GeomAbs_Sphere:
            sph = surf.Sphere()
            c = sph.Position().Location()
            center = [c.X(), c.Y(), c.Z()]
            info.axis_loc, info.radius = center, sph.Radius()
            radial = _unit(_sub(info.point, center)) if info.point else None
            internal = info.normal is not None and radial is not None and sum(info.normal[i] * radial[i] for i in range(3)) < 0
            info.material_side = MaterialSide.INTERNAL.value if internal else MaterialSide.EXTERNAL.value
        elif stype == GeomAbs_Torus:
            tor = surf.Torus()
            loc, dir_ = _axis(tor.Axis())
            info.axis_loc, info.axis_dir = loc, dir_
            info.radius, info.major_radius = tor.MinorRadius(), tor.MajorRadius()
    except Exception:  # noqa: BLE001 - never let one bad face break the whole build
        pass
    if info.surface_type == "other":
        _apply_canonical(info, face)
    return info


def _apply_canonical(info: FaceInfo, face: TopoDS_Face) -> None:
    """Give a face written as a B-spline or swept surface the type and sizes of the analytic surface it
    really is, so the recognizers see it like any other cylinder, cone, sphere, torus or plane."""
    c = canonical_face(face)
    if c is None:
        return
    info.surface_type, info.canonicalized = c.kind, True
    if c.kind == "plane":
        return
    info.axis_loc, info.axis_dir, info.radius = c.axis_loc, c.axis_dir, c.radius
    if c.kind in ("cylinder", "cone"):
        info.half_angle = c.half_angle
        info.height, info.sweep = c.height, c.sweep
        info.axis_start, info.axis_end = c.axis_start, c.axis_end
        internal = _is_internal_radial(info.point, c.axis_loc, c.axis_dir, info.normal)
        info.material_side = MaterialSide.INTERNAL.value if internal else MaterialSide.EXTERNAL.value
    elif c.kind == "sphere":
        radial = _unit(_sub(info.point, c.axis_loc)) if info.point else None
        internal = info.normal is not None and radial is not None and _dot(info.normal, radial) < 0
        info.material_side = MaterialSide.INTERNAL.value if internal else MaterialSide.EXTERNAL.value
    elif c.kind == "torus":
        info.major_radius = c.major_radius


def _cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def _edge_reversed_in_face(face: TopoDS_Face, edge_tshape) -> bool:
    """Is `edge` used REVERSED in `face`'s wire? A wire runs so the face's material is to the left of the
    directed edge (outer wire CCW, hole wires CW), so this is what orients 'into the material' correctly —
    even for an off-centre hole where the face centroid sits across the bore."""
    exp = TopExp_Explorer(face, TopAbs_EDGE)
    while exp.More():
        e = TopoDS.Edge_s(exp.Current())
        if e.TShape() == edge_tshape:
            return e.Orientation() == TopAbs_REVERSED
        exp.Next()
    return False


def _normal_and_inward(face: TopoDS_Face, edge: TopoDS_Edge, p_world: list[float], base_tangent: list[float]) -> tuple[list[float] | None, list[float] | None]:
    """At world point `p_world` on the shared edge, return `face`'s (solid-outward unit normal, inward
    surface direction). Inward = `cross(normal, tangent)` with the tangent taken in the edge's wire-order
    sense within this face (flipped when the edge is REVERSED there) — so it points into the face's material
    from local topology, not a centroid guess: a pure axial step on a cylinder wall, radially-outward on a
    hole rim, never across the bore."""
    surf_geom = BRep_Tool.Surface_s(face)
    sas = ShapeAnalysis_Surface(surf_geom)
    uv = sas.ValueOfUV(gp_Pnt(p_world[0], p_world[1], p_world[2]), 1e-6)
    u, v = uv.X(), uv.Y()
    adaptor = BRepAdaptor_Surface(face)
    normal = _outward_normal(face, adaptor, u, v)
    if normal is None:
        return None, None
    tangent = [-c for c in base_tangent] if _edge_reversed_in_face(face, edge.TShape()) else base_tangent
    inward = _unit(_cross(normal, tangent))
    return normal, inward


def _dihedral(edge: TopoDS_Edge, face_a: TopoDS_Face, face_b: TopoDS_Face, frac: float = 0.5,
              curve: BRepAdaptor_Curve | None = None) -> tuple[str, float | None]:
    """(convex | concave | tangent | unknown, interior angle of the material in degrees) where two faces meet
    at `frac` along `edge`.

    Orientation-free: sample a point P + edge tangent T on the edge, take each face's solid-outward normal
    and inward surface direction there. The edge is convex when each face's material bends *away* from the
    other's outward normal (dot < 0, a peak) and concave when it bends *back over* it (dot > 0, a valley);
    a near-parallel normal pair is a smooth (tangent) blend. Signs pinned by test_edge_convexity.py.
    The interior angle is 180° − θ on a convex edge and 180° + θ on a concave one, θ the angle between the
    outward normals: 90° on a block's corner, 270° where a pocket floor meets its wall, 180° when smooth."""
    curve = curve or BRepAdaptor_Curve(edge)
    t = curve.FirstParameter() + frac * (curve.LastParameter() - curve.FirstParameter())
    pnt, d1 = gp_Pnt(), gp_Vec()
    curve.D1(t, pnt, d1)
    p = [pnt.X(), pnt.Y(), pnt.Z()]
    tangent = _unit([d1.X(), d1.Y(), d1.Z()])
    if tangent is None:
        return "unknown", None

    n_a, in_a = _normal_and_inward(face_a, edge, p, tangent)
    n_b, in_b = _normal_and_inward(face_b, edge, p, tangent)
    if not (n_a and n_b and in_a and in_b):
        return "unknown", None
    cos_t = max(-1.0, min(1.0, _dot(n_a, n_b)))
    theta = math.degrees(math.acos(cos_t))
    if abs(cos_t) >= _TANGENT_COS:
        return "tangent", 180.0 if cos_t > 0 else None    # a knife edge (normals opposed) has no useful angle
    # s < 0 → each face's material bends away from the other (peak) → convex; s > 0 → valley → concave.
    s = _dot(n_a, in_b) + _dot(n_b, in_a)
    return ("convex", 180.0 - theta) if s < 0 else ("concave", 180.0 + theta)


def _classify_edge(edge: TopoDS_Edge, face_a: TopoDS_Face, face_b: TopoDS_Face) -> str:
    """Convex / concave / tangent at the middle of `edge` (see _dihedral)."""
    return _dihedral(edge, face_a, face_b, 0.5)[0]


def _edge_record(eid: int, edge: TopoDS_Edge, vertex_id_of: dict) -> EdgeInfo:
    """Curve type and parameters, length and end vertices of one edge (no face context)."""
    info = EdgeInfo(edge_id=eid, degenerated=bool(BRep_Tool.Degenerated_s(edge)))
    v1, v2 = TopExp.FirstVertex_s(edge, True), TopExp.LastVertex_s(edge, True)
    info.vertex_ids = [vertex_id_of[v.TShape()] for v in (v1, v2) if not v.IsNull() and v.TShape() in vertex_id_of]
    info.closed = len(info.vertex_ids) == 2 and info.vertex_ids[0] == info.vertex_ids[1]
    if info.degenerated:
        info.curve_type = "point"
        return info
    try:
        c = BRepAdaptor_Curve(edge)
        kind = c.GetType()
        info.curve_type = _CURVE_NAMES.get(kind, "other")
        info.length = GCPnts_AbscissaPoint.Length_s(c)
        m = c.Value((c.FirstParameter() + c.LastParameter()) / 2.0)
        info.midpoint = [m.X(), m.Y(), m.Z()]
        if kind == GeomAbs_Line:
            ln = c.Line()
            info.params = {"point": _pt3(ln.Location()), "direction": _dir3(ln.Direction())}
        elif kind == GeomAbs_Circle:
            ci = c.Circle()
            info.params = {"centre": _pt3(ci.Location()), "axis": _dir3(ci.Axis().Direction()), "radius": ci.Radius(),
                           "arc_deg": math.degrees(abs(c.LastParameter() - c.FirstParameter()))}
        elif kind == GeomAbs_Ellipse:
            el = c.Ellipse()
            info.params = {"centre": _pt3(el.Location()), "axis": _dir3(el.Axis().Direction()),
                           "major_radius": el.MajorRadius(), "minor_radius": el.MinorRadius()}
        elif kind == GeomAbs_BSplineCurve:
            b = c.BSpline()
            info.params = {"degree": b.Degree(), "poles": b.NbPoles(), "knots": b.NbKnots(), "rational": bool(b.IsRational())}
        elif kind == GeomAbs_BezierCurve:
            b = c.Bezier()
            info.params = {"degree": b.Degree(), "poles": b.NbPoles(), "rational": bool(b.IsRational())}
    except Exception:  # noqa: BLE001 - a curve OCCT cannot evaluate keeps its topology
        pass
    return info


def _pt3(p) -> list[float]:
    return [p.X(), p.Y(), p.Z()]


def _dir3(d) -> list[float]:
    return [d.X(), d.Y(), d.Z()]


def build_topology(shape: TopoDS_Shape) -> Topology:
    edges_by_id = {eid: edge for eid, edge in iter_edges(shape)}
    edge_id_of = {edge.TShape(): eid for eid, edge in edges_by_id.items()}
    faces_by_id = dict(iter_faces(shape))

    faces: dict[int, FaceInfo] = {}
    edge_faces: dict[int, list[int]] = {}
    for face_id, face in faces_by_id.items():
        info = _build_face_info(face_id, face, edge_id_of)
        faces[face_id] = info
        for eid in info.edge_ids:
            edge_faces.setdefault(eid, []).append(face_id)

    adjacency: dict[int, set[int]] = {fid: set() for fid in faces}
    for fids in edge_faces.values():
        for a in fids:
            for b in fids:
                if a != b:
                    adjacency[a].add(b)

    topo = Topology(faces=faces, adjacency=adjacency, edge_faces=edge_faces, shape=shape)
    vertex_id_of = {}
    for vid, vertex in iter_vertices(shape):
        vertex_id_of[vertex.TShape()] = vid
        topo.vertices[vid] = VertexInfo(vertex_id=vid, point=_pt3(BRep_Tool.Pnt_s(vertex)))
    for eid, edge in edges_by_id.items():
        rec = _edge_record(eid, edge, vertex_id_of)
        rec.face_ids = list(edge_faces.get(eid, []))
        topo.edges[eid] = rec
        for vid in dict.fromkeys(rec.vertex_ids):
            topo.vertices[vid].edge_ids.append(eid)
    _classify_edges(topo, edges_by_id, faces_by_id)
    return topo


def line_of_sight(topo: Topology, start, direction) -> bool | None:
    """Whether the straight line from `start` along `direction` leaves the part's bounding box without
    passing through material — i.e. a straight tool could come in along it. It checks the axis line only, not
    the tool's full diameter. None when the shape is not available.

    One ray through the solid gives every point where the line crosses a face. Between two crossings the
    line is either all inside material or all outside, so one point-in-solid test per stretch settles it.
    That is exact, where testing a point every millimetre could step over a thin wall, and it is a handful
    of tests instead of one per millimetre of part (NIST CTC-04, 780 mm long: 37 s down to well under 1 s)."""
    if topo.shape is None:
        return None
    boxes = [f for f in topo.faces.values() if f.bbox_min and f.bbox_max]
    if not boxes:
        return None
    lo = [min(f.bbox_min[i] for f in boxes) for i in range(3)]
    hi = [max(f.bbox_max[i] for f in boxes) for i in range(3)]
    n = math.sqrt(sum(c * c for c in direction)) or 1.0
    d = [c / n for c in direction]
    t_exit = min(((hi[i] if d[i] > 0 else lo[i]) - start[i]) / d[i] for i in range(3) if abs(d[i]) > 1e-9)
    if t_exit <= _SIGHT_EPS:
        return True
    caster = topo.ray_caster()
    caster.Perform(gp_Lin(gp_Pnt(*start), gp_Dir(*d)), 0.0, t_exit)
    crossings = sorted(caster.WParameter(i + 1) for i in range(caster.NbPnt()))
    cuts = [0.0] + [t for t in crossings if _SIGHT_EPS < t < t_exit - _SIGHT_EPS] + [t_exit]
    classifier = topo.classifier()
    for a, b in zip(cuts, cuts[1:]):
        if b - a <= _SIGHT_EPS:                     # the same crossing reported by two faces at a shared edge
            continue
        mid = (a + b) / 2.0
        classifier.Perform(gp_Pnt(*(start[i] + mid * d[i] for i in range(3))), 1e-4)
        if classifier.State() == TopAbs_IN:
            return False
    return True


def _classify_edges(topo: Topology, edges_by_id: dict[int, TopoDS_Edge], faces_by_id: dict[int, TopoDS_Face]) -> None:
    """Populate topo.edge_convexity / concave_edges / convex_edges and the per-face edge lists. A bad edge
    is recorded as 'unknown' and never breaks the build (matches the per-face try/except robustness)."""
    for eid, fids in topo.edge_faces.items():
        rec = topo.edges.get(eid)
        if len(fids) != 2 or eid not in edges_by_id:
            topo.edge_convexity[eid] = "unknown"
            if rec is not None and len(fids) == 1:
                face = faces_by_id[fids[0]]
                rec.seam = bool(BRep_Tool.IsClosed_s(edges_by_id[eid], face))
                rec.convexity = "seam" if rec.seam else ("unknown" if rec.degenerated else "open")
            elif rec is not None and len(fids) > 2:
                rec.convexity = "non_manifold"
            continue
        fa, fb = fids
        edge = edges_by_id[eid]
        try:
            kind, angle = _dihedral(edge, faces_by_id[fa], faces_by_id[fb], 0.5)
        except Exception:  # noqa: BLE001 - one bad edge must not sink the whole analysis
            kind, angle = "unknown", None
        topo.edge_convexity[eid] = kind
        if rec is not None:
            rec.convexity = kind
            # the midpoint only: recognition needs nothing more; sample_dihedrals adds 10 % and 90 % on demand
            rec.dihedral_deg = [None if angle is None else round(angle, 3)]
        if kind == "concave":
            topo.concave_edges.add(eid)
            topo.faces[fa].concave_edge_ids.append(eid)
            topo.faces[fb].concave_edge_ids.append(eid)
        elif kind == "convex":
            topo.convex_edges.add(eid)
            topo.faces[fa].convex_edge_ids.append(eid)
            topo.faces[fb].convex_edge_ids.append(eid)


# --- small geometry helpers shared by recognizers ---------------------------------------------

def collinear_axes(a: FaceInfo, b: FaceInfo, ang_tol: float = 1e-3, dist_tol: float = 1e-4) -> bool:
    """True when two axisymmetric faces share the same axis line (parallel dirs + coincident lines)."""
    if not (a.axis_dir and b.axis_dir and a.axis_loc and b.axis_loc):
        return False
    d = abs(sum(a.axis_dir[i] * b.axis_dir[i] for i in range(3)))
    if d < math.cos(ang_tol):  # directions (anti)parallel?
        return False
    # distance from b.axis_loc to a's axis line
    rel = _sub(b.axis_loc, a.axis_loc)
    proj = sum(rel[i] * a.axis_dir[i] for i in range(3))
    perp = [rel[i] - proj * a.axis_dir[i] for i in range(3)]
    return math.sqrt(sum(c * c for c in perp)) <= max(dist_tol, 1e-4 * (abs(a.radius or 1.0) + 1.0))


def _r(v, nd: int = 6):
    if v is None:
        return None
    if isinstance(v, float):
        return round(v, nd) + 0.0 if math.isfinite(v) else None
    if isinstance(v, (list, tuple)):
        return [_r(x, nd) for x in v]
    if isinstance(v, dict):
        return {k: _r(x, nd) for k, x in v.items()}
    return v


def sample_dihedrals(topo: Topology) -> None:
    """Fill every two-face edge's dihedral angle at 10 %, 50 % and 90 % along it, and `varies`. Kept out of
    build_topology: the recognizers read only the midpoint, and the extra samples cost 45 % of the build on a
    600-face part. GET /brep calls it once per model."""
    if topo.shape is None:
        return
    edges_by_id = dict(iter_edges(topo.shape))
    faces_by_id = dict(iter_faces(topo.shape))
    for eid, rec in topo.edges.items():
        fids = topo.edge_faces.get(eid, [])
        if len(fids) != 2 or eid not in edges_by_id or len(rec.dihedral_deg) == len(_EDGE_SAMPLES):
            continue
        edge = edges_by_id[eid]
        try:
            curve = BRepAdaptor_Curve(edge)
            samples = [_dihedral(edge, faces_by_id[fids[0]], faces_by_id[fids[1]], f, curve) for f in _EDGE_SAMPLES]
        except Exception:  # noqa: BLE001
            continue
        rec.dihedral_deg = [None if a is None else round(a, 3) for _, a in samples]
        rec.varies = len({k for k, _ in samples if k != "unknown"}) > 1


def describe_topology(topo: Topology) -> dict:
    """The B-rep as JSON: every face (node of the face adjacency graph), edge (graph edge, with its curve and
    dihedral angles) and vertex. Ids are the viewer's (tessellator order)."""
    faces = []
    for f in topo.faces.values():
        faces.append(_r({
            "face_id": f.face_id, "surface_type": f.surface_type, "written_as": f.written_as,
            "canonicalized": f.canonicalized, "orientation": f.orientation, "material_side": f.material_side,
            "area": f.area, "centroid": f.centroid, "point": f.point, "normal": f.normal,
            "axis_loc": f.axis_loc, "axis_dir": f.axis_dir, "radius": f.radius, "major_radius": f.major_radius,
            "half_angle_deg": math.degrees(f.half_angle) if f.half_angle is not None else None,
            "height": f.height, "sweep_deg": math.degrees(f.sweep) if f.sweep is not None else None,
            "uv_bounds": f.uv_bounds, "curvature": f.curvature, "spline": f.spline,
            "bbox": {"min": f.bbox_min, "max": f.bbox_max} if f.bbox_min else None,
            "edge_ids": f.edge_ids, "neighbours": sorted(topo.adjacency.get(f.face_id, ())),
        }))
    edges = [_r({"edge_id": e.edge_id, "curve_type": e.curve_type, "params": e.params, "length": e.length,
                 "vertex_ids": e.vertex_ids, "closed": e.closed, "degenerated": e.degenerated, "seam": e.seam,
                 "face_ids": e.face_ids, "midpoint": e.midpoint, "convexity": e.convexity,
                 "dihedral_deg": e.dihedral_deg, "varies": e.varies}) for e in topo.edges.values()]
    vertices = [_r({"vertex_id": v.vertex_id, "point": v.point, "edge_ids": v.edge_ids}) for v in topo.vertices.values()]
    return {"faces": faces, "edges": edges, "vertices": vertices}


def face_signature(f: FaceInfo) -> dict:
    """What identifies a face independently of its place in the file: its surface and where it is. Used to
    find the same face again after the file is rewritten (feature_recognition/identity.py)."""
    return {"type": f.surface_type, "area": f.area, "centroid": f.centroid, "radius": f.radius,
            "axis": f.axis_dir, "normal": f.normal if f.surface_type == "plane" else None}
