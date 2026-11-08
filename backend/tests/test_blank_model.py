"""Generating a blank AP242 block (geometry only, no PMI) as a starting point for authoring.

Same round-trip philosophy as tests/test_pmi_write.py: the endpoint writes a real STEP file and
re-ingests it, so we assert on what came back through the full extraction pipeline, then confirm the
blank is immediately usable by Add GD&T."""


def test_blank_plain_block(client):
    r = client.post("/api/models/blank", params={"width": 80, "depth": 50, "height": 20})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["face_count"] == 6  # a plain box, six planar faces
    assert body["characteristics"] == []
    assert body["datums"] == []
    assert body["pmi_source"] == "none"


def test_blank_with_hole_adds_cylindrical_face(client):
    r = client.post("/api/models/blank", params={"width": 80, "depth": 50, "height": 20, "hole_dia": 10})
    assert r.status_code == 200, r.text
    assert r.json()["face_count"] == 7  # six planar + one cylindrical


def test_blank_supports_add_pmi(client):
    """The whole point of a blank: Add GD&T works on it exactly like an uploaded model."""
    m = client.post("/api/models/blank", params={"width": 80, "depth": 50, "height": 20}).json()
    payload = {
        "kind": "dimension",
        "type_label": "Linear Distance",
        "feature_name": "overall width",
        "refs": [{"kind": "face", "ref_id": 0}, {"kind": "face", "ref_id": 1}],
        "nominal": 80.0,
        "usl": 80.1,
        "lsl": 79.9,
    }
    r = client.post(f"/api/models/{m['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    assert len(r.json()["characteristics"]) == 1


def test_blank_rejects_bad_dimensions(client):
    assert client.post("/api/models/blank", params={"width": 0, "depth": 50, "height": 20}).status_code == 400
    assert client.post("/api/models/blank", params={"width": 80, "depth": 50, "height": -5}).status_code == 400


def test_blank_rejects_oversized_hole(client):
    r = client.post("/api/models/blank", params={"width": 80, "depth": 50, "height": 20, "hole_dia": 50})
    assert r.status_code == 400


def test_pmi_types_are_all_authorable(client):
    """The Add-GD&T dropdown is populated from this endpoint; every label it returns must actually
    round-trip through the writer (no read-only markers like 'Linear Size' / 'Common Label')."""
    from app.services.pmi_writer import DIM_TYPE_BY_LABEL, TOL_TYPE_BY_LABEL, _dim_type_enum, _tol_type_enum

    body = client.get("/api/models/pmi/types").json()
    assert body["dimension"] and body["geom_tolerance"]
    assert "Linear Size" not in body["dimension"]
    for label in body["dimension"]:
        _dim_type_enum(DIM_TYPE_BY_LABEL[label])  # raises PmiWriteError if not writable
    for label in body["geom_tolerance"]:
        _tol_type_enum(TOL_TYPE_BY_LABEL[label])
