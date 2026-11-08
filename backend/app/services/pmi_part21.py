"""Fallback semantic-PMI parser working directly on the ISO 10303-21 text.

Used when OCCT's XCAF DimTol tool returns nothing (e.g. PMI that is not linked to geometry
through GEOMETRIC_ITEM_SPECIFIC_USAGE, or writers OCCT does not fully understand). Reads
DIMENSIONAL_SIZE / DIMENSIONAL_LOCATION (+ PLUS_MINUS_TOLERANCE), *_TOLERANCE entities,
DATUM / DATUM_SYSTEM, and resolves shape aspects -> ADVANCED_FACE -> OCCT face by matching
the analytic surface (type + placement + radius).
"""
from __future__ import annotations

import logging
import math
import re
from dataclasses import dataclass, field

from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.GeomAbs import GeomAbs_Cone, GeomAbs_Cylinder, GeomAbs_Plane, GeomAbs_Sphere, GeomAbs_Torus
from OCP.TopoDS import TopoDS_Shape

from app.services.pmi_types import Characteristic, Datum
from app.services.tessellator import iter_faces

log = logging.getLogger("quality.pmi.part21")

# ---------------------------------------------------------------- tokenizer


@dataclass
class Entity:
    id: int
    types: list[str]  # one for simple entities, several for complex (external mapping) entities
    args: list[list]  # parallel to types

    @property
    def type(self) -> str:
        return self.types[0]

    def has(self, t: str) -> bool:
        return t in self.types

    def args_of(self, t: str) -> list:
        return self.args[self.types.index(t)] if t in self.types else []


class Ref(int):
    """Entity reference (#123)."""


_TOKEN = re.compile(r"""'(?:''|[^'])*'|#\d+|[A-Z_][A-Z0-9_]*|\.[A-Z_]+\.|[-+]?(?:\d+\.?\d*|\.\d+)(?:E[-+]?\d+)?|[(),=;$*]""", re.I)


def _split_records(data: str) -> list[str]:
    records, buf, in_str = [], [], False
    for ch in data:
        if ch == "'":
            in_str = not in_str
        if ch == ";" and not in_str:
            records.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
    return records


def _parse_args(tokens: list[str], pos: int) -> tuple[list, int]:
    """Parse '(' ... ')' starting at tokens[pos] == '('. Returns (list, next_pos)."""
    assert tokens[pos] == "("
    pos += 1
    out: list = []
    while pos < len(tokens):
        t = tokens[pos]
        if t == ")":
            return out, pos + 1
        if t == ",":
            pos += 1
            continue
        if t == "(":
            sub, pos = _parse_args(tokens, pos)
            out.append(sub)
            continue
        if t.startswith("#"):
            out.append(Ref(int(t[1:])))
        elif t.startswith("'"):
            out.append(t[1:-1].replace("''", "'"))
        elif t.startswith("."):
            out.append(t)
        elif t in ("$", "*"):
            out.append(None)
        elif re.match(r"^[A-Z_][A-Z0-9_]*$", t, re.I) and pos + 1 < len(tokens) and tokens[pos + 1] == "(":
            # typed value e.g. LENGTH_MEASURE(0.05)
            inner, pos = _parse_args(tokens, pos + 1)
            out.append((t.upper(), inner))
            continue
        else:
            try:
                out.append(float(t))
            except ValueError:
                out.append(t)
        pos += 1
    return out, pos


def parse_step_entities(text: str) -> dict[int, Entity]:
    m = re.search(r"\bDATA\s*;(.*)\bENDSEC\s*;", text, re.S)
    body = m.group(1) if m else text
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
    entities: dict[int, Entity] = {}
    for rec in _split_records(body):
        rec = rec.strip()
        if not rec.startswith("#"):
            continue
        tokens = _TOKEN.findall(rec)
        if len(tokens) < 3 or tokens[1] != "=":
            continue
        eid = int(tokens[0][1:])
        pos = 2
        types, args = [], []
        try:
            if tokens[pos] == "(":  # complex entity
                pos += 1
                while pos < len(tokens) and tokens[pos] != ")":
                    name = tokens[pos].upper()
                    a, pos = _parse_args(tokens, pos + 1)
                    types.append(name)
                    args.append(a)
            else:
                name = tokens[pos].upper()
                a, pos = _parse_args(tokens, pos + 1)
                types.append(name)
                args.append(a)
        except (AssertionError, IndexError):
            continue
        if types:
            entities[eid] = Entity(eid, types, args)
    return entities


# ---------------------------------------------------------------- helpers

