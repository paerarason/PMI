"""What a person should be told when a model is loaded, beyond what the loader itself reports.

Two checks that real files fail and clean samples do not:

* faces that are in no recognized feature. They get no operation, so the plan is silently incomplete;
* a Ø or R in the PMI that disagrees with the feature it is attached to. A factor of exactly 25.4 means the
  file tags the value with the wrong length unit (NIST FTC-09 writes a metric Ø8 as inches).

Both return plain sentences for `ModelRecord.warnings`.

`pmi_damaged_by_write` is the third check, run after a PMI write: OCCT rewrites the whole file, and on real
files it cannot always put the existing PMI back as it was.
"""
from __future__ import annotations

import re
from pathlib import Path

_NAMES = {"other": "free-form"}


def unexplained_faces(topo, features: list[dict]) -> str | None:
    """One sentence about curved faces that belong to no feature, or None when every one is explained.
    Planes are left out: a plane in no feature is a plain face of the part, with nothing to cut by itself."""
    # An `unknown` feature (an unclaimed region, feature_recognition/engine.py) is still unexplained.
    machined = {fid for f in features if f.get("state") != "rejected" and f["type"] not in ("plane", "unknown")
                for fid in f.get("face_ids", [])}
    left: dict[str, int] = {}
    for fid, face in topo.faces.items():
        if face.surface_type != "plane" and fid not in machined:
            name = _NAMES.get(face.surface_type, face.surface_type)
            left[name] = left.get(name, 0) + 1
    if not left:
        return None
    total = sum(left.values())
    kinds = ", ".join(f"{n} {k}" for k, n in sorted(left.items(), key=lambda kv: -kv[1]))
    return (f"{total} curved face(s) are in no recognized feature ({kinds}), so they are not described by any "
            "feature. Check them in the Features tab.")


def pmi_size_conflicts(features: list[dict], characteristics_mm: list[dict], inch_declared: bool | None = None) -> list[str]:
    """One sentence per Ø/R dimension whose value disagrees with the size of the feature it points at."""
    out: list[str] = []
    for row in pmi_agreement(features, characteristics_mm, inch_declared)["problems"]:
        if row["outcome"] not in ("disagree", "unit_mismatch"):
            continue
        text = (f"{row['char']}: the PMI gives {row['type']} {row['want']:g} mm, but {row['feature']}, the feature it "
                f"is attached to, measures {row['got']:g} mm.")
        if row["outcome"] == "unit_mismatch":
            text += " The two differ by exactly 25.4, so the file most likely tags this value with the wrong unit (inch or mm)."
        out.append(text)
    return out


_PMI_FIELDS = ("kind", "type_label", "nominal", "usl", "lsl", "unit", "face_ids", "datum_refs")


def _same(a, b) -> bool:
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= 1e-6 * max(1.0, abs(a), abs(b))
    if isinstance(a, list) and isinstance(b, list):
        return sorted(map(str, a)) == sorted(map(str, b))
    return a == b


def _differences(before: dict, after: dict) -> list[str]:
    return [k for k in _PMI_FIELDS if not _same(before.get(k), after.get(k))]


def pmi_damaged_by_write(before: list[dict], after: list[dict], edited_id: str | None = None) -> list[str]:
    """What a write did to the characteristics nobody asked it to touch: one sentence each, empty when every
    one came back as it was. `edited_id` is the characteristic the write was meant to change.

    Characteristic ids are renumbered by a write, so each old one is paired with the new one it matches
    exactly, then with the closest one on the same faces (to say what changed), else reported as gone."""
    pool = list(after)
    left: list[dict] = []
    for c in before:
        if c.get("id") == edited_id:
            continue
        match = next((a for a in pool if not _differences(c, a)), None)
        if match is None:
            left.append(c)
        else:
            pool.remove(match)
    out: list[str] = []
    for c in left:
        near = [a for a in pool if a.get("kind") == c.get("kind") and _same(a.get("face_ids") or [], c.get("face_ids") or [])
                and (c.get("face_ids") or a.get("type_label") == c.get("type_label"))]
        name = f"{c.get('id')} {c.get('type_label')}"
        if not near:
            out.append(f"{name} would be lost")
            continue
        best = min(near, key=lambda a: len(_differences(c, a)))
        pool.remove(best)
        changes = ", ".join(f"{k} {c.get(k)!r} would become {best.get(k)!r}" for k in _differences(c, best))
        out.append(f"{name}: {changes}")
    return out


