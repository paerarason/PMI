"""A 2D drawing sheet of the 3D part: orthographic views, balloons for the PMI, and a characteristics table.

Everything comes from the STEP file:

* **Views** are exact hidden-line removal on the B-rep (OpenCASCADE HLR), not a picture of the mesh: front, top and
  right in third-angle layout, plus an isometric. Visible edges are solid, hidden edges dashed, tangent (smooth)
  edges thin.
* **Balloons** number each dimension and geometric tolerance of the PMI with the same id the 3D view shows. A
  balloon goes in the view that looks most squarely at the face the characteristic is attached to, with a leader
  to its anchor point. Datums get a boxed letter in the same way.
* **Overall sizes** (length, width, height) are measured from the geometry. They are drawn grey and labelled as
  such: they are not PMI, and the sheet never presents them as a requirement.
* **Table** lists every characteristic's requirement as the file states it. Nothing is inferred or added.

Sheet coordinates are millimetres with the origin at the bottom left (y up), as in DXF. `to_svg` flips y.
"""
from __future__ import annotations

import math
from html import escape

from OCP.BRepAdaptor import BRepAdaptor_Curve
from OCP.GCPnts import GCPnts_QuasiUniformDeflection
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt
from OCP.HLRAlgo import HLRAlgo_Projector
from OCP.HLRBRep import HLRBRep_Algo, HLRBRep_HLRToShape
from OCP.TopAbs import TopAbs_EDGE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS

# name → (direction towards the viewer, screen "right")
_VIEWS = {
    "front": ((0.0, -1.0, 0.0), (1.0, 0.0, 0.0)),
    "top": ((0.0, 0.0, 1.0), (1.0, 0.0, 0.0)),
    "right": ((1.0, 0.0, 0.0), (0.0, 1.0, 0.0)),
    "iso": ((1.0, -1.0, 0.8), (1.0, 1.0, 0.0)),
}
_TITLES = {"front": "FRONT", "top": "TOP", "right": "RIGHT", "iso": "ISOMETRIC"}
BALLOON_R = 4.0
ROW_H = 6.0
TABLE_W = 112.0
SHEET_H = 297.0
LEFT_W = 300.0
TITLE_H = 34.0
MARGIN = 10.0
RING = 18.0                # balloons stand this far outside a view's outline, clear of its dimension lines
TITLE_DY = 12.5            # view title, below the balloon ring


def _unit(v):
    n = math.sqrt(sum(c * c for c in v))
    return tuple(c / n for c in v)


def _cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def _dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def _frame(name: str):
    n, x = _VIEWS[name]
    n = _unit(n)
    x = _unit(x)
    x = _unit(tuple(x[i] - _dot(x, n) * n[i] for i in range(3)))        # screen-right, square to the view direction
    y = _cross(n, x)
    return n, x, y


def _project(p, frame):
    _, x, y = frame
    return (_dot(p, x), _dot(p, y))


def _polylines(compound, deflection: float) -> list[list[list[float]]]:
    out = []
    if compound is None or compound.IsNull():
        return out
    exp = TopExp_Explorer(compound, TopAbs_EDGE)
    while exp.More():
        edge = TopoDS.Edge_s(exp.Current())
        exp.Next()
        try:
            curve = BRepAdaptor_Curve(edge)
            u0, u1 = curve.FirstParameter(), curve.LastParameter()
            if not (math.isfinite(u0) and math.isfinite(u1)):
                continue
            samp = GCPnts_QuasiUniformDeflection(curve, deflection)
            if samp.IsDone() and samp.NbPoints() >= 2:
                pts = [samp.Value(i + 1) for i in range(samp.NbPoints())]
            else:
                pts = [curve.Value(u0), curve.Value(u1)]
            line = [[round(p.X(), 4), round(p.Y(), 4)] for p in pts]
            if len(line) >= 2:
                out.append(line)
        except Exception:    # noqa: BLE001 - one bad edge must not lose the view
            continue
    return out


