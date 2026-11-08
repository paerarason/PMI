"""Compute 3D anchor + label positions for characteristic balloons and datum flags."""
from __future__ import annotations

import math

from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepGProp import BRepGProp
from OCP.GeomAbs import GeomAbs_Plane
from OCP.GProp import GProp_GProps
from OCP.TopAbs import TopAbs_REVERSED
from OCP.TopoDS import TopoDS_Face, TopoDS_Shape

from app.services.pmi_types import Characteristic, Datum
from app.services.step_loader import BBox
from app.services.tessellator import iter_faces


def _face_info(face: TopoDS_Face) -> tuple[list[float], list[float] | None]:
    props = GProp_GProps()
    BRepGProp.SurfaceProperties_s(face, props)
    c = props.CentreOfMass()
    centroid = [c.X(), c.Y(), c.Z()]
    normal = None
    surf = BRepAdaptor_Surface(face)
    if surf.GetType() == GeomAbs_Plane:
        d = surf.Plane().Axis().Direction()
        n = [d.X(), d.Y(), d.Z()]
        if face.Orientation() == TopAbs_REVERSED:
            n = [-x for x in n]
        normal = n
    return centroid, normal


def _cross(a: list[float], b: list[float]) -> list[float]:
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def _unit(v: list[float]) -> list[float] | None:
    n = math.sqrt(sum(x * x for x in v))
    return [x / n for x in v] if n > 1e-9 else None


def place_balloons(shape: TopoDS_Shape, bbox: BBox, chars: list[Characteristic], datums: list[Datum]) -> None:
    faces = {fid: f for fid, f in iter_faces(shape)}
    cache: dict[int, tuple[list[float], list[float] | None]] = {}
    center = list(bbox.center)
    diag = bbox.diagonal or 1.0
    offset = 0.22 * diag

    def info(fid: int):
        if fid not in cache:
            cache[fid] = _face_info(faces[fid])
        return cache[fid]

    unplaced: list = []
    for item in [*chars, *datums]:
        valid = [f for f in item.face_ids if f in faces]
        if not valid:
            unplaced.append(item)
            continue
        centroid, normal = info(valid[0])
        if len(valid) > 1:  # e.g. location dims between two faces -> midpoint on the top of the part
            pts = [info(f)[0] for f in valid]
            centroid = [sum(p[i] for p in pts) / len(pts) for i in range(3)]
            centroid[2] = bbox.max[2]
            n1 = normal or [1.0, 0.0, 0.0]
            up = [0.0, 0.0, 1.0] if abs(n1[2]) < 0.9 else [1.0, 0.0, 0.0]
            normal = _unit(_cross(n1, up))
        direction = normal or _unit([centroid[i] - center[i] for i in range(3)]) or [0.0, 0.0, 1.0]
        item.anchor = centroid
        item.label_pos = [centroid[i] + direction[i] * offset for i in range(3)]

    _spread_labels([*chars, *datums], 0.09 * diag)

    # PMI without geometry links: fan them out along the top edge of the bounding box
    n = len(unplaced)
    for k, item in enumerate(unplaced):
        t = (k + 1) / (n + 1)
        x = bbox.min[0] + t * (bbox.max[0] - bbox.min[0])
        item.anchor = [x, bbox.max[1], bbox.max[2]]
        item.label_pos = [x, bbox.max[1] + 0.15 * diag, bbox.max[2] + 0.2 * diag]


def _spread_labels(items: list, min_dist: float) -> None:
    """Nudge overlapping labels apart (simple greedy pass) so balloons stay readable."""
    placed: list[list[float]] = []
    for item in items:
        if item.label_pos is None:
            continue
        p = list(item.label_pos)
        for _ in range(12):
            clash = next((q for q in placed if math.dist(p, q) < min_dist), None)
            if clash is None:
                break
            p[2] += min_dist
        item.label_pos = p
        placed.append(p)
