"""The 2D drawing sheet (services/drawing.py): exact views, balloons on the PMI, table, SVG and DXF."""
from __future__ import annotations

import re

import pytest

from app.services import drawing


@pytest.fixture
def sheet(client, demo_model):
    r = client.get(f"/api/models/{demo_model['model_id']}/drawing")
    assert r.status_code == 200, r.text
    return r.json()


def test_four_views_with_visible_and_hidden_edges(sheet):
    assert [v["name"] for v in sheet["views"]] == ["front", "top", "right", "iso"]
    for v in sheet["views"]:
        assert v["visible"]
    # the bracket has through holes from above: seen as circles in the top view, hidden lines in the front one
    by = {v["name"]: v for v in sheet["views"]}
    assert by["front"]["hidden"] and by["right"]["hidden"]


def test_views_are_square_to_the_part_and_keep_its_size(sheet, demo_model):
    lo, hi = demo_model["bbox"]["min"], demo_model["bbox"]["max"]
    dx, dy, dz = (hi[i] - lo[i] for i in range(3))
    by = {v["name"]: v for v in sheet["views"]}
    s = sheet["scale"]
    for name, (w, h) in {"front": (dx, dz), "top": (dx, dy), "right": (dy, dz)}.items():
        x0, y0, x1, y1 = by[name]["bounds"]
        assert (x1 - x0) == pytest.approx(w * s, abs=0.1) and (y1 - y0) == pytest.approx(h * s, abs=0.1), name


def test_third_angle_layout(sheet):
    b = {v["name"]: v["bounds"] for v in sheet["views"]}
    assert b["top"][1] > b["front"][3]                       # top above front
    assert b["right"][0] > b["front"][2]                     # right beside it
    assert b["front"][1] == pytest.approx(b["right"][1], abs=0.1)


def test_every_pmi_characteristic_and_datum_gets_a_balloon_and_a_table_row(sheet, demo_model):
    chars = demo_model["characteristics"]
    balloons = [m for m in sheet["marks"] if m["kind"] == "balloon"]
    assert sorted(m["label"] for m in balloons) == sorted(c["id"] for c in chars if c.get("anchor"))
    assert [t["id"] for t in sheet["table"]] == [c["id"] for c in chars]
    assert all(t["requirement"] == c["requirement"] for t, c in zip(sheet["table"], chars))
    assert {m["label"] for m in sheet["marks"] if m["kind"] == "datum"} == {d["label"] for d in demo_model["datums"] if d.get("anchor")}


def test_balloons_do_not_overlap_and_stay_off_the_views(sheet):
    marks = sheet["marks"]
    for i, a in enumerate(marks):
        for b in marks[i + 1:]:
            d = ((a["pos"][0] - b["pos"][0]) ** 2 + (a["pos"][1] - b["pos"][1]) ** 2) ** 0.5
            assert d >= 2 * drawing.BALLOON_R - 0.5, (a["label"], b["label"])
    for m in marks:
        view = next(v for v in sheet["views"] if v["name"] == m["view"])
        x0, y0, x1, y1 = view["bounds"]
        assert not (x0 < m["pos"][0] < x1 and y0 < m["pos"][1] < y1), m["label"]
        assert x0 - 1 <= m["anchor"][0] <= x1 + 1 and y0 - 1 <= m["anchor"][1] <= y1 + 1       # anchor lies on the part


def test_overall_sizes_are_marked_as_measured_not_pmi(sheet):
    assert any("NOT PMI" in n for n in sheet["notes"])
    assert {o["label"] for o in sheet["overall"]} >= {f"{v:.2f}" for v in sheet["title"]["size_mm"][:1]}


def test_svg_has_a_balloon_per_mark_and_dxf_is_well_formed(client, demo_model, sheet):
    mid = demo_model["model_id"]
    svg = client.get(f"/api/models/{mid}/drawing.svg")
    assert svg.headers["content-type"].startswith("image/svg+xml") and svg.text.startswith("<svg")
    assert len(re.findall(r'<g class="balloon">', svg.text)) == sum(m["kind"] == "balloon" for m in sheet["marks"])
    dxf = client.get(f"/api/models/{mid}/drawing.dxf")
    assert "attachment" in dxf.headers["content-disposition"]
    lines = dxf.text.split("\n")
    assert lines[0].strip() == "0" and lines[1] == "SECTION" and lines[-3].strip() == "0" and lines[-2] == "EOF"
    assert dxf.text.count("\nPOLYLINE\n") >= sum(len(v["visible"]) for v in sheet["views"])
    assert dxf.text.count("\nCIRCLE\n") == sum(m["kind"] == "balloon" or m["kind"] == "datum" for m in sheet["marks"])


def test_a_part_with_no_pmi_still_draws(client):
    m = client.post("/api/models/blank?width=60&depth=40&height=20&hole_dia=10").json()
    r = client.get(f"/api/models/{m['model_id']}/drawing").json()
    assert r["marks"] == [] and r["table"] == [] and r["views"][0]["visible"]