_TOL_TYPES = {
    "FLATNESS_TOLERANCE": "Flatness",
    "STRAIGHTNESS_TOLERANCE": "Straightness",
    "ROUNDNESS_TOLERANCE": "Circularity",
    "CYLINDRICITY_TOLERANCE": "Cylindricity",
    "LINE_PROFILE_TOLERANCE": "Profile of Line",
    "SURFACE_PROFILE_TOLERANCE": "Profile of Surface",
    "ANGULARITY_TOLERANCE": "Angularity",
    "PERPENDICULARITY_TOLERANCE": "Perpendicularity",
    "PARALLELISM_TOLERANCE": "Parallelism",
    "POSITION_TOLERANCE": "Position",
    "CONCENTRICITY_TOLERANCE": "Concentricity",
    "COAXIALITY_TOLERANCE": "Coaxiality",
    "SYMMETRY_TOLERANCE": "Symmetry",
    "CIRCULAR_RUNOUT_TOLERANCE": "Circular Runout",
    "TOTAL_RUNOUT_TOLERANCE": "Total Runout",
}
_MODIFIERS = {
    ".MAXIMUM_MATERIAL_REQUIREMENT.": "M",
    ".LEAST_MATERIAL_REQUIREMENT.": "L",
    ".PROJECTED_TOLERANCE_ZONE.": "P",
    ".FREE_STATE.": "F",
    ".TANGENT_PLANE.": "T",
    ".UNEQUALLY_DISPOSED.": "U",
}


def _find_measure(value, kinds=("LENGTH_MEASURE", "PLANE_ANGLE_MEASURE", "POSITIVE_LENGTH_MEASURE")) -> float | None:
    """Recursively find a typed numeric measure inside parsed args."""
    if isinstance(value, tuple) and value[0] in kinds and value[1] and isinstance(value[1][0], float):
        return value[1][0]
    if isinstance(value, float):
        return value
    if isinstance(value, list):
        for v in value:
            r = _find_measure(v)
            if r is not None:
                return r
    if isinstance(value, tuple):
        return _find_measure(value[1])
    return None


def _measure_of(entities: dict[int, Entity], ref) -> float | None:
    if isinstance(ref, Ref) and ref in entities:
        ent = entities[ref]
        for t, a in zip(ent.types, ent.args):
            if t in ("MEASURE_WITH_UNIT", "LENGTH_MEASURE_WITH_UNIT", "PLANE_ANGLE_MEASURE_WITH_UNIT") and a:
                r = _find_measure(a[0])
                if r is not None:
                    return r
        for a in ent.args:
            r = _find_measure(a)
            if r is not None:
                return r
        return None
    if isinstance(ref, Ref):
        return None
    return _find_measure(ref)


# ---------------------------------------------------------------- units
#
# OCCT loads geometry in mm whatever the file says, while PMI values are kept as written (the drawing's units).
# Each measure names its own unit, and files mix them: NIST FTC-06 has mm geometry with inch PMI. A unit is
# resolved from its conversion factor, not its name, since a CONVERSION_BASED_UNIT can be called 'MILLIMETRE'.

_SI_PREFIX = {None: 1.0, ".MILLI.": 1e-3, ".CENTI.": 1e-2, ".DECI.": 1e-1, ".MICRO.": 1e-6, ".KILO.": 1e3}
_MEASURE_TYPES = ("MEASURE_WITH_UNIT", "LENGTH_MEASURE_WITH_UNIT", "PLANE_ANGLE_MEASURE_WITH_UNIT")
_LENGTH_NAMES = (("mm", 1.0), ("in", 25.4), ("m", 1000.0), ("cm", 10.0), ("um", 0.001), ("ft", 304.8))
_ANGLE_NAMES = (("deg", 1.0), ("rad", math.degrees(1.0)))


def _value_and_unit(ent: Entity):
    """(value, unit ref) of a measure-with-unit entity, simple or complex."""
    for t, a in zip(ent.types, ent.args):
        if t in _MEASURE_TYPES and len(a) >= 2:
            return _find_measure(a[0]), a[1]
    return None, None


def _unit_scale(entities: dict[int, Entity], uref, depth: int = 0) -> tuple[str, float] | None:
    """('length', mm per unit) or ('angle', degrees per unit) for a unit entity; None if unknown."""
    u = entities.get(uref) if isinstance(uref, Ref) else None
    if u is None or depth > 8:
        return None
    if u.has("SI_UNIT"):
        a = u.args_of("SI_UNIT")
        prefix = a[0] if a and isinstance(a[0], str) else None
        name = a[1] if len(a) > 1 else None
        p = _SI_PREFIX.get(prefix)
        if p is None:
            return None
        if name == ".METRE.":
            return "length", 1000.0 * p
        if name == ".RADIAN.":
            return "angle", math.degrees(p)
        return None
    if u.has("CONVERSION_BASED_UNIT"):
        a = u.args_of("CONVERSION_BASED_UNIT")
        factor = entities.get(a[1]) if len(a) > 1 and isinstance(a[1], Ref) else None
        if factor is not None:
            val, base = _value_and_unit(factor)
            inner = _unit_scale(entities, base, depth + 1)
            if val and inner:
                return inner[0], val * inner[1]
    return None


