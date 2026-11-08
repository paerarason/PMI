"""Editing PMI that's already on the model: PUT /api/models/{id}/pmi/{characteristic_id} rewrites the
characteristic's XCAF label in place and re-ingests, so - like the add path in test_pmi_write.py - every
assertion here is a real STEP round trip, not just the request echoing back.

Feature names are deliberately never asserted on: STEPCAFControl_Writer mangles them on write (see
app/services/pmi_writer.py), so they're best-effort labels either way.
"""
import pytest


def pick(body, kind, **match):
    return next(c for c in body["characteristics"] if c["kind"] == kind and all(c[k] == v for k, v in match.items()))


def test_edit_dimension_values(client, demo_model):
    """The plain case: change a dimension's nominal and limits, leaving type and geometry alone."""
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)

    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Diameter", "feature_name": "bore", "nominal": 16.5, "lsl": 16.45, "usl": 16.6},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    assert len(body["characteristics"]) == len(demo_model["characteristics"])  # edited, not added
    assert body["face_count"] == demo_model["face_count"]
    edited = pick(body, "dimension", type_label="Diameter", nominal=16.5)
    assert edited["usl"] == pytest.approx(16.6)
    assert edited["lsl"] == pytest.approx(16.45)
    assert edited["face_ids"] == target["face_ids"]  # geometry kept - no refs sent
    # nothing else moved
    assert pick(body, "dimension", type_label="Diameter", nominal=10.0)["usl"] == pytest.approx(10.05)
    assert not any(c["nominal"] == 16.0 for c in body["characteristics"])


def test_edit_dimension_type_and_refs(client, demo_model):
    """A dimension can change type within its kind and be re-pointed at different geometry."""
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=10.0)
    assert target["face_ids"] != [2, 3]

    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={
            "type_label": "Linear Distance",
            "nominal": 42.0,
            "lsl": 41.9,
            "usl": 42.1,
            "refs": [{"kind": "face", "ref_id": 2}, {"kind": "face", "ref_id": 3}],
        },
    )
    assert r.status_code == 200, r.text
    body = r.json()

    assert len(body["characteristics"]) == len(demo_model["characteristics"])
    edited = pick(body, "dimension", type_label="Linear Distance", nominal=42.0)
    assert edited["face_ids"] == [2, 3]
    assert not any(c["type_label"] == "Diameter" and c["nominal"] == 10.0 for c in body["characteristics"])


def test_edit_geom_tolerance_value_type_and_datums(client, demo_model):
    """A geometric tolerance's zone, type and datum system are all replaced by what's sent - and the
    datum re-link doesn't disturb any other tolerance's datum references."""
    target = pick(demo_model, "geom_tolerance", type_label="Position")
    assert target["datum_refs"] == ["A", "B"]
    untouched = pick(demo_model, "geom_tolerance", type_label="Perpendicularity")
    assert untouched["datum_refs"] == ["A"]

    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Total Runout", "value": 0.33, "datum_refs": ["B"]},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    assert len(body["characteristics"]) == len(demo_model["characteristics"])
    assert {d["label"] for d in body["datums"]} == {d["label"] for d in demo_model["datums"]}
    edited = pick(body, "geom_tolerance", type_label="Total Runout")
    assert edited["usl"] == pytest.approx(0.33)
    assert edited["datum_refs"] == ["B"]
    assert edited["face_ids"] == target["face_ids"]
    assert pick(body, "geom_tolerance", type_label="Perpendicularity")["datum_refs"] == ["A"]
    assert not any(c["type_label"] == "Position" for c in body["characteristics"])


def test_edit_geom_tolerance_can_drop_all_datums(client, demo_model):
    """An empty datum_refs really clears the datum system (rather than keeping what was there), and the
    result still round-trips - Perpendicularity is a MISSING_TOLERANCE_KEYWORDS type, so this also
    exercises the datum-less wrapper-entity patch on an *edited* entity."""
    target = pick(demo_model, "geom_tolerance", type_label="Perpendicularity")
    assert target["datum_refs"] == ["A"]

    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Perpendicularity", "value": 0.09, "datum_refs": []},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    edited = pick(body, "geom_tolerance", type_label="Perpendicularity")
    assert edited["usl"] == pytest.approx(0.09)
    assert edited["datum_refs"] == []


