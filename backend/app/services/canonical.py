"""The analytic form of a face whose surface the exporter did not write as one.

CAD systems often write a plane, cylinder, cone, sphere or torus as a B-spline, or as a surface of revolution
or extrusion. The geometry is the same, but OCCT reports the type it was given, and every recognizer here
reads the type. So such a face was "other": no radius, no axis, in no feature (NIST D2MI-904 has 20 of them,
all exact spheres, tori and cones).

`canonical_face` finds the analytic surface under such a face, checks it against the face itself, and
returns it with the face's extent measured on it. It never changes the shape: the XCAF document's PMI points
at the original faces, so they must stay as they are.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from OCP.BRep import BRep_Tool
from OCP.BRepAdaptor import BRepAdaptor_Curve, BRepAdaptor_Surface
from OCP.Geom import (Geom_ConicalSurface, Geom_CylindricalSurface, Geom_Plane, Geom_SphericalSurface,
                      Geom_ToroidalSurface)
from OCP.GeomAbs import GeomAbs_Cone, GeomAbs_Cylinder, GeomAbs_Plane, GeomAbs_Sphere, GeomAbs_Torus
from OCP.GeomConvert import GeomConvert_SurfToAnaSurf
from OCP.TopAbs import TopAbs_EDGE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS, TopoDS_Face

# The largest distance, in mm, between the face and the analytic surface that still counts as the same
# geometry. One micron: above any exporter's fitting error, far below any tolerance a shop can hold.
TOLERANCE_MM = 1e-3

_NATIVE = (GeomAbs_Plane, GeomAbs_Cylinder, GeomAbs_Cone, GeomAbs_Sphere, GeomAbs_Torus)
_EDGE_SAMPLES = 33     # per boundary edge: a full circle then leaves gaps of 2π/32
_GRID = 5              # per direction, across the face's parameter range


@dataclass
class CanonicalFace:
    kind: str                                   # plane | cylinder | cone | sphere | torus
    gap: float                                  # largest measured distance from the face to this surface, mm
    axis_loc: list[float] | None = None         # a point on the axis; the centre for a sphere
    axis_dir: list[float] | None = None
    radius: float | None = None                 # cylinder / sphere / torus minor; a cone's reference radius
    half_angle: float | None = None             # cone
    major_radius: float | None = None           # torus
    # The face's extent on the surface, for a cylinder or cone (what the U/V range gives a native face).
    height: float | None = None                 # along the surface: axial for a cylinder, slant for a cone
    sweep: float | None = None                  # angle covered around the axis, radians
    axis_start: list[float] | None = None
    axis_end: list[float] | None = None


def _xyz(p) -> list[float]:
    return [p.X(), p.Y(), p.Z()]


def _axial_radial(p, loc, d) -> tuple[float, float]:
    rel = [p[i] - loc[i] for i in range(3)]
    t = sum(rel[i] * d[i] for i in range(3))
    perp = [rel[i] - t * d[i] for i in range(3)]
    return t, math.sqrt(sum(c * c for c in perp))


def _distance(c: CanonicalFace, plane_normal, p) -> float:
    """Distance from point `p` to the analytic surface `c`."""
    if c.kind == "plane":
        return abs(sum((p[i] - c.axis_loc[i]) * plane_normal[i] for i in range(3)))
    if c.kind == "sphere":
        return abs(math.dist(p, c.axis_loc) - c.radius)
    t, r = _axial_radial(p, c.axis_loc, c.axis_dir)
    if c.kind == "cylinder":
        return abs(r - c.radius)
    if c.kind == "cone":
        return abs(r - (c.radius + t * math.tan(c.half_angle))) * math.cos(c.half_angle)
    return abs(math.hypot(r - c.major_radius, t) - c.radius)       # torus


def _boundary_points(face: TopoDS_Face) -> list[list[float]]:
    pts: list[list[float]] = []
    exp = TopExp_Explorer(face, TopAbs_EDGE)
    while exp.More():
        try:
            curve = BRepAdaptor_Curve(TopoDS.Edge_s(exp.Current()))
            a, b = curve.FirstParameter(), curve.LastParameter()
            if math.isfinite(a) and math.isfinite(b):
                pts.extend(_xyz(curve.Value(a + (b - a) * i / (_EDGE_SAMPLES - 1))) for i in range(_EDGE_SAMPLES))
        except Exception:  # noqa: BLE001 - an edge without a 3D curve adds no points
            pass
        exp.Next()
    return pts


def _grid_points(surf: BRepAdaptor_Surface) -> list[list[float]]:
    u0, u1, v0, v1 = surf.FirstUParameter(), surf.LastUParameter(), surf.FirstVParameter(), surf.LastVParameter()
    if not all(math.isfinite(x) for x in (u0, u1, v0, v1)):
        return []
    return [_xyz(surf.Value(u0 + (u1 - u0) * i / (_GRID - 1), v0 + (v1 - v0) * j / (_GRID - 1)))
            for i in range(_GRID) for j in range(_GRID)]


def _sweep(angles: list[float]) -> float:
    """The angle covered by points at `angles` around an axis: a full turn less the largest empty arc."""
    if len(angles) < 2:
        return 0.0
    a = sorted(angles)
    gap = max(max(a[i + 1] - a[i] for i in range(len(a) - 1)), a[0] + 2 * math.pi - a[-1])
    # A closed face is sampled all the way round, so its largest gap is only the sampling step.
    return 2 * math.pi if gap < 3 * (2 * math.pi / (_EDGE_SAMPLES - 1)) else 2 * math.pi - gap


def _perpendicular(d: list[float]) -> tuple[list[float], list[float]]:
    ref = [1.0, 0.0, 0.0] if abs(d[0]) < 0.9 else [0.0, 1.0, 0.0]
    x = [ref[1] * d[2] - ref[2] * d[1], ref[2] * d[0] - ref[0] * d[2], ref[0] * d[1] - ref[1] * d[0]]
    n = math.sqrt(sum(c * c for c in x))
    x = [c / n for c in x]
    y = [d[1] * x[2] - d[2] * x[1], d[2] * x[0] - d[0] * x[2], d[0] * x[1] - d[1] * x[0]]
    return x, y


def _extent(c: CanonicalFace, boundary: list[list[float]]) -> None:
    """Height, sweep and axis ends of a cylinder or cone face, from where its boundary sits on the surface."""
    if not boundary:
        return
    x, y = _perpendicular(c.axis_dir)
    ts, angles = [], []
    for p in boundary:
        rel = [p[i] - c.axis_loc[i] for i in range(3)]
        ts.append(sum(rel[i] * c.axis_dir[i] for i in range(3)))
        angles.append(math.atan2(sum(rel[i] * y[i] for i in range(3)), sum(rel[i] * x[i] for i in range(3))))
    lo, hi = min(ts), max(ts)
    c.axis_start = [c.axis_loc[i] + lo * c.axis_dir[i] for i in range(3)]
    c.axis_end = [c.axis_loc[i] + hi * c.axis_dir[i] for i in range(3)]
    c.height = (hi - lo) / (math.cos(c.half_angle) if c.kind == "cone" else 1.0)
    c.sweep = _sweep(angles)


def _describe(surface) -> tuple[CanonicalFace, list[float] | None] | None:
    """A CanonicalFace for an analytic Geom_Surface (plus the normal, for a plane)."""
    if isinstance(surface, Geom_Plane):
        pln = surface.Pln()
        return CanonicalFace("plane", 0.0, axis_loc=_xyz(pln.Location())), _xyz(pln.Axis().Direction())
    if isinstance(surface, Geom_CylindricalSurface):
        g = surface.Cylinder()
        return CanonicalFace("cylinder", 0.0, _xyz(g.Axis().Location()), _xyz(g.Axis().Direction()), g.Radius()), None
    if isinstance(surface, Geom_ConicalSurface):
        g = surface.Cone()
        return CanonicalFace("cone", 0.0, _xyz(g.Axis().Location()), _xyz(g.Axis().Direction()), g.RefRadius(),
                             half_angle=g.SemiAngle()), None
    if isinstance(surface, Geom_SphericalSurface):
        g = surface.Sphere()
        return CanonicalFace("sphere", 0.0, _xyz(g.Location()), None, g.Radius()), None
    if isinstance(surface, Geom_ToroidalSurface):
        g = surface.Torus()
        return CanonicalFace("torus", 0.0, _xyz(g.Axis().Location()), _xyz(g.Axis().Direction()), g.MinorRadius(),
                             major_radius=g.MajorRadius()), None
    return None


def canonical_face(face: TopoDS_Face, tolerance: float = TOLERANCE_MM) -> CanonicalFace | None:
    """The analytic surface under a face that is not written as one, or None.

    None for a face that is already analytic (read it directly), for a real free-form face, and whenever the
    face itself is further than `tolerance` from the surface found. The conversion is OCCT's; the check is
    ours, on the face's own boundary and parameter range, so a wrong fit cannot invent a hole."""
    try:
        surf = BRepAdaptor_Surface(face)
        if surf.GetType() in _NATIVE:
            return None
        geom = BRep_Tool.Surface_s(face)
        if geom is None:
            return None
        # The whole surface first. When that fails, only the part the face uses: a face can be an analytic
        # piece of a larger surface. (Asking for the face's range alone misses fits the first call finds.)
        analytic = GeomConvert_SurfToAnaSurf(geom).ConvertToAnalytical(tolerance)
        if analytic is None:
            u0, u1, v0, v1 = surf.FirstUParameter(), surf.LastUParameter(), surf.FirstVParameter(), surf.LastVParameter()
            if all(math.isfinite(x) for x in (u0, u1, v0, v1)):
                analytic = GeomConvert_SurfToAnaSurf(geom).ConvertToAnalytical(tolerance, u0, u1, v0, v1)
        if analytic is None:
            return None
        described = _describe(analytic)
        if described is None:
            return None
        c, plane_normal = described
        boundary = _boundary_points(face)
        samples = boundary + _grid_points(surf)
        if not samples:
            return None
        c.gap = max(_distance(c, plane_normal, p) for p in samples)
        if c.gap > tolerance:
            return None
        if c.kind in ("cylinder", "cone"):
            _extent(c, boundary)
        return c
    except Exception:  # noqa: BLE001 - a face that cannot be analysed simply stays free-form
        return None
