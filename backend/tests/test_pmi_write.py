"""Authoring new GD&T PMI onto a loaded model: round-trips through the STEP file itself (not the DB),
same pattern as tests/test_metadata.py - POST, then re-ingest the response and confirm both the new
characteristic and everything already in the file survive."""


def test_add_dimension_round_trips(client, demo_model):
    payload = {
        "kind": "dimension",
        "type_label": "Radius",
        "feature_name": "fillet radius",
        "refs": [{"kind": "face", "ref_id": 3}],
        "nominal": 4.0,
        "usl": 4.05,
        "lsl": 3.95,
    }
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert len(body["characteristics"]) == len(demo_model["characteristics"]) + 1
    assert body["face_count"] == demo_model["face_count"]

    new = next(c for c in body["characteristics"] if c["type_label"] == "Radius")
    assert new["kind"] == "dimension"
    assert new["nominal"] == 4.0
    assert new["usl"] == 4.05
    assert new["lsl"] == 3.95
    assert new["face_ids"] == [3]


def _sig(c):
    return (c["kind"], c["type_label"], c["nominal"], c["usl"], c["lsl"], tuple(c["face_ids"]), tuple(c["datum_refs"]))


def _new_ones(before, after):
    before_sigs = {_sig(c) for c in before["characteristics"]}
    return [c for c in after["characteristics"] if _sig(c) not in before_sigs]


def test_add_geom_tolerance_with_existing_datum_round_trips(client, demo_model):
    """Exercises a MISSING_TOLERANCE_KEYWORDS type (Perpendicularity) so the wrapper-entity patch path
    runs, referencing a datum ("A") already present in the source file.

    Doesn't assert on feature_name: STEPCAFControl_Writer mangles a GeomTolerance's semantic name on
    write (a pre-existing characteristic of this app's PMI authoring - see app/services/pmi_writer.py),
    so it's only ever a best-effort label, not something guaranteed to round-trip verbatim."""
    datum_labels = {d["label"] for d in demo_model["datums"]}
    assert "A" in datum_labels

    payload = {
        "kind": "geom_tolerance",
        "type_label": "Perpendicularity",
        "feature_name": "extra squareness",
        "refs": [{"kind": "face", "ref_id": 3}],
        "value": 0.15,
        "datum_refs": ["A"],
    }
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert len(body["characteristics"]) == len(demo_model["characteristics"]) + 1
    assert body["face_count"] == demo_model["face_count"]
    assert {d["label"] for d in body["datums"]} == datum_labels

    new = [c for c in _new_ones(demo_model, body) if c["type_label"] == "Perpendicularity" and c["usl"] == 0.15]
    assert len(new) == 1, body["characteristics"]
    assert new[0]["kind"] == "geom_tolerance"
    assert new[0]["datum_refs"] == ["A"]
    assert new[0]["face_ids"] == [3]


def test_add_geom_tolerance_without_datum_round_trips(client, demo_model):
    """A MISSING_TOLERANCE_KEYWORDS type with no datum ref - the true "OCCT drops the wrapper entity"
    case; confirms the injected complex-entity patch is valid AP242 (re-parses successfully)."""
    payload = {
        "kind": "geom_tolerance",
        "type_label": "Symmetry",
        "feature_name": "no datum symmetry",
        "refs": [{"kind": "face", "ref_id": 2}],
        "value": 0.3,
    }
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    new = [c for c in _new_ones(demo_model, body) if c["type_label"] == "Symmetry"]
    assert len(new) == 1, body["characteristics"]
    assert new[0]["usl"] == 0.3
    assert new[0]["datum_refs"] == []


def test_add_geom_tolerance_on_edge_round_trips(client, demo_model):
    """A characteristic can reference an edge instead of a face (verified in app/services/pmi_writer.py):
    it round-trips with correct type/value, just with an empty face_ids (not anchored to the edge
    visually yet - see that module's docstring for the read-side gap)."""
    payload = {
        "kind": "geom_tolerance",
        "type_label": "Straightness",
        "feature_name": "edge straightness",
        "refs": [{"kind": "edge", "ref_id": 0}],
        "value": 0.05,
    }
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert len(body["characteristics"]) == len(demo_model["characteristics"]) + 1
    new = [c for c in _new_ones(demo_model, body) if c["type_label"] == "Straightness"]
    assert len(new) == 1, body["characteristics"]
    assert new[0]["usl"] == 0.05
    assert new[0]["face_ids"] == []


