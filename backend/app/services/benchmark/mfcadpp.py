"""Feature-recognition accuracy against MFCAD++, a third party's labelled dataset.

MFCAD++ (Colligan, Robinson, Nolan, Hua, Cao: "Hierarchical CADNet: Learning from B-Reps for Machining
Feature Recognition", Computer-Aided Design 147, 2022; dataset doi:10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823,
Queen's University Belfast, licence CC BY) holds 59,655 STEP parts: a stock block with 3–10 machining features
cut into it. Every B-rep face carries its class, written as the name of its ADVANCED_FACE. The labels come from
the dataset's own generator, not ours, so agreement with them is an independent measure. They cover prismatic
features only (no turning, no free-form), and real parts must still be checked with reviewed labels.

Scoring is per face, as the papers on this dataset report it, at two levels:

* **process**: did we find the right kind of feature (hole, slot, pocket, passage, step, chamfer, round, O-ring
  groove, or untouched stock)? This is what machining needs;
* **exact class**: the dataset's 25 classes, which also separate shape variants (triangular, rectangular or
  six-sided pocket; through or blind slot; …), derived from our feature's parameters.

The dataset folder (git-ignored, under benchmark/data/mfcadpp/) is read, never modified.
"""
from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from pathlib import Path

from app import config

DATA_DIR = config.BASE_DIR / "benchmark" / "data" / "mfcadpp"

# The dataset's classes in label order (Colligan et al. 2022, the FeatureNet set plus stock). A label file in
# the dataset (feature_labels.txt) overrides this list when present.
CLASSES = [
    "chamfer", "through_hole", "triangular_passage", "rectangular_passage", "6sides_passage",
    "triangular_through_slot", "rectangular_through_slot", "circular_through_slot", "rectangular_through_step",
    "2sides_through_step", "slanted_through_step", "Oring", "blind_hole", "triangular_pocket", "rectangular_pocket",
    "6sides_pocket", "circular_end_pocket", "rectangular_blind_slot", "v_circular_end_blind_slot",
    "h_circular_end_blind_slot", "triangular_blind_step", "circular_blind_step", "rectangular_blind_step", "round",
    "stock",
]

# Each class's process archetype: what is cut, and how.
PROCESS = {
    "chamfer": "chamfer", "through_hole": "hole", "blind_hole": "hole",
    "triangular_passage": "passage", "rectangular_passage": "passage", "6sides_passage": "passage",
    "triangular_through_slot": "slot", "rectangular_through_slot": "slot", "circular_through_slot": "slot",
    "rectangular_blind_slot": "slot", "v_circular_end_blind_slot": "slot", "h_circular_end_blind_slot": "slot",
    "rectangular_through_step": "step", "2sides_through_step": "step", "slanted_through_step": "step",
    "triangular_blind_step": "step", "circular_blind_step": "step", "rectangular_blind_step": "step",
    "triangular_pocket": "pocket", "rectangular_pocket": "pocket", "6sides_pocket": "pocket",
    "circular_end_pocket": "pocket", "Oring": "groove", "round": "round", "stock": "stock",
}


def _norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower().replace("sided", "sides"))


def load_classes(root: Path | None = None) -> list[str]:
    """The class keys in label order. The dataset's feature_labels.txt ("0 - Chamfer" …) is read to check that
    its order is the one CLASSES assumes; a dataset that disagrees stops the run rather than mislabel it."""
    root = root or DATA_DIR
    files = sorted(root.rglob("feature_labels.txt")) if root.exists() else []
    if not files:
        return list(CLASSES)
    found = {}
    for line in files[0].read_text(errors="ignore").splitlines():
        m = re.match(r"^\s*(\d+)\s*-\s*(.+?)\s*$", line)
        if m:
            found[int(m.group(1))] = m.group(2)
    aliases = {"6sidespassage": "6sidespassage", "oring": "oring", "verticalcircularendblindslot": "vcircularendblindslot",
               "horizontalcircularendblindslot": "hcircularendblindslot", "2sidesthroughstep": "2sidesthroughstep"}
    for i, key in enumerate(CLASSES):
        theirs = _norm(found.get(i, ""))
        if aliases.get(theirs, theirs) != _norm(key):
            raise ValueError(f"label {i} is {found.get(i)!r} in {files[0]}, expected {key!r}")
    return list(CLASSES)


