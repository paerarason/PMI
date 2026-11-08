"""Recognition engine: runs the recognizers in priority order and assigns stable feature ids."""
from __future__ import annotations

from OCP.TopoDS import TopoDS_Shape

from app.services.feature_recognition.recognizers import (DEFAULT_RECOGNIZERS, FeatureRecognizer, _coplanar, _envelope,
                                                          _on_envelope)
from app.services.feature_recognition.taxonomy import classify
from app.services.feature_recognition.topology import Topology, build_topology
from app.services.feature_recognition.types import FeatureCandidate, FeatureType

# The method behind each recognizer, recorded on every feature it finds (FeatureCandidate.recognition_method).
METHODS = {
    "hole": "COAXIAL_INTERNAL_CYLINDERS", "shaft": "COAXIAL_EXTERNAL_CYLINDERS", "cone": "STANDALONE_CONE",
    "torus": "TOROIDAL_BLEND", "sphere": "SPHERICAL_FACES", "planar_chamfer": "PLANAR_EDGE_BREAK",
    "channel": "OPEN_INTERNAL_CYLINDER", "protrusion": "CONVEX_REGION_ON_BASE",
    "prismatic": "CONCAVE_FLOOR_AND_WALLS", "cyl_blend": "PARTIAL_CYLINDER_BLEND", "plane": "PLANAR_FACE",
    "passage": "FLOORLESS_WALL_RING", "face_groove": "ANNULAR_FLOOR_BETWEEN_COAXIAL_WALLS",
    # OpenedBoreRecognizer sets its own: OPENED_BORE_ON_FLOOR (a hole) or OPENED_ANNULAR_FLOOR (a face groove)
    "opened_bore": "OPENED_BORE_ON_FLOOR",
}
UNCLAIMED = "UNCLAIMED_FACE_REGION"
# A rival reading counts when it shares this much of the feature's faces (|A ∩ B| / |A ∪ B|) …
RIVAL_OVERLAP = 0.6
# … and a feature is ambiguous when an alternative is at least this close to its own confidence.
AMBIGUOUS_MARGIN = 0.1

_ID_PREFIX = {
    "hole": "HOLE", "shaft": "SHAFT", "plane": "PLANE", "chamfer": "CHAMFER",
    "countersink": "CSINK", "fillet": "FILLET", "round": "ROUND",
    "spherical_seat": "SSEAT", "spherical_boss": "SBOSS", "pocket": "POCKET", "slot": "SLOT",
    "groove": "GROOVE", "step": "STEP", "boss": "BOSS", "rib": "RIB", "unknown": "FEAT",
}


def recognize_features(shape: TopoDS_Shape, recognizers: list[FeatureRecognizer] | None = None) -> list[FeatureCandidate]:
    """Recognize manufacturing features on `shape`. Faces are claimed in recognizer priority order so a
    face belongs to at most one feature. Ids are assigned per type (HOLE-001, PLANE-003, …) in a
    deterministic order (by first face id) so re-running on the same file gives the same ids."""
    return recognize_with_topology(shape, recognizers)[0]


def recognize_with_topology(shape: TopoDS_Shape,
                            recognizers: list[FeatureRecognizer] | None = None) -> tuple[list[FeatureCandidate], Topology]:
    """`recognize_features`, plus the topology it was read from, for a caller that also wants to know which
    faces ended up in no feature."""
    topo = build_topology(shape)
    claimed: set[int] = set()
    found: list[FeatureCandidate] = []
    for rec in (recognizers or DEFAULT_RECOGNIZERS):
        try:
            new = rec.detect(topo, claimed)
        except Exception:  # noqa: BLE001 - a recognizer failing must not sink the whole analysis
            continue
        for cand in new:
            cand.recognition_method = cand.recognition_method or METHODS.get(rec.name, rec.name.upper())
        found.extend(new)
    if recognizers is None:
        found = join_split_pieces(found, topo)
        found.extend(unclaimed_regions(topo, claimed))
        add_rival_readings(found, topo, DEFAULT_RECOGNIZERS)
    for cand in found:
        cand.ambiguous = any(a.get("confidence", 0.0) >= cand.confidence - AMBIGUOUS_MARGIN for a in cand.alternatives)

    # Resolve each archetype to its MFDataset leaf class, so features are traceable to the reference
    # taxonomy (taxonomy.py) without the recognizers each having to name their own leaf.
    for cand in found:
        cand.mf_class = classify(cand)

    counters: dict[str, int] = {}
    for cand in sorted(found, key=lambda c: (c.type.value, min(c.face_ids) if c.face_ids else 1 << 30)):
        prefix = _ID_PREFIX.get(cand.type.value, "FEAT")
        counters[prefix] = counters.get(prefix, 0) + 1
        cand.id = f"{prefix}-{counters[prefix]:03d}"
    # Return in the assigned-id order for a stable, readable tree.
    return sorted(found, key=lambda c: c.id), topo