def project_view(shape, name: str, deflection: float) -> dict:
    """Exact hidden-line removal for one view: {'visible', 'hidden', 'smooth'} as 2D polylines in model mm."""
    n, x, _y = _frame(name)
    ax = gp_Ax2(gp_Pnt(0, 0, 0), gp_Dir(*n), gp_Dir(*x))
    algo = HLRBRep_Algo()
    algo.Add(shape)
    algo.Projector(HLRAlgo_Projector(ax))
    algo.Update()
    algo.Hide()
    conv = HLRBRep_HLRToShape(algo)
    visible = _polylines(conv.VCompound(), deflection) + _polylines(conv.OutLineVCompound(), deflection)
    smooth = _polylines(conv.Rg1LineVCompound(), deflection)
    hidden = _polylines(conv.HCompound(), deflection) + _polylines(conv.OutLineHCompound(), deflection)
    return {"visible": visible, "smooth": smooth, "hidden": hidden}


def _bounds(view: dict):
    pts = [p for k in ("visible", "smooth") for line in view[k] for p in line]
    if not pts:
        pts = [p for line in view["hidden"] for p in line] or [[0.0, 0.0]]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def _pick_view(c: dict, centre) -> str:
    """The orthographic view that looks most squarely at the face this characteristic is attached to."""
    a = c.get("anchor")
    if not a:
        return "front"
    lp = c.get("label_pos")
    d = [lp[i] - a[i] for i in range(3)] if lp else [a[i] - centre[i] for i in range(3)]
    if math.sqrt(_dot(d, d)) < 1e-9:
        return "front"
    d = _unit(d)
    return max(("front", "top", "right"), key=lambda v: _dot(d, _unit(_VIEWS[v][0])))


def _layout(bbox: dict, table_blocks: int) -> dict:
    """Third-angle layout: top above front, right beside it, the isometric in the free corner. One scale for the
    three orthographic views; the gaps are fixed in sheet millimetres so titles, dimensions and balloons fit."""
    lo, hi = bbox["min"], bbox["max"]
    dx, dy, dz = (max(hi[i] - lo[i], 1e-6) for i in range(3))
    gap = 46.0
    x0, y0 = MARGIN + 30.0, MARGIN + TITLE_H + 28.0
    area_w = LEFT_W - MARGIN - 8.0 - x0
    area_h = SHEET_H - MARGIN - 8.0 - y0
    scale = min((area_w - gap) / (dx + dy), (area_h - gap) / (dz + dy))
    scale = scale if scale > 0 else 1.0
    rx, ty = x0 + dx * scale + gap, y0 + dz * scale + gap
    iso = (rx, ty, LEFT_W - MARGIN - 8.0 - rx, SHEET_H - MARGIN - 8.0 - ty)
    return {"scale": scale, "front": (x0, y0), "top": (x0, ty), "right": (rx, y0), "iso_cell": iso,
            "table_blocks": table_blocks}