def _size_values(params: dict) -> list[float]:
    """Every diameter a feature states (radii doubled), from its params and their nested steps."""
    vals: list[float] = []

    def walk(d):
        for k, v in d.items():
            if isinstance(v, dict):
                walk(v)
            elif isinstance(v, list):
                for x in v:
                    if isinstance(x, dict):
                        walk(x)
                    elif isinstance(x, (int, float)) and "diameter" in k:
                        vals.append(float(x))
            elif isinstance(v, (int, float)) and not isinstance(v, bool) and v > 0:
                if "diameter" in k:
                    vals.append(float(v))
                elif "radius" in k:
                    vals.append(2.0 * float(v))
    walk(params or {})
    return vals


def declares_inch_unit(step_path: str) -> bool:
    """Whether the STEP file declares an inch length unit anywhere: for its geometry, or only for some PMI
    measures (FTC-09 has mm geometry and one inch unit). Geometry is always loaded in mm."""
    import re

    text = Path(step_path).read_text(errors="replace")
    return bool(re.search(r"CONVERSION_BASED_UNIT\s*\(\s*'INCH'", text, re.IGNORECASE))


def pmi_agreement(features: list[dict], characteristics: list[dict], inch_declared: bool | None = None) -> dict:
    """Does the feature that owns a Ø/R dimension's faces have that size? See the module docstring.
    A miss by exactly 25.4× counts as an inch/mm mismatch only when the file declares an inch unit
    (`inch_declared`; None: either way)."""
    owners: dict[int, list[dict]] = {}
    for f in features:
        if f.get("state") == "rejected" or f["type"] == "plane":
            continue
        for fid in f.get("face_ids", []):
            owners.setdefault(fid, []).append(f)
    rows = []
    for c in characteristics:
        t = (c.get("type_label") or "").lower()
        if c.get("kind") != "dimension" or not ("diameter" in t or "radius" in t) or not c.get("nominal"):
            continue
        want = float(c["nominal"]) * (2.0 if "radius" in t and "diameter" not in t else 1.0)
        row = {"char": c["id"], "type": c["type_label"], "nominal": c["nominal"], "faces": c.get("face_ids", [])}
        if not row["faces"]:
            rows.append({**row, "outcome": "unlinked"})
            continue
        feats = {id(f): f for fid in row["faces"] for f in owners.get(fid, [])}.values()
        if not feats:
            rows.append({**row, "outcome": "no_feature"})
            continue
        sizes = [(f["id"], v) for f in feats for v in _size_values(f.get("params", {}))]
        if not sizes:
            rows.append({**row, "outcome": "no_size", "features": [f["id"] for f in feats]})
            continue
        tol = max(0.02, 0.002 * want)
        best = min(sizes, key=lambda s: abs(s[1] - want))
        if abs(best[1] - want) <= tol:
            rows.append({**row, "outcome": "agree", "feature": best[0]})
        else:
            unit = inch_declared is not False and any(abs(v * 25.4 - want) <= tol or abs(v / 25.4 - want) <= tol for _, v in sizes)
            rows.append({**row, "outcome": "unit_mismatch" if unit else "disagree", "feature": best[0],
                         "got": round(best[1], 4), "want": round(want, 4)})
    counts: dict[str, int] = {}
    for r in rows:
        counts[r["outcome"]] = counts.get(r["outcome"], 0) + 1
    checked = sum(counts.get(k, 0) for k in ("agree", "disagree", "unit_mismatch", "no_size"))
    return {"dimensions": len(rows), "counts": counts, "checked": checked, "agree": counts.get("agree", 0),
            "problems": [r for r in rows if r["outcome"] != "agree"], "rows": rows}
