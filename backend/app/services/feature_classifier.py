"""Classify the geometric feature a characteristic sits on (hole, shaft, fillet, ...).

AP242 semantic PMI links a tolerance to a B-rep face but does not say what *kind* of feature that
face is - that has to be inferred from the geometry. This module does the cheap, deterministic version:
it looks at the surface type of the toleranced face(s) and, crucially, whether the solid's material is
*outside* the surface (internal feature - a hole/bore) or *inside* it (external feature - a shaft/boss).

That internal/external ("material side") distinction is what drives rework logic: an oversize condition
is reworkable on an external feature (turn it down) and a scrap/MRB case on an internal one, and vice
versa - because you can only ever *remove* material, never add it. See default_reaction_plan().

This is intentionally NOT a full machining-feature-recognition engine (no face-adjacency graph, no
slot/pocket/groove detection). It classifies the single toleranced face, which covers the common cases.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from enum import Enum

from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepLProp import BRepLProp_SLProps
from OCP.GeomAbs import (
    GeomAbs_Cone,
    GeomAbs_Cylinder,
    GeomAbs_Plane,
    GeomAbs_Sphere,
    GeomAbs_Torus,
)
from OCP.TopAbs import TopAbs_REVERSED
from OCP.TopoDS import TopoDS_Face, TopoDS_Shape

from app.services.canonical import canonical_face
from app.services.tessellator import iter_faces


class FeatureType(str, Enum):
    HOLE = "hole"                # internal cylinder
    SHAFT = "shaft"             # external cylinder (pin / boss / journal)
    COUNTERSINK = "countersink"  # internal cone
    CHAMFER = "chamfer"         # external cone (edge break / taper)
    SPHERICAL_SEAT = "spherical_seat"  # internal sphere
    SPHERICAL_BOSS = "spherical_boss"  # external sphere
    FILLET = "fillet"           # concave torus (internal blend)
    ROUND = "round"             # convex torus (external blend)
    PLANAR_FACE = "planar_face"
    UNKNOWN = "unknown"


class MaterialSide(str, Enum):
    INTERNAL = "internal"   # material is outside the surface (a void: hole/bore/pocket)
    EXTERNAL = "external"   # material is inside the surface (a solid: shaft/boss)
    NA = "n/a"


@dataclass
class FeatureInfo:
    feature_type: FeatureType
    material_side: MaterialSide
    surface_type: str          # raw surface kind: "cylinder", "cone", ...
    radius: float | None = None  # nominal radius where meaningful (cylinder/sphere/torus tube)
    face_id: int | None = None   # which face this classification came from


# --- vector helpers (plain lists; mirrors balloon_placer's lightweight style) -----------------

def _sub(a, b): return [a[i] - b[i] for i in range(3)]
def _dot(a, b): return sum(a[i] * b[i] for i in range(3))
def _scale(a, s): return [x * s for x in a]


def _unit(v):
    n = math.sqrt(_dot(v, v))
    return [x / n for x in v] if n > 1e-12 else None


def _outward_normal(face: TopoDS_Face, surf: BRepAdaptor_Surface, u: float, v: float) -> list[float] | None:
    """Solid-outward unit normal at (u, v): geometric normal flipped when the face is REVERSED."""
    props = BRepLProp_SLProps(surf, u, v, 1, 1e-7)
    if not props.IsNormalDefined():
        return None
    d = props.Normal()
    n = [d.X(), d.Y(), d.Z()]
    if face.Orientation() == TopAbs_REVERSED:
        n = _scale(n, -1.0)
    return _unit(n)


def _mid_uv(surf: BRepAdaptor_Surface) -> tuple[float, float]:
    return (
        (surf.FirstUParameter() + surf.LastUParameter()) / 2.0,
        (surf.FirstVParameter() + surf.LastVParameter()) / 2.0,
    )


def _pt(surf: BRepAdaptor_Surface, u: float, v: float) -> list[float]:
    p = surf.Value(u, v)
    return [p.X(), p.Y(), p.Z()]


def _axis(ax) -> tuple[list[float], list[float]]:
    """(location, unit direction) of a gp_Ax1/gp_Ax3-style axis."""
    loc, dr = ax.Location(), ax.Direction()
    return [loc.X(), loc.Y(), loc.Z()], [dr.X(), dr.Y(), dr.Z()]


def _radial_out(point: list[float], axis_loc: list[float], axis_dir: list[float]) -> list[float] | None:
    """Unit vector from the axis to `point`, perpendicular to the axis (points away from the axis)."""
    rel = _sub(point, axis_loc)
    radial = _sub(rel, _scale(axis_dir, _dot(rel, axis_dir)))
    return _unit(radial)


# --- per-surface classification ----------------------------------------------------------------

def _classify_face(fid: int, face: TopoDS_Face) -> FeatureInfo:
    surf = BRepAdaptor_Surface(face)
    stype = surf.GetType()
    u, v = _mid_uv(surf)
    p = _pt(surf, u, v)
    normal = _outward_normal(face, surf, u, v)

    if stype == GeomAbs_Plane:
        return FeatureInfo(FeatureType.PLANAR_FACE, MaterialSide.NA, "plane", face_id=fid)

    if stype == GeomAbs_Cylinder:
        cyl = surf.Cylinder()
        loc, dir_ = _axis(cyl.Axis())
        internal = _is_internal_radial(p, loc, dir_, normal)
        ft = FeatureType.HOLE if internal else FeatureType.SHAFT
        side = MaterialSide.INTERNAL if internal else MaterialSide.EXTERNAL
        return FeatureInfo(ft, side, "cylinder", radius=cyl.Radius(), face_id=fid)

    if stype == GeomAbs_Cone:
        cone = surf.Cone()
        loc, dir_ = _axis(cone.Axis())
        internal = _is_internal_radial(p, loc, dir_, normal)
        ft = FeatureType.COUNTERSINK if internal else FeatureType.CHAMFER
        side = MaterialSide.INTERNAL if internal else MaterialSide.EXTERNAL
        return FeatureInfo(ft, side, "cone", face_id=fid)

    if stype == GeomAbs_Sphere:
        sph = surf.Sphere()
        c = sph.Position().Location()
        center = [c.X(), c.Y(), c.Z()]
        radial = _unit(_sub(p, center))  # points away from the sphere centre
        internal = normal is not None and radial is not None and _dot(normal, radial) < 0
        ft = FeatureType.SPHERICAL_SEAT if internal else FeatureType.SPHERICAL_BOSS
        side = MaterialSide.INTERNAL if internal else MaterialSide.EXTERNAL
        return FeatureInfo(ft, side, "sphere", radius=sph.Radius(), face_id=fid)

    if stype == GeomAbs_Torus:
        tor = surf.Torus()
        loc, dir_ = _axis(tor.Axis())
        radial = _radial_out(p, loc, dir_)
        if radial is None or normal is None:
            return FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "torus", face_id=fid)
        # Tube centre = the major-radius circle point nearest P, then compare P's normal to the
        # direction from that tube centre. Convex (round) -> normal points away from tube centre.
        tube_center = [loc[i] + radial[i] * tor.MajorRadius() for i in range(3)]
        to_surface = _unit(_sub(p, tube_center))
        convex = to_surface is not None and _dot(normal, to_surface) > 0
        ft = FeatureType.ROUND if convex else FeatureType.FILLET
        side = MaterialSide.EXTERNAL if convex else MaterialSide.INTERNAL
        return FeatureInfo(ft, side, "torus", radius=tor.MinorRadius(), face_id=fid)

    # A B-spline or swept surface can still be one of the above (services/canonical.py).
    c = canonical_face(face)
    if c is not None:
        return _classify_canonical(fid, c, p, normal)
    return FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "other", face_id=fid)


def _classify_canonical(fid: int, c, p: list[float], normal: list[float] | None) -> FeatureInfo:
    """The same calls as above, for a face whose analytic surface had to be found first."""
    if c.kind == "plane":
        return FeatureInfo(FeatureType.PLANAR_FACE, MaterialSide.NA, "plane", face_id=fid)
    if c.kind == "sphere":
        radial = _unit(_sub(p, c.axis_loc))
        internal = normal is not None and radial is not None and _dot(normal, radial) < 0
    elif c.kind == "torus":
        radial = _radial_out(p, c.axis_loc, c.axis_dir)
        if radial is None or normal is None:
            return FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "torus", face_id=fid)
        to_surface = _unit(_sub(p, [c.axis_loc[i] + radial[i] * c.major_radius for i in range(3)]))
        internal = not (to_surface is not None and _dot(normal, to_surface) > 0)
    else:
        internal = _is_internal_radial(p, c.axis_loc, c.axis_dir, normal)
    types = {"cylinder": (FeatureType.SHAFT, FeatureType.HOLE), "cone": (FeatureType.CHAMFER, FeatureType.COUNTERSINK),
             "sphere": (FeatureType.SPHERICAL_BOSS, FeatureType.SPHERICAL_SEAT), "torus": (FeatureType.ROUND, FeatureType.FILLET)}
    side = MaterialSide.INTERNAL if internal else MaterialSide.EXTERNAL
    return FeatureInfo(types[c.kind][internal], side, c.kind, radius=None if c.kind == "cone" else c.radius, face_id=fid)


def _is_internal_radial(point, axis_loc, axis_dir, normal) -> bool:
    """For an axisymmetric surface: material is outside (internal feature) when the solid-outward
    normal points back toward the axis (negative dot with the radial-outward direction)."""
    radial = _radial_out(point, axis_loc, axis_dir)
    if radial is None or normal is None:
        return False
    return _dot(normal, radial) < 0


# --- public API --------------------------------------------------------------------------------

# Priority when a characteristic spans several faces: the axisymmetric machining feature wins over a
# plain planar face, and anything recognised wins over UNKNOWN.
_PRIORITY = {
    FeatureType.HOLE: 3, FeatureType.SHAFT: 3, FeatureType.COUNTERSINK: 3,
    FeatureType.CHAMFER: 3, FeatureType.SPHERICAL_SEAT: 3, FeatureType.SPHERICAL_BOSS: 3,
    FeatureType.FILLET: 2, FeatureType.ROUND: 2,
    FeatureType.PLANAR_FACE: 1, FeatureType.UNKNOWN: 0,
}


def classify_faces(shape: TopoDS_Shape, face_ids: list[int]) -> FeatureInfo:
    """Classify the feature described by `face_ids` (as produced by pmi extraction / iter_faces)."""
    if not face_ids:
        return FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "none")
    wanted = set(face_ids)
    best: FeatureInfo | None = None
    for fid, face in iter_faces(shape):
        if fid not in wanted:
            continue
        try:
            info = _classify_face(fid, face)
        except Exception:  # noqa: BLE001 - never let classification break extraction
            info = FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "error", face_id=fid)
        if best is None or _PRIORITY[info.feature_type] > _PRIORITY[best.feature_type]:
            best = info
    return best or FeatureInfo(FeatureType.UNKNOWN, MaterialSide.NA, "none")


def default_reaction_plan(info: FeatureInfo) -> dict:
    """Default disposition per out-of-spec direction, derived from the classified material side.

    Delegates to control_plan (the pure, CAD-free source of truth) so extraction and the report/export
    path agree on the defaults. Meant to be overridden per characteristic - see control_plan.
    """
    from app.services import control_plan

    return control_plan.default_reaction_plan(info.material_side.value)