def build_drawing(shape, rec: dict) -> dict:
    """`rec`: the model summary (bbox, characteristics, datums, part_name, file_name, schema)."""
    bbox = rec["bbox"]
    lo, hi = bbox["min"], bbox["max"]
    diag = math.dist(lo, hi) or 1.0
    deflection = max(0.01, diag * 0.0004)
    centre = [(lo[i] + hi[i]) / 2 for i in range(3)]
    raw = {name: project_view(shape, name, deflection) for name in _VIEWS}
    chars = [c for c in rec["characteristics"]]
    blocks = max(1, math.ceil(len(chars) / 36))
    lay = _layout(bbox, blocks)
    s = lay["scale"]
    sheet_w = LEFT_W + blocks * TABLE_W + MARGIN
    placed = {}
    # a view sits with its lower-left corner on its slot; model bounds give the offset
    for name in ("front", "top", "right"):
        bx0, by0, bx1, by1 = _bounds(raw[name])
        ox, oy = lay[name]
        placed[name] = {"off": (ox - bx0 * s, oy - by0 * s), "scale": s, "bounds": (ox, oy, ox + (bx1 - bx0) * s, oy + (by1 - by0) * s)}
    ix, iy, iw, ih = lay["iso_cell"]
    bx0, by0, bx1, by1 = _bounds(raw["iso"])
    si = min(iw / max(bx1 - bx0, 1e-6), ih / max(by1 - by0, 1e-6)) * 0.85
    si = min(si, s * 1.5)
    ox = ix + (iw - (bx1 - bx0) * si) / 2
    oy = iy + (ih - (by1 - by0) * si) / 2
    placed["iso"] = {"off": (ox - bx0 * si, oy - by0 * si), "scale": si,
                     "bounds": (ox, oy, ox + (bx1 - bx0) * si, oy + (by1 - by0) * si)}

    def to_sheet(name, p):
        (ox_, oy_), sc = placed[name]["off"], placed[name]["scale"]
        return [round(p[0] * sc + ox_, 3), round(p[1] * sc + oy_, 3)]

    views = []
    for name in _VIEWS:
        v = raw[name]
        views.append({"name": name, "title": _TITLES[name], "scale": round(placed[name]["scale"], 4),
                      "bounds": [round(c, 2) for c in placed[name]["bounds"]],
                      **{k: [[to_sheet(name, p) for p in line] for line in v[k]] for k in ("visible", "smooth", "hidden")}})

    # --- balloons and datum flags ---------------------------------------------------------------------------
    marks = []
    for c in chars:
        if c.get("anchor"):
            marks.append(("balloon", c["id"], c, _pick_view(c, centre)))
    for d in rec.get("datums") or []:
        if d.get("anchor"):
            marks.append(("datum", d["label"], d, _pick_view({"anchor": d["anchor"], "label_pos": d.get("label_pos")}, centre)))
    items = []
    for kind, label, src, vname in marks:
        frame = _frame(vname)
        ax, ay = to_sheet(vname, _project(src["anchor"], frame))
        bx0, by0, bx1, by1 = placed[vname]["bounds"]
        cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2
        dx_, dy_ = ax - cx, ay - cy
        n = math.hypot(dx_, dy_)
        ux, uy = (dx_ / n, dy_ / n) if n > 1e-6 else (0.0, 1.0)
        # out along the ray from the view's centre until it clears the outline, then a little more
        t = 0.0
        hw, hh = (bx1 - bx0) / 2 + RING, (by1 - by0) / 2 + RING
        tx = hw / abs(ux) if abs(ux) > 1e-6 else math.inf
        ty = hh / abs(uy) if abs(uy) > 1e-6 else math.inf
        t = min(tx, ty)
        items.append({"kind": kind, "label": label, "view": vname, "anchor": [ax, ay],
                      "pos": [cx + ux * t, cy + uy * t], "rect": (bx0 - RING, by0 - RING, bx1 + RING, by1 + RING)})
    _relax(items)
    # --- overall sizes (geometry, not PMI) -------------------------------------------------------------------
    dx, dy, dz = (hi[i] - lo[i] for i in range(3))
    overall = [
        {"view": "front", "axis": "x", "value": dx, "label": f"{dx:.2f}"},
        {"view": "front", "axis": "y", "value": dz, "label": f"{dz:.2f}"},
        {"view": "right", "axis": "x", "value": dy, "label": f"{dy:.2f}"},
    ]
    for o in overall:
        bx0, by0, bx1, by1 = placed[o["view"]]["bounds"]
        o["line"] = ([bx0, by0 - 7.0, bx1, by0 - 7.0] if o["axis"] == "x" else [bx0 - 7.0, by0, bx0 - 7.0, by1])
        o["ext"] = ([[bx0, by0 - 1.0, bx0, by0 - 9.0], [bx1, by0 - 1.0, bx1, by0 - 9.0]] if o["axis"] == "x"
                    else [[bx0 - 1.0, by0, bx0 - 9.0, by0], [bx0 - 1.0, by1, bx0 - 9.0, by1]])
    table = [{"id": c["id"], "feature": c.get("feature_name") or c["type_label"], "type": c["type_label"],
              "requirement": c["requirement"], "datums": c.get("datum_refs") or [], "unit": c.get("unit") or "mm",
              "placed": bool(c.get("anchor"))} for c in chars]
    notes = ["DIMENSIONS IN MM UNLESS STATED. THIRD-ANGLE PROJECTION.",
             "BALLOONS AND TABLE: PMI READ FROM THE STEP FILE. GREY SIZES: MEASURED FROM THE GEOMETRY, NOT PMI.",
             "GENERATED FROM THE 3D MODEL. NOT A RELEASED DRAWING."]
    return {"sheet": {"width": sheet_w, "height": SHEET_H, "left_width": LEFT_W, "table_blocks": blocks},
            "views": views, "marks": [{k: v for k, v in it.items() if k != "rect"} for it in items], "overall": overall,
            "table": table, "notes": notes, "scale": round(s, 4),
            "title": {"part": rec.get("part_name") or rec.get("file_name"), "file": rec.get("file_name"),
                      "schema": rec.get("schema"), "size_mm": [round(dx, 3), round(dy, 3), round(dz, 3)],
                      "characteristics": len(chars)}}