def test_edit_then_add_still_chains(client, demo_model):
    """The real workflow: edit, then add against the model_id the edit returned - both survive."""
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)
    r1 = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Diameter", "nominal": 18.0, "lsl": 17.9, "usl": 18.1},
    )
    assert r1.status_code == 200, r1.text
    m1 = r1.json()

    r2 = client.post(
        f"/api/models/{m1['model_id']}/pmi",
        json={"kind": "geom_tolerance", "type_label": "Cylindricity", "refs": [{"kind": "face", "ref_id": 6}], "value": 0.02},
    )
    assert r2.status_code == 200, r2.text
    m2 = r2.json()

    assert len(m2["characteristics"]) == len(demo_model["characteristics"]) + 1
    assert any(c["type_label"] == "Diameter" and c["nominal"] == 18.0 for c in m2["characteristics"])
    assert any(c["type_label"] == "Cylindricity" and c["usl"] == pytest.approx(0.02) for c in m2["characteristics"])


def test_edit_is_repeatable(client, demo_model):
    """Editing the same characteristic twice in a row lands on the second value, not a duplicate - i.e.
    the xcaf_index handed back by the first edit still addresses it."""
    target = pick(demo_model, "dimension", type_label="Linear Distance", nominal=100.0)
    r1 = client.put(f"/api/models/{demo_model['model_id']}/pmi/{target['id']}", json={"type_label": "Linear Distance", "nominal": 101.0})
    assert r1.status_code == 200, r1.text
    m1 = r1.json()

    again = pick(m1, "dimension", type_label="Linear Distance", nominal=101.0)
    r2 = client.put(f"/api/models/{m1['model_id']}/pmi/{again['id']}", json={"type_label": "Linear Distance", "nominal": 102.0})
    assert r2.status_code == 200, r2.text
    m2 = r2.json()

    assert len(m2["characteristics"]) == len(demo_model["characteristics"])
    assert any(c["nominal"] == 102.0 for c in m2["characteristics"])
    assert not any(c["nominal"] in (100.0, 101.0) for c in m2["characteristics"])


def test_unknown_characteristic_id_rejected(client, demo_model):
    r = client.put(f"/api/models/{demo_model['model_id']}/pmi/C999", json={"type_label": "Diameter", "nominal": 1.0})
    assert r.status_code == 404


def test_unknown_datum_ref_rejected(client, demo_model):
    target = pick(demo_model, "geom_tolerance", type_label="Flatness")
    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Flatness", "value": 0.1, "datum_refs": ["Z"]},
    )
    assert r.status_code == 422
    assert "Z" in r.json()["detail"]


def test_unknown_face_id_rejected(client, demo_model):
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)
    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Diameter", "nominal": 16.0, "refs": [{"kind": "face", "ref_id": 999}]},
    )
    assert r.status_code == 422


def test_wrong_kind_type_label_rejected(client, demo_model):
    """A dimension can't be turned into a geometric tolerance - `kind` isn't editable."""
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)
    r = client.put(f"/api/models/{demo_model['model_id']}/pmi/{target['id']}", json={"type_label": "Flatness", "nominal": 1.0})
    assert r.status_code == 422


def test_geom_tolerance_requires_value(client, demo_model):
    target = pick(demo_model, "geom_tolerance", type_label="Flatness")
    r = client.put(f"/api/models/{demo_model['model_id']}/pmi/{target['id']}", json={"type_label": "Flatness"})
    assert r.status_code == 422


def test_usl_below_lsl_rejected(client, demo_model):
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)
    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Diameter", "nominal": 16.0, "lsl": 16.5, "usl": 15.5},
    )
    assert r.status_code == 422


def test_duplicate_refs_rejected(client, demo_model):
    target = pick(demo_model, "dimension", type_label="Diameter", nominal=16.0)
    r = client.put(
        f"/api/models/{demo_model['model_id']}/pmi/{target['id']}",
        json={"type_label": "Linear Distance", "nominal": 5.0,
              "refs": [{"kind": "face", "ref_id": 3}, {"kind": "face", "ref_id": 3}]},
    )
    assert r.status_code == 422