def _unit_name(scale: tuple[str, float] | None) -> str:
    if not scale:
        return ""
    kind, f = scale
    for name, v in _LENGTH_NAMES if kind == "length" else _ANGLE_NAMES:
        if abs(f - v) <= 1e-6 * v:
            return name
    return ""


def _unit_of(entities: dict[int, Entity], ref) -> str:
    """Unit of a measure entity ('in', 'mm', 'deg', 'rad', ...); '' when it states none we know."""
    ent = entities.get(ref) if isinstance(ref, Ref) else None
    if ent is None:
        return ""
    _, uref = _value_and_unit(ent)
    return _unit_name(_unit_scale(entities, uref))


def context_length_unit(entities: dict[int, Entity]) -> tuple[str, float]:
    """The geometry's length unit (first GLOBAL_UNIT_ASSIGNED_CONTEXT with one) and its mm per unit."""
    for e in entities.values():
        if not e.has("GLOBAL_UNIT_ASSIGNED_CONTEXT"):
            continue
        units = e.args_of("GLOBAL_UNIT_ASSIGNED_CONTEXT")
        units = units[0] if units and isinstance(units[0], list) else units
        for u in units:
            s = _unit_scale(entities, u)
            if s and s[0] == "length":
                return _unit_name(s) or "mm", s[1]
    return "mm", 1.0


def _str(v) -> str:
    return v if isinstance(v, str) else ""


# ---------------------------------------------------------------- face matching


@dataclass
class _SurfKey:
    kind: str
    loc: tuple[float, float, float]
    axis: tuple[float, float, float]
    radius: float = 0.0


def _vec(entities, ref, default: tuple[float, float, float] = (0.0, 0.0, 1.0)) -> tuple[float, float, float]:
    e = entities.get(ref) if isinstance(ref, Ref) else None
    if e and e.type in ("DIRECTION", "CARTESIAN_POINT") and len(e.args[0]) >= 2 and isinstance(e.args[0][1], list):
        v = [float(x) for x in e.args[0][1]]
        while len(v) < 3:
            v.append(0.0)
        return (v[0], v[1], v[2])
    return default


def _placement(entities, ref):
    e = entities.get(ref) if isinstance(ref, Ref) else None
    if e and e.type == "AXIS2_PLACEMENT_3D":
        a = e.args[0]
        loc = _vec(entities, a[1], (0.0, 0.0, 0.0)) if len(a) > 1 else (0.0, 0.0, 0.0)
        axis = _vec(entities, a[2]) if len(a) > 2 and a[2] is not None else (0.0, 0.0, 1.0)
        return loc, axis
    return (0.0, 0.0, 0.0), (0.0, 0.0, 1.0)


def _step_face_key(entities: dict[int, Entity], face_ref, scale: float = 1.0) -> _SurfKey | None:
    """Analytic surface of a STEP face; `scale` converts the file's length unit to OCCT's mm."""
    face = entities.get(face_ref) if isinstance(face_ref, Ref) else None
    if not face or not face.has("ADVANCED_FACE") and not face.has("FACE_SURFACE"):
        return None
    a = face.args_of("ADVANCED_FACE") or face.args_of("FACE_SURFACE")
    surf = entities.get(a[2]) if len(a) > 2 and isinstance(a[2], Ref) else None
    if not surf:
        return None
    t = surf.type
    sa = surf.args[0]
    if t not in ("PLANE", "CYLINDRICAL_SURFACE", "SPHERICAL_SURFACE", "CONICAL_SURFACE", "TOROIDAL_SURFACE"):
        return None
    loc, axis = _placement(entities, sa[1])
    loc = (loc[0] * scale, loc[1] * scale, loc[2] * scale)
    if t == "PLANE":
        return _SurfKey("plane", loc, axis)
    if t == "CYLINDRICAL_SURFACE":
        return _SurfKey("cylinder", loc, axis, float(sa[2]) * scale)
    if t == "SPHERICAL_SURFACE":
        return _SurfKey("sphere", loc, axis, float(sa[2]) * scale)
    if t == "CONICAL_SURFACE":
        return _SurfKey("cone", loc, axis, float(sa[2]) * scale)
    if t == "TOROIDAL_SURFACE":
        return _SurfKey("torus", loc, axis, float(sa[2]) * scale)
    return None