def _relax(items: list[dict], iterations: int = 60) -> None:
    """Push balloons apart so none overlaps another, keeping each outside its view's outline."""
    gap = 2 * BALLOON_R + 1.5
    for _ in range(iterations):
        moved = False
        for i, a in enumerate(items):
            for b in items[i + 1:]:
                dx, dy = b["pos"][0] - a["pos"][0], b["pos"][1] - a["pos"][1]
                d = math.hypot(dx, dy)
                if d < gap:
                    ux, uy = (dx / d, dy / d) if d > 1e-6 else (1.0, 0.0)
                    push = (gap - d) / 2 + 0.01
                    a["pos"][0] -= ux * push
                    a["pos"][1] -= uy * push
                    b["pos"][0] += ux * push
                    b["pos"][1] += uy * push
                    moved = True
        for it in items:
            it["pos"][0] = min(max(it["pos"][0], MARGIN + BALLOON_R + 2.0), LEFT_W - MARGIN - BALLOON_R)
            it["pos"][1] = min(max(it["pos"][1], MARGIN + TITLE_H + BALLOON_R + 3.0), SHEET_H - MARGIN - BALLOON_R - 2.0)
            x0, y0, x1, y1 = it["rect"]
            x, y = it["pos"]
            if x0 < x < x1 and y0 < y < y1:                       # slid inside the outline: out through the nearest side
                gaps = {"l": x - x0, "r": x1 - x, "b": y - y0, "t": y1 - y}
                side = min(gaps, key=gaps.get)
                it["pos"] = [x0 if side == "l" else x1 if side == "r" else x,
                             y0 if side == "b" else y1 if side == "t" else y]
                moved = True
        if not moved:
            break
    # Clamping to the sheet can undo a push sideways; whatever still overlaps is stacked upwards.
    for _ in range(40):
        clash = False
        for i, a in enumerate(items):
            for b in items[i + 1:]:
                if math.hypot(b["pos"][0] - a["pos"][0], b["pos"][1] - a["pos"][1]) < gap - 0.2:
                    b["pos"][1] += gap
                    clash = True
        if not clash:
            break


def _ratio(scale: float) -> str:
    """'2:1', '1:5' … for a drawing scale."""
    return f"{scale:.3g}:1" if scale >= 1 else f"1:{1 / scale:.3g}"


# --- SVG ---------------------------------------------------------------------------------------------------