def join_split_pieces(found: list[FeatureCandidate], topo: Topology) -> list[FeatureCandidate]:
    """Give a feature back the pieces of its own surfaces that a later cut divided off.

    A slot run across a step's floor leaves floor on both sides; a hole through a passage's wall leaves pieces of
    that wall. The recognizers see the piece that still meets the feature's other faces and take it; the
    others carry no edge back to them and would end up as bare planes. A bare plane joins a feature when it lies
    on the plane of one of the feature's faces (same plane, same side), inside the part's envelope, and the two
    either meet or both border the cut that runs between them. Pieces can chain: a boss left standing in a
    groove cut into a piece joins once the piece has."""
    keep = [c for c in found if c.type not in (FeatureType.PLANE, FeatureType.UNKNOWN)]
    if not keep:
        return found
    owner = {f: c for c in found if c.type != FeatureType.PLANE for f in c.face_ids}
    lo, hi = _envelope(topo)
    pieces = {c.face_ids[0]: c for c in found if c.type == FeatureType.PLANE and len(c.face_ids) == 1
              and not _on_envelope(topo.faces[c.face_ids[0]], lo, hi)}

    def cuts_next_to(fid, own):
        return {id(owner[n]) for n in topo.neighbors(fid) if n in owner and owner[n] is not own}

    joined: set[int] = set()
    changed = True
    while changed:
        changed = False
        for fid in sorted(pieces):
            if fid in joined:
                continue
            fi = topo.faces[fid]
            best = None
            for c in keep:
                for g in c.face_ids:
                    gi = topo.faces[g]
                    if not _coplanar(fi, gi):
                        continue
                    if g in topo.neighbors(fid) or cuts_next_to(fid, c) & cuts_next_to(g, c):
                        d = sum((fi.centroid[k] - gi.centroid[k]) ** 2 for k in range(3)) if fi.centroid and gi.centroid else 0.0
                        if best is None or d < best[0]:
                            best = (d, c, g)
            if best is None:
                continue
            _, c, g = best
            c.face_ids = sorted({*c.face_ids, fid})
            c.edge_ids = sorted({*c.edge_ids, *fi.edge_ids})
            c.params["split_face_ids"] = sorted({*(c.params.get("split_face_ids") or []), fid})
            c.evidence.append(f"face {fid} lies on the plane of face {g}: a piece of it another cut divided off")
            owner[fid] = c
            joined.add(fid)
            changed = True
    return [c for c in found if not (c.type == FeatureType.PLANE and c.face_ids[0] in joined)]


