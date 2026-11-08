"""Triangulate the B-Rep into flat arrays for a three.js BufferGeometry.

Every face gets a contiguous index range (face_ranges) so the frontend can highlight
individual faces referenced by PMI. Face ids are the TopExp_Explorer order of TopAbs_FACE,
which is the same order used by pmi_extractor to resolve PMI -> face references.

Edges get a stable edge_id the same way (TopExp_Explorer(shape, TopAbs_EDGE) order, deduplicated by
underlying TShape since a shared edge is visited once per adjacent face) - `pmi_writer.py` uses
`iter_edges` to resolve a picked edge_id back to its TopoDS_Edge when authoring new PMI on it.

Vertices get a vertex_id the same way again (TopAbs_VERTEX, deduplicated by TShape) - useful as an exact
point reference (a corner, a hole center) rather than a face/edge centroid approximation.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from OCP.BRep import BRep_Tool
from OCP.BRepAdaptor import BRepAdaptor_Curve
from OCP.BRepLib import BRepLib_ToolTriangulatedShape
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.GCPnts import GCPnts_QuasiUniformDeflection
from OCP.TopAbs import TopAbs_EDGE, TopAbs_FACE, TopAbs_REVERSED, TopAbs_VERTEX
from OCP.TopExp import TopExp_Explorer
from OCP.TopLoc import TopLoc_Location
from OCP.TopoDS import TopoDS, TopoDS_Shape

from app.services.step_loader import BBox


@dataclass
class MeshResult:
    positions: list[float] = field(default_factory=list)
    normals: list[float] = field(default_factory=list)
    indices: list[int] = field(default_factory=list)
    face_ranges: list[dict] = field(default_factory=list)
    edges: list[dict] = field(default_factory=list)
    vertices: list[dict] = field(default_factory=list)


def iter_faces(shape: TopoDS_Shape):
    """Yield (face_id, TopoDS_Face) in the canonical order shared by tessellator + PMI mapping."""
    exp = TopExp_Explorer(shape, TopAbs_FACE)
    i = 0
    while exp.More():
        yield i, TopoDS.Face_s(exp.Current())
        i += 1
        exp.Next()


def iter_edges(shape: TopoDS_Shape):
    """Yield (edge_id, TopoDS_Edge) in the canonical order shared by tessellator + pmi_writer, one per
    underlying TShape (a shared edge is visited once per adjacent face by TopExp_Explorer, so dedupe)."""
    seen = set()
    i = 0
    exp = TopExp_Explorer(shape, TopAbs_EDGE)
    while exp.More():
        edge = TopoDS.Edge_s(exp.Current())
        key = edge.TShape()
        if key not in seen:
            seen.add(key)
            yield i, edge
            i += 1
        exp.Next()


def iter_vertices(shape: TopoDS_Shape):
    """Yield (vertex_id, TopoDS_Vertex) in the canonical order shared by tessellator + pmi_writer, one per
    underlying TShape (a shared vertex is visited once per adjacent edge by TopExp_Explorer, so dedupe)."""
    seen = set()
    i = 0
    exp = TopExp_Explorer(shape, TopAbs_VERTEX)
    while exp.More():
        vertex = TopoDS.Vertex_s(exp.Current())
        key = vertex.TShape()
        if key not in seen:
            seen.add(key)
            yield i, vertex
            i += 1
        exp.Next()


def tessellate(shape: TopoDS_Shape, bbox: BBox) -> MeshResult:
    deflection = max(bbox.diagonal / 800.0, 0.005)
    BRepMesh_IncrementalMesh(shape, deflection, False, 0.4, True)

    res = MeshResult()
    vertex_offset = 0
    index_start = 0
    for face_id, face in iter_faces(shape):
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(face, loc)
        if tri is None:
            res.face_ranges.append({"face_id": face_id, "index_start": index_start, "index_count": 0})
            continue
        trsf = loc.Transformation()
        reversed_face = face.Orientation() == TopAbs_REVERSED
        if not tri.HasNormals():
            # BRepMesh (OCCT 7.6+) stores no normals. Without this every vertex got (0, 0, 1) and the viewer lit
            # every surface as if it faced +Z. ComputeNormals evaluates the exact surface normal at each node's
            # UV (the surface's own sense; reversed faces are flipped below), falling back to the mesh only
            # where the surface normal is undefined (a cone apex, a sphere pole).
            BRepLib_ToolTriangulatedShape.ComputeNormals_s(face, tri)
        has_normals = tri.HasNormals()
        n_nodes = tri.NbNodes()
        for i in range(1, n_nodes + 1):
            p = tri.Node(i).Transformed(trsf)
            res.positions.extend((p.X(), p.Y(), p.Z()))
            if has_normals:
                n = tri.Normal(i)
                nx, ny, nz = n.X(), n.Y(), n.Z()
            else:
                nx, ny, nz = 0.0, 0.0, 1.0
            if reversed_face:
                nx, ny, nz = -nx, -ny, -nz
            res.normals.extend((nx, ny, nz))
        n_tris = tri.NbTriangles()
        for i in range(1, n_tris + 1):
            t = tri.Triangle(i)
            a, b, c = t.Value(1), t.Value(2), t.Value(3)
            if reversed_face:
                b, c = c, b
            res.indices.extend((vertex_offset + a - 1, vertex_offset + b - 1, vertex_offset + c - 1))
        res.face_ranges.append({"face_id": face_id, "index_start": index_start, "index_count": n_tris * 3})
        vertex_offset += n_nodes
        index_start += n_tris * 3

    for edge_id, edge in iter_edges(shape):
        disc = GCPnts_QuasiUniformDeflection(BRepAdaptor_Curve(edge), deflection)
        if not disc.IsDone():
            continue
        pts: list[float] = []
        for i in range(1, disc.NbPoints() + 1):
            p = disc.Value(i)
            pts.extend((p.X(), p.Y(), p.Z()))
        if len(pts) >= 6:
            res.edges.append({"edge_id": edge_id, "points": pts})

    for vertex_id, vertex in iter_vertices(shape):
        p = BRep_Tool.Pnt_s(vertex)
        res.vertices.append({"vertex_id": vertex_id, "point": [p.X(), p.Y(), p.Z()]})
    return res


MESH_MAGIC = b"PMIM"
MESH_VERSION = 1


def pack_mesh(mesh: dict) -> bytes:
    """The mesh as one binary blob for GET /mesh.bin, a third the size of the JSON and no number parsing:

        bytes 0–3   b"PMIM"
        4–7         uint32 version (1)
        8–11        uint32 header length H (a multiple of 4)
        12 … 12+H   UTF-8 JSON header, space-padded: face_ranges, vertices, edges as {edge_id, start, count}
                    (into edge_points, in floats) and buffers as {name: {offset, count, type}}
        then        positions f32 ×3n, normals f32 ×3n, indices u32, edge_points f32, each at its byte offset

    Everything little-endian and 4-byte aligned, so the browser maps the buffers as typed arrays in place."""
    import json

    import numpy as np

    edge_meta, edge_points, start = [], [], 0
    for e in mesh.get("edges") or []:
        pts = e["points"]
        edge_meta.append({"edge_id": e["edge_id"], "start": start, "count": len(pts)})
        edge_points.extend(pts)
        start += len(pts)
    arrays = [("positions", np.asarray(mesh["positions"], "<f4"), "f32"), ("normals", np.asarray(mesh["normals"], "<f4"), "f32"),
              ("indices", np.asarray(mesh["indices"], "<u4"), "u32"), ("edge_points", np.asarray(edge_points, "<f4"), "f32")]
    header = {"version": MESH_VERSION, "face_ranges": mesh["face_ranges"], "vertices": mesh["vertices"], "edges": edge_meta,
              "buffers": {}}

    def encode(h: dict) -> bytes:
        raw = json.dumps(h, separators=(",", ":")).encode()
        return raw + b" " * (-len(raw) % 4)

    # Offsets depend on the header's length, which depends on the offsets: settle it in two passes.
    head = encode(header)
    for _ in range(3):
        offset = 12 + len(head)
        for name, arr, kind in arrays:
            header["buffers"][name] = {"offset": offset, "count": int(arr.size), "type": kind}
            offset += arr.nbytes
        new = encode(header)
        if len(new) == len(head):
            break
        head = new
    head = encode(header)
    assert header["buffers"]["positions"]["offset"] == 12 + len(head), "mesh header did not settle"
    return b"".join([MESH_MAGIC, np.uint32(MESH_VERSION).astype("<u4").tobytes(),
                     np.uint32(len(head)).astype("<u4").tobytes(), head, *(a.tobytes() for _, a, _ in arrays)])