def _occ_face_keys(shape: TopoDS_Shape) -> list[tuple[int, _SurfKey]]:
    out = []
    for fid, face in iter_faces(shape):
        s = BRepAdaptor_Surface(face)
        st = s.GetType()
        try:
            if st == GeomAbs_Plane:
                pl = s.Plane()
                p, d = pl.Location(), pl.Axis().Direction()
                out.append((fid, _SurfKey("plane", (p.X(), p.Y(), p.Z()), (d.X(), d.Y(), d.Z()))))
            elif st == GeomAbs_Cylinder:
                c = s.Cylinder()
                p, d = c.Location(), c.Axis().Direction()
                out.append((fid, _SurfKey("cylinder", (p.X(), p.Y(), p.Z()), (d.X(), d.Y(), d.Z()), c.Radius())))
            elif st == GeomAbs_Sphere:
                c = s.Sphere()
                p, d = c.Location(), c.Position().Direction()
                out.append((fid, _SurfKey("sphere", (p.X(), p.Y(), p.Z()), (d.X(), d.Y(), d.Z()), c.Radius())))
            elif st == GeomAbs_Cone:
                c = s.Cone()
                p, d = c.Location(), c.Axis().Direction()
                out.append((fid, _SurfKey("cone", (p.X(), p.Y(), p.Z()), (d.X(), d.Y(), d.Z()), c.RefRadius())))
            elif st == GeomAbs_Torus:
                c = s.Torus()
                p, d = c.Location(), c.Axis().Direction()
                out.append((fid, _SurfKey("torus", (p.X(), p.Y(), p.Z()), (d.X(), d.Y(), d.Z()), c.MajorRadius())))
        except Exception:  # noqa: BLE001
            continue
    return out


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _norm(a):
    return math.sqrt(_dot(a, a))


def _match_face(key: _SurfKey, occ: list[tuple[int, _SurfKey]], tol: float) -> int | None:
    best, best_score = None, None
    for fid, k in occ:
        if k.kind != key.kind:
            continue
        if abs(_dot(k.axis, key.axis)) < 0.999:
            continue
        if key.kind != "plane" and abs(k.radius - key.radius) > tol:
            continue
        d = _sub(key.loc, k.loc)
        if key.kind == "plane":
            dist = abs(_dot(d, k.axis))
        elif key.kind == "sphere":
            dist = _norm(d)
        else:  # distance from key.loc to the OCC axis line
            along = _dot(d, k.axis)
            perp = _sub(d, (k.axis[0] * along, k.axis[1] * along, k.axis[2] * along))
            dist = _norm(perp)
        if dist <= tol and (best_score is None or dist < best_score):
            best, best_score = fid, dist
    return best


def _scaled(p, scale: float) -> tuple[float, float, float]:
    return (p[0] * scale, p[1] * scale, p[2] * scale)


def _circle_points(centre, axis, radius: float) -> list[tuple[float, float, float]]:
    """Four points of a circle (centre, axis, radius), a quarter turn apart."""
    n = _norm(axis) or 1.0
    ax = (axis[0] / n, axis[1] / n, axis[2] / n)
    ref = min(((1.0, 0.0, 0.0), (0.0, 1.0, 0.0), (0.0, 0.0, 1.0)), key=lambda e: abs(_dot(e, ax)))
    u = (ax[1] * ref[2] - ax[2] * ref[1], ax[2] * ref[0] - ax[0] * ref[2], ax[0] * ref[1] - ax[1] * ref[0])
    un = _norm(u)
    u = (u[0] / un, u[1] / un, u[2] / un)
    v = (ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0])
    return [tuple(centre[i] + radius * (c * u[i] + s * v[i]) for i in range(3))
            for c, s in ((1, 0), (0, 1), (-1, 0), (0, -1))]