def unclaimed_regions(topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
    """Curved faces no recognizer could explain, as `unknown` candidates, one per connected region, so a person
    sees and classifies them instead of their being dropped. Each says what it is made of and that nothing was
    matched; none is a guess at a feature type."""
    left = {fid for fid, f in topo.faces.items() if fid not in claimed and f.surface_type != "plane"}
    out: list[FeatureCandidate] = []
    while left:
        seed = min(left)
        region, stack = {seed}, [seed]
        left.discard(seed)
        while stack:
            for nb in topo.adjacency.get(stack.pop(), ()):
                if nb in left:
                    left.discard(nb)
                    region.add(nb)
                    stack.append(nb)
        faces = [topo.faces[i] for i in sorted(region)]
        kinds: dict[str, int] = {}
        for f in faces:
            kinds[f.surface_type] = kinds.get(f.surface_type, 0) + 1
        lo = [min(f.bbox_min[k] for f in faces if f.bbox_min) for k in range(3)] if any(f.bbox_min for f in faces) else None
        hi = [max(f.bbox_max[k] for f in faces if f.bbox_max) for k in range(3)] if lo else None
        sides = {f.material_side for f in faces if f.material_side in ("internal", "external")}
        edge_ids = sorted({e for f in faces for e in f.edge_ids})
        evidence = [f"{len(faces)} connected curved face(s) no recognizer claims: "
                    + ", ".join(f"{n} {k}" for k, n in sorted(kinds.items(), key=lambda kv: -kv[1])),
                    "no feature template matched their topology; the type is left open for a person to decide"]
        if sides:
            evidence.append("material " + " and ".join(sorted(sides)))
        params = {"surfaces": kinds, "area": round(sum(f.area for f in faces), 4), "face_count": len(faces)}
        if lo:
            params.update(bbox_min=[round(c, 4) for c in lo], bbox_max=[round(c, 4) for c in hi])
        out.append(FeatureCandidate(id="", type=FeatureType.UNKNOWN, face_ids=sorted(region), edge_ids=edge_ids,
                                    params=params, confidence=0.3, evidence=evidence, recognition_method=UNCLAIMED))
    return out


def add_rival_readings(found: list[FeatureCandidate], topo: Topology, recognizers: list[FeatureRecognizer]) -> None:
    """Recognizers run in priority order and the first one to claim a face keeps it. Run each again on its own,
    with nothing claimed, and record what it would have made of a found feature's faces when that differs:
    the reading that lost is kept as an alternative, never silently dropped."""
    shadows: list[FeatureCandidate] = []
    for rec in recognizers:
        if rec.name == "plane":
            continue
        try:
            cands = rec.detect(topo, set())
        except Exception:  # noqa: BLE001
            continue
        for c in cands:
            c.recognition_method = c.recognition_method or METHODS.get(rec.name, rec.name.upper())
            c.mf_class = classify(c)
        shadows.extend(cands)
    by_face: dict[int, list[FeatureCandidate]] = {}
    for sh in shadows:
        for fid in sh.face_ids:
            by_face.setdefault(fid, []).append(sh)
    owner = {fid: f for f in found if f.type != FeatureType.PLANE for fid in f.face_ids}
    for f in found:
        if f.type == FeatureType.PLANE or not f.face_ids:
            continue
        mine = set(f.face_ids)
        best: dict[str, dict] = {a["type"]: a for a in f.alternatives}
        seen: set[int] = set()
        for fid in f.face_ids:
            for sh in by_face.get(fid, []):
                if id(sh) in seen or sh.type == f.type:
                    continue
                seen.add(id(sh))
                theirs = set(sh.face_ids)
                overlap = len(mine & theirs) / len(mine | theirs)
                if overlap < RIVAL_OVERLAP:
                    continue
                # A reading that also takes another feature's faces is a different decomposition of the part
                # (a pocket swallowing the rib that stands in it), not another reading of this feature.
                if any(owner.get(x) not in (None, f) for x in theirs - mine):
                    continue
                alt = {"label": sh.type.value.replace("_", " "), "type": sh.type.value, "params": sh.params,
                       "confidence": round(sh.confidence, 3), "method": sh.recognition_method,
                       "mf_class": sh.mf_class, "face_ids": sh.face_ids,
                       "reason": f"{sh.recognition_method} reads {len(mine & theirs)} of its {len(mine)} face(s) as a "
                                 f"{sh.type.value.replace('_', ' ')} ({sh.evidence[0] if sh.evidence else 'no detail'})"}
                if sh.type.value not in best or alt["confidence"] > best[sh.type.value].get("confidence", 0.0):
                    best[sh.type.value] = alt
        f.alternatives = sorted(best.values(), key=lambda a: -a.get("confidence", 0.0))