def read_labelled_step(path: str) -> tuple[object, dict[int, int]]:
    """(shape, {face id: class index}) from a STEP file whose ADVANCED_FACE names are class indices. Face ids are
    the tessellator's iter_faces order on that shape, the same order the recognizers use."""
    from OCP.IFSelect import IFSelect_RetDone
    from OCP.STEPControl import STEPControl_Reader

    from app.services.tessellator import iter_faces

    reader = STEPControl_Reader()
    if reader.ReadFile(path) != IFSelect_RetDone:
        raise ValueError("unreadable STEP")
    reader.TransferRoots()
    shape = reader.OneShape()
    tr = reader.WS().TransferReader()
    labels: dict[int, int] = {}
    for fid, face in iter_faces(shape):
        ent = tr.EntityFromShapeResult(face, 1)
        name = ent.Name().ToCString() if ent is not None and hasattr(ent, "Name") else ""
        if name.strip().lstrip("-").isdigit():
            labels[fid] = int(name.strip())
    return shape, labels


# --- our features → their classes --------------------------------------------------------------------------

def _polygon(n: int) -> str:
    return {3: "triangular", 4: "rectangular", 6: "6sides"}.get(n, "rectangular")


def _floor_edges(topo, floor_id) -> list:
    if topo is None or floor_id is None or floor_id not in topo.faces:
        return []
    return [topo.edges[e] for e in topo.faces[floor_id].edge_ids if e in topo.edges]


def _rectilinear(edges) -> bool:
    """The floor's straight edges are all parallel or perpendicular to one another."""
    dirs = [e.params.get("direction") for e in edges if e.curve_type == "line" and e.params.get("direction")]
    for i, a in enumerate(dirs):
        for b in dirs[i + 1:]:
            c = abs(sum(a[k] * b[k] for k in range(3)))
            if 0.02 < c < 0.98:
                return False
    return True


def _recess_class(t: str, p: dict, topo) -> str:
    """A floored or floorless prismatic recess (pocket, slot, step, passage) as one of the dataset's classes,
    from its signature: planar walls, curved walls, floor outline and how it is open. The rules follow the
    dataset generator (Features/*.py): where each sketch sits on the stock face and how deep it is cut."""
    walls = p.get("wall_face_ids") or []
    if topo is not None:
        from app.services.feature_recognition.recognizers import _distinct_planes
        walls = _distinct_planes(topo, [w for w in walls if w in topo.faces])   # one per wall, however split
    curved = p.get("corner_face_ids") or []
    n_walls = len(walls) or int(p.get("wall_count") or 0)
    if p.get("through"):                                            # a floorless ring: passage
        return f"{_polygon(int(p.get('wall_count') or n_walls))}_passage"
    sweeps = _end_sweeps(curved, topo)
    halves = sum(1 for w in sweeps if w > 135.0)
    quarters = sum(1 for w in sweeps if 45.0 < w <= 135.0)
    if not p.get("open"):                                           # floor walled all round: pocket
        if halves >= 2 or (halves and n_walls <= 2):
            return "circular_end_pocket"
        return f"{_polygon(n_walls)}_pocket"
    if halves >= 2 or (halves and t == "pocket"):
        return "circular_end_pocket"                   # both ends rounded, or open only into other cuts
    if t == "slot" and p.get("profile") == "round":
        return "circular_through_slot"
    if t == "slot" and p.get("profile") == "vee":
        return "triangular_through_slot"
    if (p.get("open_ends") or 0) >= 2 and n_walls == 2 and not curved and _parallel_walls(walls, topo):
        return "rectangular_through_slot"
    if halves == 1 and n_walls >= 1:
        return "v_circular_end_blind_slot"
    if quarters >= 2 and n_walls <= 1:
        return "h_circular_end_blind_slot"
    if curved and n_walls == 0:
        return "circular_blind_step"
    if n_walls >= 4:
        return f"{_polygon(n_walls)}_pocket"         # a pocket another feature broke into, not a slot
    if t == "pocket" and n_walls <= 2:
        return f"{_polygon(n_walls)}_pocket"         # open only into other cuts (recognizers: not a step)
    if n_walls == 3:
        if not _slot_walls(walls, topo):
            if t == "pocket" or _walls_surround(p, walls, topo):
                return "triangular_pocket"
            # Walls along one side only: a step with a third face left by another cut (a chamfer's remnant).
            return "2sides_through_step" if not _any_perpendicular(walls, topo) else "rectangular_blind_step"
        # The generator puts a blind slot against a stock edge: it opens onto the outside of the part. A
        # three-walled recess opening into another cut is a pocket whose fourth wall that cut removed.
        return "rectangular_blind_slot" if _opens_outside(p, topo) else "rectangular_pocket"
    if n_walls == 2:
        return "2sides_through_step" if not _perpendicular_walls(walls, topo) else "rectangular_blind_step"
    edges = _floor_edges(topo, p.get("floor_face_id"))
    straight = [e for e in edges if e.curve_type == "line"]
    if len(straight) == 3 and len(edges) == 3:
        return "triangular_blind_step"
    return "rectangular_through_step" if _rectilinear(edges) else "slanted_through_step"