def _geometry_points(entities: dict[int, Entity], ref, scale: float, depth: int = 0) -> list[tuple[float, float, float]]:
    """Points (mm) on a datum target drawn as geometry: a point, a line's points, a circle, a polyline."""
    e = entities.get(ref) if isinstance(ref, Ref) else None
    if e is None or depth > 4:
        return []
    a = e.args[0]
    if e.type == "CARTESIAN_POINT":
        return [_scaled(_vec(entities, ref, (0.0, 0.0, 0.0)), scale)]
    if e.type == "TRIMMED_CURVE" and len(a) >= 4:
        ends = [r for t in (a[2], a[3]) for r in _refs_in(t)
                if (entities.get(r) and entities[r].type == "CARTESIAN_POINT")]
        return ([p for r in ends for p in _geometry_points(entities, r, scale, depth + 1)]
                + _geometry_points(entities, a[1], scale, depth + 1))
    if e.type == "CIRCLE" and len(a) >= 3:
        loc, axis = _placement(entities, a[1])
        return _circle_points(_scaled(loc, scale), axis, float(a[2]) * scale)
    if e.type == "LINE" and len(a) >= 2:
        return _geometry_points(entities, a[1], scale, depth + 1)
    if e.type == "POLYLINE" and len(a) >= 2:
        return [p for r in _refs_in(a[1]) for p in _geometry_points(entities, r, scale, depth + 1)]
    if e.type == "COMPOSITE_CURVE" and len(a) >= 2:
        return [p for seg in _refs_in(a[1]) for p in _geometry_points(entities, seg, scale, depth + 1)]
    if e.type == "COMPOSITE_CURVE_SEGMENT" and len(a) >= 3:
        return _geometry_points(entities, a[2], scale, depth + 1)
    return []


def _target_placements(entities: dict[int, Entity], scale: float) -> dict[int, list[tuple[float, float, float]]]:
    """Datum targets placed by parameters (PLACED_DATUM_TARGET_FEATURE → PROPERTY_DEFINITION →
    SHAPE_DEFINITION_REPRESENTATION → SHAPE_REPRESENTATION_WITH_PARAMETERS holding an 'orientation' placement and
    the target's size): {target id: its centre, plus four points of its circle when it has a diameter}."""
    pd_of: dict[int, list[int]] = {}
    rep_of: dict[int, list[int]] = {}
    for e in entities.values():
        a = e.args[0] if e.args else []
        if e.type == "PROPERTY_DEFINITION" and len(a) > 2 and isinstance(a[2], Ref):
            pd_of.setdefault(int(a[2]), []).append(e.id)
        elif e.type == "SHAPE_DEFINITION_REPRESENTATION" and len(a) > 1 and isinstance(a[0], Ref) and isinstance(a[1], Ref):
            rep_of.setdefault(int(a[0]), []).append(int(a[1]))
    out: dict[int, list[tuple[float, float, float]]] = {}
    for e in entities.values():
        if not (e.has("PLACED_DATUM_TARGET_FEATURE") or e.has("DATUM_TARGET")):
            continue
        for pd in pd_of.get(e.id, []):
            for rep in rep_of.get(pd, []):
                r = entities.get(rep)
                if r is None or not r.args or len(r.args[0]) < 2:
                    continue
                centre = axis = None
                diameter = None
                for it in _refs_in(r.args[0][1]):
                    ie = entities.get(it)
                    if ie is None:
                        continue
                    if ie.type == "AXIS2_PLACEMENT_3D":
                        loc, axis = _placement(entities, it)
                        centre = _scaled(loc, scale)
                    elif "diameter" in _str((ie.args_of("REPRESENTATION_ITEM") or [""])[0]).lower():
                        diameter = _find_measure(ie.args)
                if centre is None:
                    continue
                pts = [centre]
                if diameter:
                    pts += _circle_points(centre, axis, diameter * scale / 2)
                out.setdefault(e.id, []).extend(pts)
    return out


def _face_index(shape: TopoDS_Shape) -> list:
    from OCP.Bnd import Bnd_Box
    from OCP.BRepBndLib import BRepBndLib

    out = []
    for fid, face in iter_faces(shape):
        box = Bnd_Box()
        BRepBndLib.Add_s(face, box)
        out.append((fid, face, box))
    return out


def _faces_at(index: list, points: list, tol: float) -> list[int]:
    """The face(s) the most points lie on (within `tol`)."""
    from collections import Counter

    from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeVertex
    from OCP.BRepExtrema import BRepExtrema_DistShapeShape
    from OCP.gp import gp_Pnt

    hits: Counter = Counter()
    for p in points:
        gp = gp_Pnt(*p)
        vertex = BRepBuilderAPI_MakeVertex(gp).Vertex()
        for fid, face, box in index:
            if box.IsOut(gp) and box.Distance(_point_box(gp)) > tol:
                continue
            d = BRepExtrema_DistShapeShape(vertex, face)
            if d.IsDone() and d.Value() <= tol:
                hits[fid] += 1
    if not hits:
        return []
    best = max(hits.values())
    return sorted(f for f, n in hits.items() if n == best)


def _point_box(gp):
    from OCP.Bnd import Bnd_Box

    b = Bnd_Box()
    b.Add(gp)
    return b


