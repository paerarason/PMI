"""GET /mesh.bin carries the same mesh as GET /mesh (tessellator.pack_mesh, frontend api.parseMesh)."""
import json
import struct

import numpy as np


def _parse(blob: bytes) -> dict:
    """What the browser does (frontend/src/api.ts parseMesh)."""
    assert blob[:4] == b"PMIM" and struct.unpack("<I", blob[4:8])[0] == 1
    n = struct.unpack("<I", blob[8:12])[0]
    assert n % 4 == 0
    head = json.loads(blob[12:12 + n])
    b = head["buffers"]

    def arr(name, dtype):
        assert b[name]["offset"] % 4 == 0
        return np.frombuffer(blob, dtype, b[name]["count"], b[name]["offset"])

    pts = arr("edge_points", "<f4")
    return {"positions": arr("positions", "<f4"), "normals": arr("normals", "<f4"), "indices": arr("indices", "<u4"),
            "face_ranges": head["face_ranges"], "vertices": head["vertices"],
            "edges": [{"edge_id": e["edge_id"], "points": pts[e["start"]:e["start"] + e["count"]]} for e in head["edges"]]}


def test_binary_mesh_equals_the_json_mesh(client, demo_model):
    mid = demo_model["model_id"]
    js = client.get(f"/api/models/{mid}/mesh").json()
    r = client.get(f"/api/models/{mid}/mesh.bin")
    assert r.status_code == 200 and r.headers["content-type"] == "application/octet-stream"
    bm = _parse(r.content)
    assert np.allclose(bm["positions"], js["positions"], atol=1e-4) and np.allclose(bm["normals"], js["normals"], atol=1e-6)
    assert bm["indices"].tolist() == js["indices"]
    assert bm["face_ranges"] == js["face_ranges"] and bm["vertices"] == js["vertices"]
    assert [e["edge_id"] for e in bm["edges"]] == [e["edge_id"] for e in js["edges"]]
    assert all(np.allclose(a["points"], b["points"], atol=1e-4) for a, b in zip(bm["edges"], js["edges"]))
    assert len(r.content) < len(json.dumps(js)) / 2


def test_large_responses_are_compressed(client, demo_model):
    r = client.get(f"/api/models/{demo_model['model_id']}/mesh", headers={"Accept-Encoding": "gzip"})
    assert r.headers.get("content-encoding") == "gzip"