def to_svg(d: dict) -> str:
    W, H = d["sheet"]["width"], d["sheet"]["height"]
    Y = lambda y: round(H - y, 3)       # noqa: E731
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:g} {H:g}" width="{W:g}mm" height="{H:g}mm" '
           'font-family="DejaVu Sans, Arial, Helvetica, sans-serif">',
           f'<rect width="{W:g}" height="{H:g}" fill="#ffffff"/>',
           f'<rect x="{MARGIN - 4}" y="{MARGIN - 4}" width="{W - 2 * MARGIN + 8:g}" height="{H - 2 * MARGIN + 8:g}" fill="none" stroke="#111" stroke-width="0.5"/>']

    def poly(line):
        return " ".join(f"{p[0]:.2f},{Y(p[1])}" for p in line)

    for v in d["views"]:
        out.append(f'<g id="view-{v["name"]}">')
        for line in v["smooth"]:
            out.append(f'<polyline points="{poly(line)}" fill="none" stroke="#555" stroke-width="0.15"/>')
        for line in v["hidden"]:
            out.append(f'<polyline points="{poly(line)}" fill="none" stroke="#777" stroke-width="0.18" stroke-dasharray="1.6 1"/>')
        for line in v["visible"]:
            out.append(f'<polyline points="{poly(line)}" fill="none" stroke="#111" stroke-width="0.35" stroke-linecap="round"/>')
        x0, y0, x1, _y1 = v["bounds"]
        out.append(f'<text x="{(x0 + x1) / 2:.2f}" y="{Y(y0 - TITLE_DY)}" font-size="3.4" text-anchor="middle" fill="#111" stroke="#fff" stroke-width="1.4" paint-order="stroke">'
                   f'{v["title"]}  (scale {_ratio(v["scale"])})</text></g>')
    for o in d["overall"]:
        x0, y0, x1, y1 = o["line"]
        out.append('<g stroke="#7a7a7a" stroke-width="0.2" fill="#7a7a7a">')
        for e in o["ext"]:
            out.append(f'<line x1="{e[0]:.2f}" y1="{Y(e[1])}" x2="{e[2]:.2f}" y2="{Y(e[3])}"/>')
        out.append(f'<line x1="{x0:.2f}" y1="{Y(y0)}" x2="{x1:.2f}" y2="{Y(y1)}"/>')
        for (px, py, qx, qy) in ((x0, y0, x1, y1), (x1, y1, x0, y0)):
            L = math.hypot(qx - px, qy - py) or 1.0
            ux, uy = (qx - px) / L, (qy - py) / L
            out.append(f'<polygon stroke="none" points="{px:.2f},{Y(py)} {px + ux * 2.2 - uy * 0.7:.2f},{Y(py + uy * 2.2 + ux * 0.7)} '
                       f'{px + ux * 2.2 + uy * 0.7:.2f},{Y(py + uy * 2.2 - ux * 0.7)}"/>')
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        if o["axis"] == "x":
            out.append(f'<text x="{mx:.2f}" y="{Y(my - 1.2)}" font-size="2.8" text-anchor="middle" stroke="#fff" stroke-width="0.5" paint-order="stroke">{o["label"]}</text>')
        else:
            out.append(f'<text transform="translate({mx - 1.2:.2f} {Y(my)}) rotate(-90)" font-size="2.8" text-anchor="middle" stroke="#fff" stroke-width="0.5" paint-order="stroke">{o["label"]}</text>')
        out.append("</g>")
    for m in d["marks"]:
        (ax, ay), (bx, by) = m["anchor"], m["pos"]
        L = math.hypot(bx - ax, by - ay) or 1.0
        r = BALLOON_R
        ex, ey = bx - (bx - ax) / L * r, by - (by - ay) / L * r
        out.append(f'<g class="{m["kind"]}"><line x1="{ax:.2f}" y1="{Y(ay)}" x2="{ex:.2f}" y2="{Y(ey)}" stroke="#c2410c" stroke-width="0.25"/>'
                   f'<circle cx="{ax:.2f}" cy="{Y(ay)}" r="0.7" fill="#c2410c"/>')
        if m["kind"] == "datum":
            out.append(f'<rect x="{bx - 3:.2f}" y="{Y(by) - 3:.2f}" width="6" height="6" fill="#fff" stroke="#1d4ed8" stroke-width="0.4"/>'
                       f'<text x="{bx:.2f}" y="{Y(by) + 1.4:.2f}" font-size="4" text-anchor="middle" font-weight="700" fill="#1d4ed8">{escape(str(m["label"]))}</text></g>')
        else:
            txt = escape(str(m["label"]))
            size = 3.4 if len(txt) <= 2 else 2.6
            out.append(f'<circle cx="{bx:.2f}" cy="{Y(by)}" r="{r}" fill="#fff" stroke="#c2410c" stroke-width="0.4"/>'
                       f'<text x="{bx:.2f}" y="{Y(by) + size * 0.35:.2f}" font-size="{size}" text-anchor="middle" font-weight="700" fill="#c2410c">{txt}</text></g>')
    # characteristics table
    rows = d["table"]
    per = 36
    for b in range(d["sheet"]["table_blocks"]):
        x = d["sheet"]["left_width"] + b * TABLE_W
        top = H - MARGIN - 6.0
        out.append(f'<g font-size="2.6" fill="#111"><rect x="{x:.1f}" y="{MARGIN:.1f}" width="{TABLE_W - 6:.1f}" height="{H - 2 * MARGIN:.1f}" fill="none" stroke="#111" stroke-width="0.3"/>')
        out.append(f'<text x="{x + 2:.1f}" y="{MARGIN + 5:.1f}" font-weight="700">#</text><text x="{x + 14:.1f}" y="{MARGIN + 5:.1f}" font-weight="700">CHARACTERISTIC</text>'
                   f'<text x="{x + 60:.1f}" y="{MARGIN + 5:.1f}" font-weight="700">REQUIREMENT</text>')
        for i, r in enumerate(rows[b * per:(b + 1) * per]):
            yy = MARGIN + 5 + ROW_H * (i + 1)
            out.append(f'<line x1="{x:.1f}" y1="{yy - 4:.1f}" x2="{x + TABLE_W - 6:.1f}" y2="{yy - 4:.1f}" stroke="#bbb" stroke-width="0.15"/>')
            out.append(f'<text x="{x + 2:.1f}" y="{yy:.1f}" font-weight="700" fill="#c2410c">{escape(str(r["id"]))}</text>'
                       f'<text x="{x + 14:.1f}" y="{yy:.1f}">{escape(str(r["feature"])[:24])}</text>'
                       f'<text x="{x + 60:.1f}" y="{yy:.1f}">{escape(str(r["requirement"])[:30])}</text>')
        out.append("</g>")
    # title block + notes
    t = d["title"]
    tb_w = d["sheet"]["left_width"] - 2 * MARGIN
    out.append(f'<g font-size="2.7" fill="#111"><rect x="{MARGIN}" y="{H - MARGIN - TITLE_H}" width="{tb_w}" height="{TITLE_H}" fill="none" stroke="#111" stroke-width="0.4"/>')
    out.append(f'<text x="{MARGIN + 3}" y="{H - MARGIN - TITLE_H + 7}" font-size="5" font-weight="700">{escape(str(t["part"]))}</text>')
    out.append(f'<text x="{MARGIN + 3}" y="{H - MARGIN - TITLE_H + 13}">FILE {escape(str(t["file"]))}   SCHEMA {escape(str(t["schema"]))}   '
               f'OVERALL {t["size_mm"][0]:g} × {t["size_mm"][1]:g} × {t["size_mm"][2]:g} MM   CHARACTERISTICS {t["characteristics"]}</text>')
    for i, n in enumerate(d["notes"]):
        out.append(f'<text x="{MARGIN + 3}" y="{H - MARGIN - TITLE_H + 20 + i * 4.2:.1f}" font-size="2.3" fill="#444">{escape(n)}</text>')
    out.append("</g></svg>")
    return "\n".join(out)