def test_add_geom_tolerance_on_vertex_round_trips(client, demo_model):
    """A characteristic can reference a vertex too - same deal as an edge (correct data, not anchored
    visually yet)."""
    payload = {
        "kind": "geom_tolerance",
        "type_label": "Position",
        "feature_name": "vertex position",
        "refs": [{"kind": "vertex", "ref_id": 0}],
        "value": 0.1,
    }
    r = client.post(f"/api/models/{demo_model['model_id']}/pmi", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert len(body["characteristics"]) == len(demo_model["characteristics"]) + 1
    new = [c for c in _new_ones(demo_model, body) if c["type_label"] == "Position" and c["usl"] == 0.1]
    assert len(new) == 1, body["characteristics"]
    assert new[0]["face_ids"] == []


def test_unknown_vertex_id_rejected(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Position", "refs": [{"kind": "vertex", "ref_id": 999}], "value": 0.1},
    )
    assert r.status_code == 422


def test_add_pmi_chains_across_calls(client, demo_model):
    """Adding twice in a row (each against the model_id the previous call returned) keeps accumulating,
    not losing earlier additions - the real frontend workflow."""
    r1 = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "dimension", "type_label": "Radius", "feature_name": "r1", "refs": [{"kind": "face", "ref_id": 3}], "nominal": 2.0},
    )
    assert r1.status_code == 200, r1.text
    m1 = r1.json()

    r2 = client.post(
        f"/api/models/{m1['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Coaxiality", "feature_name": "c1", "refs": [{"kind": "face", "ref_id": 6}],
              "value": 0.1, "datum_refs": ["A"]},
    )
    assert r2.status_code == 200, r2.text
    m2 = r2.json()

    assert len(m2["characteristics"]) == len(demo_model["characteristics"]) + 2
    assert any(c["type_label"] == "Radius" and c["nominal"] == 2.0 for c in m2["characteristics"])
    assert any(c["type_label"] == "Coaxiality" and c["usl"] == 0.1 and c["datum_refs"] == ["A"] for c in m2["characteristics"])


def test_unknown_datum_ref_rejected(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Flatness", "refs": [{"kind": "face", "ref_id": 2}], "value": 0.1,
              "datum_refs": ["Z"]},
    )
    assert r.status_code == 422
    assert "Z" in r.json()["detail"]


def test_unknown_face_id_rejected(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "dimension", "type_label": "Radius", "refs": [{"kind": "face", "ref_id": 999}], "nominal": 1.0},
    )
    assert r.status_code == 422


def test_unknown_edge_id_rejected(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Straightness", "refs": [{"kind": "edge", "ref_id": 999}], "value": 0.1},
    )
    assert r.status_code == 422


def test_duplicate_refs_rejected(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "dimension", "type_label": "Linear Distance", "refs": [{"kind": "face", "ref_id": 3}, {"kind": "face", "ref_id": 3}], "nominal": 1.0},
    )
    assert r.status_code == 422


def test_geom_tolerance_requires_value(client, demo_model):
    r = client.post(
        f"/api/models/{demo_model['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Flatness", "refs": [{"kind": "face", "ref_id": 2}]},
    )
    assert r.status_code == 422


def test_download_file(client, demo_model):
    r = client.get(f"/api/models/{demo_model['model_id']}/file")
    assert r.status_code == 200
    assert r.content[:10] == b"ISO-10303-"
    assert "attachment" in r.headers["content-disposition"]


def test_comprehensive_sample_survives_one_more_addition(client):
    """Regression for the name-based/datum-scoped patch pass: a file that already exercises all 15
    tolerance types + 4 datums must keep every original characteristic after one more addition."""
    r = client.post("/api/models/samples/comprehensive_pmi.step")
    assert r.status_code == 200, r.text
    before = r.json()

    r2 = client.post(
        f"/api/models/{before['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Total Runout", "feature_name": "extra runout",
              "refs": [{"kind": "face", "ref_id": (before["characteristics"][0]["face_ids"][:1] or [0])[0]}], "value": 0.08,
              "datum_refs": [before["datums"][0]["label"]]},
    )
    assert r2.status_code == 200, r2.text
    after = r2.json()
    assert len(after["characteristics"]) == len(before["characteristics"]) + 1
    assert {d["label"] for d in after["datums"]} == {d["label"] for d in before["datums"]}
    assert any(c["type_label"] == "Total Runout" and c["usl"] == 0.08 for c in _new_ones(before, after))


def test_pmi_writes_are_blocked_on_a_drawing_not_in_mm(client, demo_model):
    """OCCT's writer would rewrite every other characteristic's inch value as mm (NIST STC-06), so add and
    edit refuse rather than corrupt the drawing."""
    import dataclasses
    from app.store import store

    rec = store.get(demo_model["model_id"])
    inch = dataclasses.replace(rec, model_id=rec.model_id + "-in",
                               characteristics=[dict(c, unit="in") for c in rec.characteristics])
    store.put(inch)
    payload = {"kind": "geom_tolerance", "type_label": "Flatness", "refs": [{"kind": "face", "ref_id": 0}], "value": 0.05}
    r = client.post(f"/api/models/{inch.model_id}/pmi", json=payload)
    assert r.status_code == 422 and "in mm" in r.json()["detail"]
    tol = next(c for c in inch.characteristics if c["kind"] == "geom_tolerance" and c.get("xcaf_index"))
    r = client.put(f"/api/models/{inch.model_id}/pmi/{tol['id']}",
                   json={"type_label": tol["type_label"], "value": 0.3, "refs": [], "datum_refs": tol["datum_refs"]})
    assert r.status_code == 422 and "in mm" in r.json()["detail"]