def _end_sweeps(curved, topo) -> list[float]:
    """The angle (degrees) each rounded end or corner covers, the pieces of one cylinder that another cut
    split counted together."""
    if topo is None:
        return []
    from app.services.feature_recognition.recognizers import _angular_cover, _radial_groups
    faces = [topo.faces[c] for c in curved if c in topo.faces and topo.faces[c].surface_type == "cylinder"]
    return [math.degrees(_angular_cover(g)) for g in _radial_groups(faces)]


def _normals(walls, topo):
    return [topo.faces[w].normal for w in walls if topo is not None and w in topo.faces and topo.faces[w].normal]


def _dot(u, v) -> float:
    return sum(u[k] * v[k] for k in range(3))


def _parallel_walls(walls, topo) -> bool:
    """Two walls facing each other across the recess (a slot's sides)."""
    n = _normals(walls, topo)
    return len(n) == 2 and _dot(n[0], n[1]) < -0.99


def _slot_walls(walls, topo) -> bool:
    """Two side walls facing each other and an end wall square to them."""
    n = _normals(walls, topo)
    if len(n) != 3:
        return False
    for i in range(3):
        a, b, c = n[i], n[(i + 1) % 3], n[(i + 2) % 3]
        if _dot(b, c) < -0.99 and abs(_dot(a, b)) < 0.1:
            return True
    return False


def _any_perpendicular(walls, topo) -> bool:
    n = _normals(walls, topo)
    return any(abs(_dot(a, b)) < 0.1 for i, a in enumerate(n) for b in n[i + 1:])


def _walls_surround(p: dict, walls, topo) -> bool:
    from app.services.feature_recognition.recognizers import _surrounds
    fl = p.get("floor_face_id")
    if topo is None or fl not in getattr(topo, "faces", {}):
        return True
    return _surrounds(topo.faces[fl].normal, _normals(walls, topo))


def _opens_outside(p: dict, topo) -> bool:
    """Some floor edge that no wall closes leads onto the outside of the part, not into another cut
    (recognizers._opens_onto_outside)."""
    if topo is None or p.get("floor_face_id") not in getattr(topo, "faces", {}):
        return True
    from app.services.feature_recognition.recognizers import _opens_onto_outside
    own = set(p.get("wall_face_ids") or []) | set(p.get("corner_face_ids") or []) | set(p.get("overhang_face_ids") or [])
    return _opens_onto_outside(topo, topo.faces[p["floor_face_id"]], own)