# --- DXF (R12, ASCII) -------------------------------------------------------------------------------------

def to_dxf(d: dict) -> str:
    def g(code, value):
        return f"{code}\n{value}\n"

    layers = {"VISIBLE": 7, "HIDDEN": 8, "SMOOTH": 8, "BALLOON": 1, "DATUM": 5, "DIM": 8, "TEXT": 7, "TABLE": 7}
    s = g(0, "SECTION") + g(2, "HEADER") + g(9, "$ACADVER") + g(1, "AC1009") + g(0, "ENDSEC")
    s += g(0, "SECTION") + g(2, "TABLES")
    s += g(0, "TABLE") + g(2, "LTYPE") + g(70, 2)
    s += g(0, "LTYPE") + g(2, "CONTINUOUS") + g(70, 0) + g(3, "Solid line") + g(72, 65) + g(73, 0) + g(40, 0.0)
    s += g(0, "LTYPE") + g(2, "HIDDEN") + g(70, 0) + g(3, "Hidden") + g(72, 65) + g(73, 2) + g(40, 3.0) + g(49, 2.0) + g(49, -1.0)
    s += g(0, "ENDTAB")
    s += g(0, "TABLE") + g(2, "LAYER") + g(70, len(layers))
    for name, colour in layers.items():
        s += g(0, "LAYER") + g(2, name) + g(70, 0) + g(62, colour) + g(6, "HIDDEN" if name == "HIDDEN" else "CONTINUOUS")
    s += g(0, "ENDTAB") + g(0, "ENDSEC")
    s += g(0, "SECTION") + g(2, "ENTITIES")

    def pline(layer, pts):
        r = g(0, "POLYLINE") + g(8, layer) + g(66, 1) + g(70, 0)
        for p in pts:
            r += g(0, "VERTEX") + g(8, layer) + g(10, f"{p[0]:.4f}") + g(20, f"{p[1]:.4f}") + g(30, 0.0)
        return r + g(0, "SEQEND") + g(8, layer)

    def text(layer, x, y, h, txt, align=False):
        r = g(0, "TEXT") + g(8, layer) + g(10, f"{x:.3f}") + g(20, f"{y:.3f}") + g(30, 0.0) + g(40, h) + g(1, txt)
        if align:
            r += g(72, 1) + g(11, f"{x:.3f}") + g(21, f"{y:.3f}") + g(31, 0.0)
        return r

    for v in d["views"]:
        for key, layer in (("visible", "VISIBLE"), ("hidden", "HIDDEN"), ("smooth", "SMOOTH")):
            for line in v[key]:
                s += pline(layer, line)
        s += text("TEXT", (v["bounds"][0] + v["bounds"][2]) / 2, v["bounds"][1] - TITLE_DY, 3.4, v["title"], True)
    for o in d["overall"]:
        s += pline("DIM", [o["line"][:2], o["line"][2:]])
        for e in o["ext"]:
            s += pline("DIM", [e[:2], e[2:]])
        s += text("DIM", (o["line"][0] + o["line"][2]) / 2, (o["line"][1] + o["line"][3]) / 2 + 1.2, 2.8, o["label"], True)
    for m in d["marks"]:
        layer = "DATUM" if m["kind"] == "datum" else "BALLOON"
        s += pline(layer, [m["anchor"], m["pos"]])
        s += g(0, "CIRCLE") + g(8, layer) + g(10, f"{m['pos'][0]:.3f}") + g(20, f"{m['pos'][1]:.3f}") + g(30, 0.0) + g(40, BALLOON_R)
        s += text(layer, m["pos"][0], m["pos"][1] - 1.2, 3.2, str(m["label"]), True)
    per = 36
    for b in range(d["sheet"]["table_blocks"]):
        x = d["sheet"]["left_width"] + b * TABLE_W
        for i, r in enumerate(d["table"][b * per:(b + 1) * per]):
            y = SHEET_H - MARGIN - 6.0 - ROW_H * i
            s += text("TABLE", x + 2, y, 2.6, str(r["id"])) + text("TABLE", x + 14, y, 2.6, str(r["feature"])[:24])
            s += text("TABLE", x + 60, y, 2.6, str(r["requirement"])[:30])
    s += g(0, "ENDSEC") + g(0, "EOF")
    return s