def _refs_in(value) -> list[Ref]:
    """Every entity reference in a parsed argument: a Ref, a list of them, or a typed value such as
    SET_REPRESENTATION_ITEM((#1,#2))."""
    if isinstance(value, Ref):
        return [value]
    if isinstance(value, tuple) and len(value) == 2:
        return _refs_in(value[1])
    if isinstance(value, list):
        return [r for v in value for r in _refs_in(v)]
    return []


# ---------------------------------------------------------------- main


def extract_part21(path: str, shape: TopoDS_Shape, bbox_diag: float) -> tuple[list[Characteristic], list[Datum]]:
    with open(path, "r", errors="ignore") as f:
        text = f.read()
    ents = parse_step_entities(text)
    ctx_unit, ctx_mm = context_length_unit(ents)  # STEP coordinates are in this unit; OCCT's are in mm
    occ_keys = _occ_face_keys(shape)
    tol = max(bbox_diag * 1e-4, 1e-4)

    # shape aspect -> [face ids]. GEOMETRIC_ITEM_SPECIFIC_USAGE is the usual link; some exporters use its
    # supertype ITEM_IDENTIFIED_REPRESENTATION_USAGE with a SET_REPRESENTATION_ITEM((#f1,#f2,…)) of faces
    # (NIST FTC-06 links six of its ten datum features that way).
    aspect_faces: dict[int, list[int]] = {}
    aspect_geom: dict[int, list[Ref]] = {}      # items that are not faces: datum-target points and curves
    for e in ents.values():
        usage = next((t for t in ("GEOMETRIC_ITEM_SPECIFIC_USAGE", "ITEM_IDENTIFIED_REPRESENTATION_USAGE") if e.has(t)), None)
        if usage:
            a = e.args_of(usage)
            if len(a) < 5 or not isinstance(a[2], Ref):
                continue
            for item in _refs_in(a[4]):
                key = _step_face_key(ents, item, ctx_mm)
                fid = _match_face(key, occ_keys, tol) if key else None
                if fid is not None:
                    aspect_faces.setdefault(int(a[2]), []).append(fid)
                elif key is None:
                    aspect_geom.setdefault(int(a[2]), []).append(item)

    def inherit(dst: int, src: int) -> bool:
        grew = False
        for table in (aspect_faces, aspect_geom):
            for x in table.get(src, []):
                if x not in table.setdefault(dst, []):
                    table[dst].append(x)
                    grew = True
        return grew

    # composite / derived shape aspects -> union of their children (nested composites: until nothing grows)
    links = [(int(a[2]), int(a[3])) for e in ents.values() if e.has("SHAPE_ASPECT_RELATIONSHIP")
             for a in [e.args_of("SHAPE_ASPECT_RELATIONSHIP")]
             if len(a) >= 4 and isinstance(a[2], Ref) and isinstance(a[3], Ref)]
    for _ in range(4):
        if not any([inherit(parent, child) for parent, child in links]):
            break
    # A datum target (point, line or area: PLACED_DATUM_TARGET_FEATURE) lies on the feature the relationship
    # names first, so it takes that feature's faces; the datum then takes its targets' faces (below).
    for e in ents.values():
        if e.has("FEATURE_FOR_DATUM_TARGET_RELATIONSHIP"):
            a = e.args_of("FEATURE_FOR_DATUM_TARGET_RELATIONSHIP")
            if len(a) >= 4 and isinstance(a[2], Ref) and isinstance(a[3], Ref):
                inherit(int(a[3]), int(a[2]))
    placed = _target_placements(ents, ctx_mm)
    face_index: list | None = None

    def target_faces(aspects: list[int]) -> list[int]:
        """Faces under datum targets given only as geometry: a placed target's location (and its circle),
        or the point / line / circle the target is drawn as."""
        nonlocal face_index
        pts = [p for a in aspects for p in placed.get(a, [])]
        pts += [p for a in aspects for item in aspect_geom.get(a, []) for p in _geometry_points(ents, item, ctx_mm)]
        if not pts:
            return []
        if face_index is None:
            face_index = _face_index(shape)
        return _faces_at(face_index, pts, tol)

    def faces_for(aspect_ref) -> list[int]:
        return list(aspect_faces.get(int(aspect_ref), [])) if isinstance(aspect_ref, Ref) else []

    def aspect_name(aspect_ref) -> str:
        e = ents.get(aspect_ref) if isinstance(aspect_ref, Ref) else None
        if not e:
            return ""
        for t in e.types:
            if t.endswith("SHAPE_ASPECT") or t in ("DATUM_FEATURE", "SHAPE_ASPECT"):
                a = e.args_of(t)
                return _str(a[0]) if a else ""
        a = e.args[0]
        return _str(a[0]) if a else ""

    # datums
    datums: list[Datum] = []
    datum_label: dict[int, str] = {}
    for e in ents.values():
        if e.has("DATUM"):
            a = e.args_of("DATUM")
            ident = _str(a[4]) if len(a) > 4 else ""
            label = ident or _str(a[0]) or chr(ord("A") + len(datums))
            datum_label[e.id] = label
            faces: list[int] = list(faces_for(Ref(e.id)))
            features = [parent for parent, child in links if child == e.id]   # DATUM_FEATURE / targets → datum
            for parent in features:
                faces.extend(f for f in faces_for(Ref(parent)) if f not in faces)
            if not faces:
                faces = target_faces([e.id, *features])
            if not any(d.label == label for d in datums):
                datums.append(Datum(label=label, face_ids=faces, source="part21"))

    def datum_system_refs(ref) -> list[str]:
        e = ents.get(ref) if isinstance(ref, Ref) else None
        if not e:
            return []
        if e.has("DATUM_SYSTEM"):
            a = e.args_of("DATUM_SYSTEM")
            items = a[4] if len(a) > 4 and isinstance(a[4], list) else []
            out: list[str] = []
            for it in items:
                out.extend(datum_system_refs(it))
            return out
        if e.has("DATUM_REFERENCE_COMPARTMENT") or e.has("DATUM_REFERENCE_ELEMENT"):
            a = e.args_of("DATUM_REFERENCE_COMPARTMENT") or e.args_of("DATUM_REFERENCE_ELEMENT")
            base = a[4] if len(a) > 4 else None
            if isinstance(base, Ref):
                if base in datum_label:
                    return [datum_label[base]]
                return datum_system_refs(base)
            if isinstance(base, list):
                out = []
                for b in base:
                    out.extend(datum_system_refs(b))
                return out
            if isinstance(base, tuple) and base[0] == "COMMON_DATUM_LIST" and base[1] and isinstance(base[1][0], list):
                common = [r for b in base[1][0] for r in datum_system_refs(b)]  # E-F: one datum from two features
                return ["-".join(common)] if common else []
        if e.has("DATUM") and e.id in datum_label:
            return [datum_label[e.id]]
        return []

    chars: list[Characteristic] = []

    # dimensions
    dim_values: dict[int, dict] = {}
    for e in ents.values():
        if e.has("DIMENSIONAL_CHARACTERISTIC_REPRESENTATION"):
            a = e.args_of("DIMENSIONAL_CHARACTERISTIC_REPRESENTATION")
            if len(a) < 2 or not isinstance(a[0], Ref) or not isinstance(a[1], Ref):
                continue
            rep = ents.get(a[1])
            if not rep:
                continue
            ra = rep.args[0]
            items = ra[1] if len(ra) > 1 and isinstance(ra[1], list) else []
            vals = dim_values.setdefault(int(a[0]), {})
            for it in items:
                ie = ents.get(it) if isinstance(it, Ref) else None
                if not ie:
                    continue
                v = _measure_of(ents, it)
                name = ""
                for t, ta in zip(ie.types, ie.args):
                    if t == "REPRESENTATION_ITEM" and ta:
                        name = _str(ta[0]).lower()
                if v is None:
                    continue
                if "upper" in name:
                    vals["upper"] = v
                elif "lower" in name:
                    vals["lower"] = v
                else:
                    vals.setdefault("nominal", v)
                if not vals.get("unit"):
                    vals["unit"] = _unit_of(ents, it)
    pm_tol: dict[int, tuple[float, float]] = {}
    for e in ents.values():
        if e.has("PLUS_MINUS_TOLERANCE"):
            a = e.args_of("PLUS_MINUS_TOLERANCE")
            if len(a) < 2 or not isinstance(a[1], Ref):
                continue
            tv = ents.get(a[0]) if isinstance(a[0], Ref) else None
            if tv and tv.has("TOLERANCE_VALUE"):
                ta = tv.args_of("TOLERANCE_VALUE")
                lo, up = _measure_of(ents, ta[0]), _measure_of(ents, ta[1])
                if lo is not None and up is not None:
                    pm_tol[int(a[1])] = (lo, up)

    for e in ents.values():
        if e.has("DIMENSIONAL_SIZE") or e.has("DIMENSIONAL_LOCATION") or e.has("ANGULAR_SIZE") or e.has("ANGULAR_LOCATION"):
            angular = e.has("ANGULAR_SIZE") or e.has("ANGULAR_LOCATION")
            if e.has("DIMENSIONAL_SIZE") or e.has("ANGULAR_SIZE"):
                a = e.args_of("DIMENSIONAL_SIZE") or e.args_of("ANGULAR_SIZE")
                aspects = [a[0]] if a else []
                kind_name = _str(a[1]) if len(a) > 1 else ""
                feature = aspect_name(a[0]) if a else ""
            else:
                a = e.args_of("DIMENSIONAL_LOCATION") or e.args_of("ANGULAR_LOCATION")
                aspects = [a[2], a[3]] if len(a) > 3 else []
                kind_name = _str(a[0])
                names = [aspect_name(a[2]), aspect_name(a[3])] if len(a) > 3 else []
                feature = " / ".join(dict.fromkeys(x for x in names if x))
            vals = dim_values.get(e.id, {})
            nominal = vals.get("nominal")
            if nominal is None:
                continue
            usl, lsl = vals.get("upper"), vals.get("lower")
            if e.id in pm_tol:
                lo, up = pm_tol[e.id]
                # Bounds written the wrong way round (NIST D2MI-904: (+0.005, -0.005)). Only when the "upper"
                # one is negative: a positive lower bound over a zero upper one is not swapped, it is the
                # lower deviation written as a magnitude (older OCCT-written files: (+0.02, 0) is 0/-0.02),
                # which the next line handles. Swapping those turned 0/-0.02 into +0.02/0.
                if up < lo and up < 0:
                    lo, up = up, lo
                lsl, usl = nominal + lo if lo <= 0 else nominal - lo, nominal + up
            kn = kind_name.lower()
            if "spherical" in kn and "diameter" in kn:
                type_label = "Spherical Diameter"
            elif "spherical" in kn and "radius" in kn:
                type_label = "Spherical Radius"
            elif "diameter" in kn:
                type_label = "Diameter"
            elif "radius" in kn:
                type_label = "Radius"
            elif "curve length" in kn:
                type_label = "Curve Length"
            elif "thickness" in kn:
                type_label = "Thickness"
            elif angular:
                type_label = "Angular" + (" Location" if e.has("ANGULAR_LOCATION") else "")
            elif e.has("DIMENSIONAL_LOCATION"):
                type_label = "Linear Distance"
            else:
                type_label = "Linear Size"
            if feature.lower() in (kn, "") and kind_name and kn not in ("diameter", "radius", "linear distance", "length"):
                feature = kind_name
            face_ids: list[int] = []
            for asp in aspects:
                face_ids.extend(f for f in faces_for(asp) if f not in face_ids)
            unit = vals.get("unit") or ("deg" if angular else ctx_unit)
            if unit == "rad":  # drawings state angles in degrees (OCCT's writer stores radians)
                nominal, usl, lsl = (None if v is None else math.degrees(v) for v in (nominal, usl, lsl))
                unit = "deg"
            chars.append(
                Characteristic(
                    kind="dimension", feature_name=feature, type_label=type_label, nominal=nominal,
                    usl=usl, lsl=lsl, unit=unit, face_ids=face_ids, source="part21",
                )
            )

    # geometric tolerances
    for e in ents.values():
        tol_type = next((t for t in e.types if t in _TOL_TYPES), None)
        if not tol_type:
            continue
        base = e.args_of("GEOMETRIC_TOLERANCE") or e.args_of(tol_type)
        if len(base) < 4:
            continue
        value = _measure_of(ents, base[2])
        if value is None:
            continue
        refs: list[str] = []
        if e.has("GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE"):
            da = e.args_of("GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE")
            systems = da[0] if da and isinstance(da[0], list) else da
            for s in systems:
                refs.extend(r for r in datum_system_refs(s) if r not in refs)
        modifiers: list[str] = []
        if e.has("GEOMETRIC_TOLERANCE_WITH_MODIFIERS"):
            ma = e.args_of("GEOMETRIC_TOLERANCE_WITH_MODIFIERS")
            mods = ma[0] if ma and isinstance(ma[0], list) else ma
            modifiers = [_MODIFIERS[m] for m in mods if isinstance(m, str) and m in _MODIFIERS]
        name = _str(base[0]) or aspect_name(base[3])
        chars.append(
            Characteristic(
                kind="geom_tolerance", feature_name=name, type_label=_TOL_TYPES[tol_type], nominal=0.0,
                usl=value, lsl=0.0, unit=_unit_of(ents, base[2]) or ctx_unit, datum_refs=refs, modifiers=modifiers,
                face_ids=faces_for(base[3]), source="part21",
            )
        )

    log.info("Part21 PMI: %d characteristics, %d datums", len(chars), len(datums))
    return chars, datums