def _perpendicular_walls(walls, topo) -> bool:
    n = _normals(walls, topo)
    return len(n) == 2 and abs(sum(n[0][k] * n[1][k] for k in range(3))) < 0.1


def exact_class(f: dict, topo=None) -> str:
    """The MFCAD++ class our feature `f` corresponds to (from its type, parameters and, for recesses, the
    topology of its walls and floor)."""
    t, p = f["type"], f.get("params") or {}
    if t == "hole":
        return "through_hole" if p.get("through") else "blind_hole"
    if t == "chamfer":
        return "chamfer"
    if t in ("fillet", "round"):
        return "round"
    if t == "groove":
        return "Oring"
    if t in ("pocket", "slot", "step"):
        if t == "slot" and p.get("profile") in ("round", "vee") and not p.get("wall_face_ids"):
            return "circular_through_slot" if p.get("profile") == "round" else "triangular_through_slot"
        return _recess_class(t, p, topo)
    if t in ("plane", "unknown"):
        return "stock"
    return f"other:{t}"


def predict(shape, topo=None) -> tuple[dict[int, str], list[dict]]:
    """({face id: predicted exact class}, features) for one part. A face in no feature, or only in a plane, is stock."""
    from app.services.feature_recognition.engine import recognize_with_topology

    found, topo = recognize_with_topology(shape)
    feats = [c.to_dict() for c in found]
    out: dict[int, str] = {}
    for f in sorted(feats, key=lambda f: f["type"] == "plane"):           # a real feature beats a plane
        cls = exact_class(f, topo)
        # A hole's entry cone (countersink or entry chamfer) is a chamfer to the dataset, which has no countersink.
        entry_cone = set((f.get("params") or {}).get("countersink_face_ids") or []) if f["type"] == "hole" else set()
        for fid in f.get("face_ids") or []:
            if fid not in out or out[fid] == "stock":
                out[fid] = "chamfer" if fid in entry_cone else cls
    return out, feats


def evaluate_file(path: str, classes: list[str]) -> dict:
    """Per-face (truth, prediction) pairs for one part, or an error."""
    try:
        shape, labels = read_labelled_step(path)
        pred, _ = predict(shape)
    except Exception as exc:  # noqa: BLE001 - one bad file must not stop the run
        return {"file": Path(path).name, "error": f"{type(exc).__name__}: {exc}"}
    pairs = []
    for fid, idx in labels.items():
        truth = classes[idx] if 0 <= idx < len(classes) else f"label{idx}"
        pairs.append((truth, pred.get(fid, "stock")))
    return {"file": Path(path).name, "faces": len(labels), "pairs": pairs}


def score(results: list[dict]) -> dict:
    """Face accuracy at both levels, per-class precision / recall, confusion, and the worst parts."""
    from app.services.benchmark.stats import lower_bound

    exact = Counter()
    proc = Counter()
    conf_exact: dict[str, Counter] = defaultdict(Counter)
    conf_proc: dict[str, Counter] = defaultdict(Counter)
    per_file = []
    errors = [r for r in results if r.get("error")]
    for r in results:
        if r.get("error"):
            continue
        ok = 0
        for truth, pred in r["pairs"]:
            pt, pp = PROCESS.get(truth, truth), PROCESS.get(pred, pred.split(":")[-1])
            conf_exact[truth][pred] += 1
            conf_proc[pt][pp] += 1
            exact["n"] += 1
            exact["ok"] += truth == pred
            proc["ok"] += pt == pp
            ok += pt == pp
        per_file.append((ok / max(len(r["pairs"]), 1), r["file"]))

    def per_class(conf: dict[str, Counter]) -> dict:
        preds = Counter()
        for row in conf.values():
            preds.update(row)
        out = {}
        for cls, row in conf.items():
            tp, n = row[cls], sum(row.values())
            out[cls] = {"faces": n, "recall": round(tp / n, 4) if n else None,
                        "precision": round(tp / preds[cls], 4) if preds[cls] else None,
                        "confused_with": dict(row.most_common(4))}
        return dict(sorted(out.items(), key=lambda kv: -kv[1]["faces"]))

    n = exact["n"]
    per_file.sort()
    return {
        "parts": len(results) - len(errors), "errors": len(errors), "faces": n,
        # faces are not independent (a part's faces share one recognition), so the bound is a floor, not a promise
        "process_accuracy": round(proc["ok"] / n, 4) if n else None,
        "process_proven": round(lower_bound(proc["ok"], n), 4) if n else None,
        "exact_accuracy": round(exact["ok"] / n, 4) if n else None,
        "exact_proven": round(lower_bound(exact["ok"], n), 4) if n else None,
        "parts_all_faces_right": sum(1 for a, _ in per_file if a >= 1.0),
        "process_classes": per_class(conf_proc), "exact_classes": per_class(conf_exact),
        "worst_parts": [{"file": f, "process_accuracy": round(a, 3)} for a, f in per_file[:25]],
        "error_samples": errors[:10],
    }


def split_files(root: Path, split: str) -> list[Path]:
    """The STEP files of a dataset split (train / val / test lists in the dataset), else every STEP file."""
    steps = {p.stem: p for p in root.rglob("*.st*p") if p.suffix.lower() in (".step", ".stp")}
    for lst in sorted(root.rglob(f"{split}.txt")):
        names = [x.strip() for x in lst.read_text(errors="ignore").split() if x.strip()]
        picked = [steps[Path(n).stem] for n in names if Path(n).stem in steps]
        if picked:
            return picked
    return sorted(steps.values())


def report_markdown(s: dict, split: str, sample: int | None) -> str:
    lines = [f"# MFCAD++ feature-recognition accuracy ({split} split{f', {sample} parts sampled' if sample else ''})", "",
             "_Per-face agreement with the labels of MFCAD++ (Colligan et al. 2022, doi:10.17034/d1fec5a0-8c10-4630-"
             "b02e-b92dc81df823, CC BY), a third party's synthetic prismatic parts. Independent of our own generators; "
             "real parts still need reviewed labels._", "",
             f"**{s['parts']} parts, {s['faces']} faces** ({s['errors']} unreadable).", "",
             f"- process level (right kind of feature): **{100 * (s['process_accuracy'] or 0):.1f} %** (proven ≥ {100 * (s['process_proven'] or 0):.1f} % at 95 %)",
             f"- exact class (25 classes): **{100 * (s['exact_accuracy'] or 0):.1f} %** (proven ≥ {100 * (s['exact_proven'] or 0):.1f} % at 95 %)",
             f"- parts with every face right (process level): {s['parts_all_faces_right']} of {s['parts']}", "",
             "## Process level, per class", "", "| class | faces | recall | precision | most often read as |", "|---|---|---|---|---|"]
    for cls, r in s["process_classes"].items():
        lines.append(f"| {cls} | {r['faces']} | {_pct(r['recall'])} | {_pct(r['precision'])} | "
                     + ", ".join(f"{k} {v}" for k, v in r["confused_with"].items()) + " |")
    lines += ["", "## Exact class, per class", "", "| class | faces | recall | precision | most often read as |", "|---|---|---|---|---|"]
    for cls, r in s["exact_classes"].items():
        lines.append(f"| {cls} | {r['faces']} | {_pct(r['recall'])} | {_pct(r['precision'])} | "
                     + ", ".join(f"{k} {v}" for k, v in r["confused_with"].items()) + " |")
    lines += ["", "## Worst parts (process level)", ""] + [f"- {w['file']}: {100 * w['process_accuracy']:.0f} %" for w in s["worst_parts"][:15]]
    return "\n".join(lines) + "\n"


def _pct(v) -> str:
    return "—" if v is None else f"{100 * v:.1f} %"

