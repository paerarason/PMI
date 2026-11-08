"""Deterministic recognizers: each turns a geometric/topological pattern into FeatureCandidates.

Every recognizer implements the same interface and *claims* the faces it consumes, so the engine can run
them in priority order without double-counting a face (a hole's bottom-cap cone shouldn't also surface as
a standalone countersink). Truth is always derived from geometry — surface type, radius, axis, adjacency,
area — never guessed; `confidence` + `evidence` record how sure we are and why (spec §7–§8, §29).
"""
from __future__ import annotations

import math

from app.services.feature_recognition.topology import FaceInfo, Topology, collinear_axes, line_of_sight
from app.services.feature_recognition.types import FeatureCandidate, FeatureType


class FeatureRecognizer:
    name = "base"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:  # noqa: ARG002
        raise NotImplementedError


def _group_collinear(faces: list[FaceInfo]) -> list[list[FaceInfo]]:
    """Greedily group axisymmetric faces that share the same axis line (stepped / counterbored stacks)."""
    groups: list[list[FaceInfo]] = []
    for f in faces:
        for g in groups:
            if collinear_axes(g[0], f):
                g.append(f)
                break
        else:
            groups.append([f])
    return groups


def _round4(v):
    return round(v, 4) if isinstance(v, (int, float)) else v


# A drilled bore / turned journal is a **closed** cylinder: its coaxial, equal-radius faces sweep a full
# turn even when another feature splits the face (a keyway cuts a shaft OD into a 254° and a 74° patch that
# still sum to ~360°). A milled channel never closes — a round-bottomed groove tops out at 180°, a corner
# fillet at ~90°. Measured across the MF corpus the two populations are far apart: unbroken bores and
# journals sit at 360°, a shaft split by a keyway still sums to 329°, while the widest channel floor
# reaches only 197.5°. The threshold sits in that gap.
_MIN_BORE_SWEEP = math.radians(270.0)
# A channel floor cut by a round tool still wraps well past a corner blend; between the two lies the split.
_MIN_CHANNEL_SWEEP = math.radians(120.0)
# Within this of _MIN_CHANNEL_SWEEP either side, the other reading is reported as an alternative.
_SWEEP_MARGIN = math.radians(20.0)


def _sweep_of(f: FaceInfo) -> float:
    return 2 * math.pi if f.sweep is None else f.sweep


def _radial_groups(faces: list[FaceInfo]) -> list[list[FaceInfo]]:
    """Group coaxial faces of the same radius — the pieces of one physical cylinder, however it was split."""
    groups: list[list[FaceInfo]] = []
    for f in faces:
        for g in groups:
            if collinear_axes(g[0], f) and abs((g[0].radius or 0.0) - (f.radius or 0.0)) < 1e-4:
                g.append(f)
                break
        else:
            groups.append([f])
    return groups


def _split_closed(faces: list[FaceInfo]) -> tuple[list[FaceInfo], list[FaceInfo]]:
    """(faces belonging to closed cylinders, the rest) — the bore/journal vs channel/blend split."""
    closed: list[FaceInfo] = []
    partial: list[FaceInfo] = []
    for g in _radial_groups(faces):
        (closed if _angular_cover(g) >= _MIN_BORE_SWEEP else partial).extend(g)
    return closed, partial


def _angular_cover(group: list[FaceInfo]) -> float:
    """How much of the circle the pieces of one cylinder cover together (radians). Pieces on the same side
    count once: two half-cylinders one after the other along a slot are still half a bore, while two halves
    facing each other close it."""
    if any(f.sweep is None or f.sweep >= 2 * math.pi - 1e-6 for f in group):
        return 2 * math.pi
    axis, loc = group[0].axis_dir, group[0].axis_loc
    if not axis or not loc or any(not f.point for f in group):
        return sum(_sweep_of(f) for f in group)
    u = _cross3(axis, [1.0, 0.0, 0.0]) if abs(axis[0]) < 0.9 else _cross3(axis, [0.0, 1.0, 0.0])
    un = math.sqrt(sum(c * c for c in u))
    u = [c / un for c in u]
    v = _cross3(axis, u)
    covered = [False] * 360
    for f in group:
        r = [f.point[k] - loc[k] for k in range(3)]
        mid = math.degrees(math.atan2(sum(r[k] * v[k] for k in range(3)), sum(r[k] * u[k] for k in range(3))))
        half = math.degrees(f.sweep) / 2.0
        for d in range(int(math.floor(mid - half)), int(math.ceil(mid + half))):
            covered[d % 360] = True
    return math.radians(sum(covered))


def _axial_pos(f: FaceInfo, axis) -> float:
    """Where a face sits along the shared axis — used to order a stack of coaxial diameters."""
    pts = [p for p in (f.axis_start, f.axis_end) if p] or [f.axis_loc]
    if not pts or pts[0] is None:
        return 0.0
    mid = [sum(p[i] for p in pts) / len(pts) for i in range(3)]
    return sum(mid[i] * axis[i] for i in range(3))


class _HoleStack:
    """A hole's coaxial cylinders + cones measured along one axis, so depth comes from the *entry face*.

    Measuring only the bore cylinder is wrong whenever something sits above it: a countersink cone eats
    the top of the bore, a counterbore replaces it, a centre-drill cone leaves only a sliver of pilot. The
    drill still starts at the part surface, so entry, depth and every step depth are taken from the
    extremes of the whole stack. Positions are scalars `t` along the (unit) axis from the first face's
    axis origin; an "end" is "lo" (smallest t) or "hi" (largest t).
    """

    def __init__(self, group: list[FaceInfo], cones: list[FaceInfo]):
        axis = group[0].axis_dir or [0.0, 0.0, 1.0]
        n = math.sqrt(sum(c * c for c in axis)) or 1.0
        self.axis = [c / n for c in axis]
        self.origin = group[0].axis_loc or [0.0, 0.0, 0.0]
        self.cyls = [(f, *self._span(f)) for f in group]
        self.cones = [(f, *self._span(f)) for f in cones]
        spans = [s for _f, *s in self.cyls + self.cones]
        self.lo = min(s[0] for s in spans)
        self.hi = max(s[1] for s in spans)
        self.length = self.hi - self.lo
        self.tol = max(1e-3, 1e-4 * self.length)

    def _t(self, p) -> float:
        return sum((p[i] - self.origin[i]) * self.axis[i] for i in range(3))

    def _span(self, f: FaceInfo) -> tuple[float, float]:
        ts = [self._t(p) for p in (f.axis_start, f.axis_end) if p] or [self._t(f.axis_loc or self.origin)]
        return min(ts), max(ts)

    def _point(self, t: float) -> list[float]:
        return [self.origin[i] + t * self.axis[i] for i in range(3)]

    def _end_t(self, end: str) -> float:
        return self.lo if end == "lo" else self.hi

    def _cone_radius(self, f: FaceInfo, t: float) -> float:
        # r grows by tan(semi-angle) per unit along the cone's own axis direction, from RefRadius at its loc.
        sense = sum((f.axis_dir or self.axis)[i] * self.axis[i] for i in range(3))
        return (f.radius or 0.0) + (t - self._t(f.axis_loc or self.origin)) * math.copysign(1.0, sense) \
            * math.tan(f.half_angle or 0.0)

    def radius_at(self, end: str) -> float:
        t = self._end_t(end)
        rs = [f.radius or 0.0 for f, a, b in self.cyls if abs(a - t) <= self.tol or abs(b - t) <= self.tol]
        rs += [self._cone_radius(f, t) for f, a, b in self.cones if abs(a - t) <= self.tol or abs(b - t) <= self.tol]
        return max(rs, default=0.0)

    def capped_ends(self, topo: Topology, neighbor_ids: set[int], own: set[int]) -> set[str]:
        """Ends closed by a planar floor. Only a plane at an *extreme* of the stack can be a floor — a
        counterbore's shoulder is perpendicular too, but sits between two diameters — and it must be about
        the size of the disc it closes, so the part face a through hole exits into is never mistaken for one."""
        capped: set[str] = set()
        for n in neighbor_ids - own:
            nb = topo.faces[n]
            if nb.surface_type != "plane" or not (nb.normal and nb.point):
                continue
            along = sum(nb.normal[i] * self.axis[i] for i in range(3))
            if abs(along) <= 0.95:
                continue
            t = self._t(nb.point)
            for end in ("lo", "hi"):
                # A floor faces back into the hole. A face at the same height that faces away from it is the
                # rim the hole opens onto: a small boss top around the mouth is the right size for a floor,
                # and taking it for one puts the entry at the wrong end (NIST D2MI-904).
                if (along > 0) != (end == "lo"):
                    continue
                r = self.radius_at(end)
                if abs(t - self._end_t(end)) <= self.tol and nb.area <= 1.5 * math.pi * r * r:
                    capped.add(end)
        return capped

    def cap_faces(self, topo: Topology, neighbor_ids: set[int], own: set[int], ends: set[str]) -> list[int]:
        """The planar floor face(s) closing `ends` (same test as capped_ends): part of the hole, which is
        drilled down to them."""
        out = []
        for n in neighbor_ids - own:
            nb = topo.faces[n]
            if nb.surface_type != "plane" or not (nb.normal and nb.point):
                continue
            along = sum(nb.normal[i] * self.axis[i] for i in range(3))
            if abs(along) <= 0.95:
                continue
            t = self._t(nb.point)
            for end in ends:
                if (along > 0) != (end == "lo"):
                    continue
                r = self.radius_at(end)
                if abs(t - self._end_t(end)) <= self.tol and nb.area <= 1.5 * math.pi * r * r:
                    out.append(n)
        return out

    def _cone_at(self, end: str) -> tuple[FaceInfo, float, float] | None:
        """(cone, its radius at `end`, its radius at its other end) for a cone that reaches that end."""
        t = self._end_t(end)
        for f, a, b in self.cones:
            if not f.half_angle:
                continue
            if abs(a - t) <= self.tol:
                return f, max(self._cone_radius(f, t), 0.0), max(self._cone_radius(f, b), 0.0)
            if abs(b - t) <= self.tol:
                return f, max(self._cone_radius(f, t), 0.0), max(self._cone_radius(f, a), 0.0)
        return None

    def drill_point(self, end: str) -> tuple[float, float] | None:
        """(included angle°, axial length) of a cone that narrows to a point at `end`: the mark a drill's tip
        leaves at the bottom of a blind hole. Real models draw it (118° or 120°, sometimes 90° or 140°)."""
        found = self._cone_at(end)
        if found is None:
            return None
        f, r_end, r_inner = found
        if r_end > max(self.tol, 0.02 * r_inner) or r_inner <= r_end:
            return None
        a, b = self._span(f)
        return 2 * math.degrees(abs(f.half_angle)), b - a

    def entry_end(self, capped: set[str]) -> str:
        """Blind: the open end. Through: the widest end (the counterbore/countersink side), else the
        higher-Z end — the drill comes from above when nothing else says otherwise."""
        if len(capped) == 1:
            return "hi" if "lo" in capped else "lo"
        if not capped:
            r_lo, r_hi = self.radius_at("lo"), self.radius_at("hi")
            if abs(r_lo - r_hi) > self.tol:
                return "hi" if r_hi > r_lo else "lo"
        z_lo, z_hi = self._point(self.lo)[2], self._point(self.hi)[2]
        return "lo" if z_lo > z_hi + self.tol else "hi"

    def entry_point(self, end: str) -> list[float]:
        return self._point(self._end_t(end))

    def far_point(self, end: str) -> list[float]:
        return self._point(self.lo if end == "hi" else self.hi)

    def access_dir(self, end: str) -> list[float]:
        return list(self.axis) if end == "hi" else [-c for c in self.axis]

    def _from_entry(self, end: str, t: float) -> float:
        return abs(t - self._end_t(end))

    def steps(self, end: str) -> list[tuple[float, float]]:
        """(radius, depth from the entry face to where that diameter stops), shallowest first."""
        reach: dict[float, float] = {}
        for f, a, b in self.cyls:
            r = round(f.radius or 0.0, 4)
            reach[r] = max(reach.get(r, 0.0), self._from_entry(end, a), self._from_entry(end, b))
        return sorted(reach.items(), key=lambda kv: kv[1])

    def countersink(self, end: str) -> tuple[float, float, float] | None:
        """(radius at the entry face, included angle°, plunge depth of a matching pointed tool) for a cone
        that opens onto the entry, or None — a cone at the far end is not a countersink the tool can reach."""
        found = self._cone_at(end)
        if found is None:
            return None
        f, r, r_inner = found
        if r <= r_inner + self.tol:           # it narrows towards this end: a drill point, not a countersink
            return None
        half = abs(f.half_angle)
        return r, 2 * math.degrees(half), r / math.tan(half)


class HoleRecognizer(FeatureRecognizer):
    name = "hole"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        cyls = [f for f in topo.faces.values() if f.surface_type == "cylinder" and f.material_side == "internal"
                and f.face_id not in claimed]
        bores, _ = _split_closed(cyls)          # an unclosed internal cylinder is a channel, not a bore
        out: list[FeatureCandidate] = []
        for group in _group_collinear(bores):
            radii = sorted({round(f.radius, 4) for f in group if f.radius})
            if not radii:
                continue
            bore_r = radii[0]
            face_ids = [f.face_id for f in group]

            # Pull in a coaxial internal cone as an integral countersink, and detect a bottom cap.
            axis = group[0].axis_dir
            neighbor_ids = {n for f in group for n in topo.neighbors(f.face_id)}
            countersink = [
                topo.faces[n] for n in neighbor_ids
                if topo.faces[n].surface_type == "cone" and topo.faces[n].material_side == "internal" and collinear_axes(group[0], topo.faces[n])
            ]
            stack = _HoleStack(group, countersink)
            # An end is closed by a flat floor, or by the cone a drill's tip leaves. Either makes the hole blind.
            points = {end: stack.drill_point(end) for end in ("lo", "hi")}
            capped_ends = stack.capped_ends(topo, neighbor_ids, set(face_ids)) | {e for e, pt in points.items() if pt}
            through = not capped_ends
            entry_end = stack.entry_end(capped_ends)
            floor_ids = stack.cap_faces(topo, neighbor_ids, set(face_ids), capped_ends)
            sight_note = None
            if not capped_ends and abs(stack.radius_at("lo") - stack.radius_at("hi")) <= stack.tol:
                # Nothing marks a through hole's entry (no cap, no counterbore), so the default is the higher-Z
                # end. If that end opens into an enclosed cavity (a side hole into a pocket), no straight tool
                # reaches it along the axis: take the other end when that one is clear (corpus i08).
                other = "lo" if entry_end == "hi" else "hi"
                if (line_of_sight(topo, stack.entry_point(entry_end), stack.access_dir(entry_end)) is False
                        and line_of_sight(topo, stack.entry_point(other), stack.access_dir(other))):
                    entry_end = other
                    sight_note = "the other end has no straight line of sight out along the axis → entry from this end"
            entry, bottom, depth = stack.entry_point(entry_end), stack.far_point(entry_end), stack.length
            if depth <= 0.0:
                depth = sum(f.height for f in group if f.height) or (group[0].height or 0.0)
            # A drawing gives a blind hole's depth to the end of the full diameter; the drill point is extra.
            point = points["lo" if entry_end == "hi" else "hi"]
            tip, tip_depth = None, None
            if point and depth - point[1] > stack.tol:
                tip, tip_depth = bottom, depth
                depth -= point[1]
                bottom = [entry[i] - depth * stack.access_dir(entry_end)[i] for i in range(3)]
            steps = stack.steps(entry_end)
            csk = stack.countersink(entry_end)
            evidence = [
                f"{len(group)} internal cylindrical face(s) on a common axis",
                f"bore radius = {bore_r:.4f} mm (Ø{2 * bore_r:.4f})",
            ]
            confidence = 0.9
            if len(radii) > 1:
                evidence.append(f"multiple coaxial diameters {[f'Ø{2*r:.3f}' for r in radii]} → counterbore/stepped bore")
            # A centre drill cuts 60°; countersinks are 82°/90°/100°. The angle is the only thing that
            # tells a DIN 332 centre hole from a countersunk one, and they are different operations.
            # Only a cone that opens onto the entry is a countersink. A cone at the bottom is the drill point,
            # and one between two diameters is the step a drill leaves; neither is cut with a countersink.
            center_hole = csk is not None and abs(csk[1] - 60.0) <= 5.0
            # Within 2° of the 55°/65° split the angle cannot tell a centre hole from a countersink.
            near_split = csk is not None and abs(abs(csk[1] - 60.0) - 5.0) <= 2.0
            if countersink:
                face_ids += [c.face_id for c in countersink]
            face_ids += [f for f in floor_ids if f not in face_ids]
            if csk:
                evidence.append(f"coaxial internal cone ≈ {csk[1]:.0f}° opening onto the entry → "
                                f"{'centre-drilled pilot' if center_hole else 'countersunk entry'}")
            if tip_depth is not None:
                evidence.append(f"coaxial {point[0]:.0f}° cone narrowing to a point at the far end → drill-point bottom, "
                                f"blind; tip {tip_depth:.3f} mm from the entry face")
            elif capped_ends:
                evidence.append("planar cap closing one end of the stack → blind")
            else:
                evidence.append("open at both ends → through")
            evidence.append(f"entry on the {'open' if capped_ends else 'widest'} end; depth {depth:.3f} mm measured "
                            "from the entry face" + (" to the end of the full diameter" if tip_depth is not None
                                                     else ", across every coaxial segment"))
            if sight_note:
                evidence.append(sight_note)
            if not through:
                confidence += 0.03

            params = {
                "diameter": _round4(2 * bore_r),
                "diameters": [_round4(2 * r) for r in radii],
                "depth": _round4(depth),
                "through": through,
                "counterbored": len(radii) > 1,
                "countersunk": csk is not None,
                "center_hole": center_hole,
                # A blind hole's bottom: "drill_point" (a cone to a point, `depth` stops where it starts and
                # `tip_depth` reaches its tip) or "flat". None for a through hole.
                "bottom_type": None if through else ("drill_point" if tip_depth is not None else "flat"),
                "point_angle_deg": _round4(point[0]) if tip_depth is not None else None,
                "tip_depth": _round4(tip_depth) if tip_depth is not None else None,
                "axis": [_round4(x) for x in (axis or [])],
                "origin": [_round4(x) for x in (group[0].axis_loc or [])],
                "entry": [_round4(x) for x in entry],
                "bottom": [_round4(x) for x in bottom],
                # Unit vector from the bottom out through the entry: the side the tool comes in from.
                "access_dir": [_round4(x) for x in stack.access_dir(entry_end)],
                # Each coaxial diameter, entry side first, with how deep it runs from the entry face. The
                # last one is the bore; any before it are counterbores (flat-bottomed, to that depth).
                "steps": [{"diameter": _round4(2 * r), "depth": _round4(d)} for r, d in steps],
                "counterbore_diameter": _round4(2 * steps[0][0]) if len(steps) > 1 else None,
                "counterbore_depth": _round4(steps[0][1]) if len(steps) > 1 else None,
                "countersink_diameter": _round4(2 * csk[0]) if csk else None,
                "countersink_angle_deg": _round4(csk[1]) if csk else None,
                # The entry cone itself: a countersink or an entry chamfer, cut by a pointed tool, not the drill.
                "countersink_face_ids": [stack._cone_at(entry_end)[0].face_id] if csk else [],
                # How far a pointed tool of that angle must plunge from the entry face to cut the cone.
                "countersink_tip_depth": _round4(csk[2]) if csk else None,
            }
            edge_ids = sorted({e for f in group for e in f.edge_ids})
            alternatives = []
            if near_split:
                alternatives.append({
                    "label": "countersunk hole" if center_hole else "centre-drilled hole", "type": "hole",
                    "params": {"center_hole": not center_hole}, "method": "NEAR_THRESHOLD",
                    "confidence": round(min(confidence, 0.99) - 0.1, 3),
                    "reason": f"entry cone {csk[1]:.1f}° is within 2° of the 55°/65° limits of a 60° centre hole"})
            out.append(FeatureCandidate(id="", type=FeatureType.HOLE, face_ids=sorted(face_ids), edge_ids=edge_ids,
                                        params=params, confidence=min(confidence, 0.99), evidence=evidence,
                                        alternatives=alternatives))
            claimed.update(face_ids)
        return out


class ShaftBossRecognizer(FeatureRecognizer):
    """External cylinders: journals/bosses, plus the ring grooves turned into them.

    A stack of coaxial diameters is a *stepped shaft* only while it keeps getting smaller in one direction.
    A diameter that is smaller than the faces on **both** sides of it axially is not a step — it is a
    recess turned into the shaft (retaining-ring / O-ring groove), and it needs a grooving tool, not a
    turning pass. Pulling it out here is what stops the groove disappearing into `diameters`.
    """

    name = "shaft"
    _MAX_GROOVE_WIDTH_RATIO = 4.0      # groove width / radial depth; above this it is a journal

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        cyls = [f for f in topo.faces.values() if f.surface_type == "cylinder" and f.material_side == "external"
                and f.face_id not in claimed]
        journals, _ = _split_closed(cyls)
        out: list[FeatureCandidate] = []
        for group in _group_collinear(journals):
            axis = group[0].axis_dir or [0.0, 0.0, 1.0]
            groove_faces = self._ring_grooves(group, axis)
            for faces in groove_faces:
                out.append(self._groove(faces, axis))
                claimed.update(f.face_id for f in faces)
            group = [f for f in group if f.face_id not in claimed]
            if not group:
                continue
            radii = sorted({round(f.radius, 4) for f in group if f.radius})
            if not radii:
                continue
            r = radii[0]
            face_ids = [f.face_id for f in group]
            # Axial extent of the whole stack, not the sum of face heights (coaxial pieces of one split
            # cylinder would otherwise be counted twice).
            ends = [_axial_pos(f, axis) + s for f in group for s in (-(f.height or 0.0) / 2, (f.height or 0.0) / 2)]
            length = (max(ends) - min(ends)) if ends else (group[0].height or 0.0)
            # A journal that meets a planar face along a *concave* edge is rising off it: a boss, not a
            # plain OD. The blank's own cylinder meets its end faces convexly instead.
            standing = any(topo.faces[nb].surface_type == "plane"
                           for f in group for e in f.concave_edge_ids
                           if (nb := _other_face(topo, e, f.face_id)) is not None)
            params = {
                "diameter": _round4(2 * r),
                "diameters": [_round4(2 * x) for x in radii],
                "length": _round4(length),
                "standing_on_base": standing,
                "axis": [_round4(x) for x in (group[0].axis_dir or [])],
                "origin": [_round4(x) for x in (group[0].axis_loc or [])],
            }
            evidence = [f"{len(group)} external cylindrical face(s) closing a full turn on a common axis",
                        f"radius = {r:.4f} mm (Ø{2*r:.4f})"]
            if len(radii) > 1:
                evidence.append("multiple coaxial diameters → stepped shaft/boss")
            if standing:
                evidence.append("concave edge to a planar face → cylindrical boss standing on a base")
            out.append(FeatureCandidate(id="", type=FeatureType.SHAFT, face_ids=sorted(face_ids),
                                        edge_ids=sorted({e for f in group for e in f.edge_ids}),
                                        params=params, confidence=0.9, evidence=evidence))
            claimed.update(face_ids)
        return out

    @staticmethod
    def _ring_grooves(group: list[FaceInfo], axis) -> list[list[FaceInfo]]:
        """Faces whose radius dips below both axial neighbours — each dip is one ring groove."""
        by_pos = sorted(group, key=lambda f: _axial_pos(f, axis))
        if len(by_pos) < 3:
            return []
        out = []
        for i in range(1, len(by_pos) - 1):
            r = by_pos[i].radius or 0.0
            shoulder = min(by_pos[i - 1].radius or 0.0, by_pos[i + 1].radius or 0.0)
            if r >= shoulder - 1e-6:
                continue
            # Width guard: a groove is sunk by a form tool roughly as wide as it is deep. A long reduced
            # section between two collars is a journal (demo_shaft_pmi: Ø20 over 40 mm between two Ø30
            # collars) and must stay part of the stepped shaft, not become a groove.
            if (by_pos[i].height or 0.0) > ShaftBossRecognizer._MAX_GROOVE_WIDTH_RATIO * (shoulder - r):
                continue
            out.append([by_pos[i]])
        return out

    @staticmethod
    def _groove(faces: list[FaceInfo], axis) -> FeatureCandidate:
        f = faces[0]
        params = {
            "root_diameter": _round4(2 * (f.radius or 0.0)),
            "width": _round4(f.height),
            "axis": [_round4(x) for x in (axis or [])],
            "origin": [_round4(x) for x in (f.axis_loc or [])],
            "annular": True,
        }
        return FeatureCandidate(
            id="", type=FeatureType.GROOVE, face_ids=[f.face_id], edge_ids=list(f.edge_ids), params=params,
            confidence=0.88,
            evidence=[f"coaxial diameter Ø{2*(f.radius or 0):.3f} smaller than both axial neighbours → turned recess",
                      f"groove width {f.height:.3f} mm → grooving tool, not a turning pass"])


class ConeRecognizer(FeatureRecognizer):
    """Standalone cones not consumed by a hole: external → chamfer; internal → countersink when it opens into
    a bore on its axis, else a chamfer round the rim of a curved recess (no hole, nothing to countersink)."""

    name = "cone"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        bores = _split_closed([f for f in topo.faces.values()
                               if f.surface_type == "cylinder" and f.material_side == "internal"])[0]
        bore_ids = {b.face_id for b in bores}                 # a bore is often written as two half-cylinders
        for f in topo.faces.values():
            if f.surface_type != "cone" or f.face_id in claimed:
                continue
            internal = f.material_side == "internal"
            on_a_bore = internal and any(n in bore_ids and collinear_axes(f, topo.faces[n]) for n in topo.neighbors(f.face_id))
            ftype = FeatureType.COUNTERSINK if on_a_bore else FeatureType.CHAMFER
            angle_deg = math.degrees(f.half_angle) if f.half_angle is not None else None
            params = {
                "half_angle_deg": _round4(angle_deg) if angle_deg is not None else None,
                "included_angle_deg": _round4(2 * angle_deg) if angle_deg is not None else None,
                "axis": [_round4(x) for x in (f.axis_dir or [])],
                "origin": [_round4(x) for x in (f.axis_loc or [])],
            }
            evidence = [f"{'internal' if internal else 'external'} conical face",
                        f"included angle ≈ {2*angle_deg:.1f}°" if angle_deg is not None else "conical surface"]
            out.append(FeatureCandidate(id="", type=ftype, face_ids=[f.face_id], edge_ids=list(f.edge_ids),
                                        params=params, confidence=0.8, evidence=evidence))
            claimed.add(f.face_id)
        return out


class TorusRecognizer(FeatureRecognizer):
    """Toroidal blends: concave → fillet, convex → round."""

    name = "torus"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        for f in topo.faces.values():
            if f.surface_type != "torus" or f.face_id in claimed:
                continue
            convex = self._convex(f)
            ftype = FeatureType.ROUND if convex else FeatureType.FILLET
            params = {"radius": _round4(f.radius), "major_radius": _round4(f.major_radius),
                      "axis": [_round4(x) for x in (f.axis_dir or [])]}
            evidence = [f"toroidal blend, tube radius = {f.radius:.4f} mm", "convex → round (external)" if convex else "concave → fillet (internal)"]
            out.append(FeatureCandidate(id="", type=ftype, face_ids=[f.face_id], edge_ids=list(f.edge_ids),
                                        params=params, confidence=0.82, evidence=evidence))
            claimed.add(f.face_id)
        return out

    @staticmethod
    def _convex(f: FaceInfo) -> bool:
        if not (f.point and f.normal and f.axis_loc and f.axis_dir and f.major_radius):
            return False
        rel = [f.point[i] - f.axis_loc[i] for i in range(3)]
        proj = sum(rel[i] * f.axis_dir[i] for i in range(3))
        radial = [rel[i] - proj * f.axis_dir[i] for i in range(3)]
        n = math.sqrt(sum(c * c for c in radial))
        if n < 1e-9:
            return False
        radial = [c / n for c in radial]
        tube_center = [f.axis_loc[i] + radial[i] * f.major_radius for i in range(3)]
        to_surf = [f.point[i] - tube_center[i] for i in range(3)]
        return sum(f.normal[i] * to_surf[i] for i in range(3)) > 0


class SphereRecognizer(FeatureRecognizer):
    """Spherical faces: concave (material outside) → seat, convex → boss."""

    name = "sphere"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        # A CAD kernel often splits one sphere into two faces at its seam. Faces on the same sphere (centre,
        # radius, side of the material) that touch are one feature, so a ball is inspected and machined once.
        spheres = [f for f in topo.faces.values() if f.surface_type == "sphere" and f.face_id not in claimed]
        seen: set[int] = set()
        for f in spheres:
            if f.face_id in seen:
                continue
            group = [f]
            seen.add(f.face_id)
            grew = True
            while grew:
                grew = False
                for g in spheres:
                    if g.face_id not in seen and self._same_sphere(f, g) and any(g.face_id in topo.adjacency.get(m.face_id, ()) for m in group):
                        group.append(g)
                        seen.add(g.face_id)
                        grew = True
            internal = f.material_side == "internal"
            ftype = FeatureType.SPHERICAL_SEAT if internal else FeatureType.SPHERICAL_BOSS
            params = {"radius": _round4(f.radius), "diameter": _round4(2 * f.radius) if f.radius else None,
                      "center": [_round4(x) for x in (f.axis_loc or [])]}
            evidence = [f"spherical face, radius = {f.radius:.4f} mm",
                        "concave → spherical seat" if internal else "convex → spherical boss"]
            if len(group) > 1:
                evidence.append(f"{len(group)} faces on the same sphere (split at the seam) → one feature")
            face_ids = sorted(g.face_id for g in group)
            edge_ids = sorted({e for g in group for e in g.edge_ids})
            out.append(FeatureCandidate(id="", type=ftype, face_ids=face_ids, edge_ids=edge_ids,
                                        params=params, confidence=0.85, evidence=evidence))
            claimed.update(face_ids)
        return out

    @staticmethod
    def _same_sphere(a: FaceInfo, b: FaceInfo, tol: float = 1e-3) -> bool:
        if a.material_side != b.material_side or not (a.radius and b.radius and a.axis_loc and b.axis_loc):
            return False
        return abs(a.radius - b.radius) <= tol and math.dist(a.axis_loc, b.axis_loc) <= tol


def _dot(a, b):
    return sum(a[i] * b[i] for i in range(3))


def _perp(n1, n2, tol_deg: float = 20.0) -> bool:
    """True when two unit normals are roughly perpendicular (floor ⟂ wall)."""
    if not (n1 and n2):
        return False
    return abs(_dot(n1, n2)) <= math.sin(math.radians(tol_deg))


def _parallel(d1, d2, tol_deg: float = 15.0) -> bool:
    """True when two directions are (anti)parallel (corner-fillet axis ∥ floor normal)."""
    if not (d1 and d2):
        return False
    return abs(_dot(d1, d2)) >= math.cos(math.radians(tol_deg))


def _coplanar(a: FaceInfo, b: FaceInfo) -> bool:
    """Two planar faces on one plane, facing the same way: pieces of one surface that a cut separated."""
    return (a.surface_type == "plane" and b.surface_type == "plane" and bool(a.normal and b.normal and a.point and b.point)
            and _dot(a.normal, b.normal) > 0.9999
            and abs(_dot(a.normal, [a.point[k] - b.point[k] for k in range(3)])) < 1e-4)


def _distinct_planes(topo: Topology, face_ids) -> list[int]:
    """One face per plane among `face_ids`: a wall a crossing cut split into pieces is still one wall."""
    out: list[int] = []
    for f in face_ids:
        fi = topo.faces[f]
        if fi.surface_type != "plane" or not any(_coplanar(fi, topo.faces[o]) for o in out):
            out.append(f)
    return out


def _surrounds(floor_normal, normals) -> bool:
    """Seen from above the floor, the walls' normals point every way (no half-plane holds them all): the walls
    close round the floor, as a pocket's do, rather than standing along one side of it, as a step's do."""
    if not floor_normal:
        return False
    a = _cross3(floor_normal, [1.0, 0.0, 0.0]) if abs(floor_normal[0]) < 0.9 else _cross3(floor_normal, [0.0, 1.0, 0.0])
    m = math.sqrt(_dot(a, a))
    u = [c / m for c in a]
    v = _cross3(floor_normal, u)
    angles = sorted(math.atan2(_dot(n, v), _dot(n, u)) for n in normals
                    if n and math.hypot(_dot(n, u), _dot(n, v)) > 1e-6)
    if len(angles) < 3:
        return False
    gaps = [b - a for a, b in zip(angles, angles[1:])] + [angles[0] + 2 * math.pi - angles[-1]]
    return max(gaps) < math.pi - 1e-3


def _envelope(topo: Topology) -> tuple[list[float], list[float]]:
    """The part's bounding box, computed once per topology from the exact geometry: a box grown by the file's
    tolerance (0.01 mm in many real files) has no face lying on it."""
    env = getattr(topo, "_envelope_box", None)
    if env is None and topo.shape is not None:
        try:
            from OCP.Bnd import Bnd_Box
            from OCP.BRepBndLib import BRepBndLib
            box = Bnd_Box()
            BRepBndLib.AddOptimal_s(topo.shape, box, False, False)
            x0, y0, z0, x1, y1, z1 = box.Get()
            env = ([x0, y0, z0], [x1, y1, z1])
        except Exception:  # noqa: BLE001 - fall back to the faces' boxes
            env = None
    if env is None:
        boxes = [f for f in topo.faces.values() if f.bbox_min and f.bbox_max]
        env = ([min(f.bbox_min[i] for f in boxes) for i in range(3)],
               [max(f.bbox_max[i] for f in boxes) for i in range(3)]) if boxes else ([0.0] * 3, [0.0] * 3)
        try:
            topo._envelope_box = env
        except AttributeError:
            pass
    return env


def _on_envelope(f: FaceInfo, lo, hi) -> bool:
    """A plane lying on a side of the part's bounding box (within 0.01 % of its size: a real part may have
    something standing a few hundredths proud of its end face): an outside face of the stock, not one a cut made."""
    if f.surface_type != "plane" or not f.normal or not f.point:
        return False
    ax = max(range(3), key=lambda i: abs(f.normal[i]))
    if abs(abs(f.normal[ax]) - 1.0) > 1e-6:
        return False
    tol = max(1e-4, 1e-4 * math.dist(lo, hi))
    return abs(f.point[ax] - (hi[ax] if f.normal[ax] > 0 else lo[ax])) < tol


def _opens_onto_outside(topo: Topology, floor: FaceInfo, own: set[int]) -> bool:
    """Some open side of a recess's floor (an edge none of its own walls closes) leads onto the outside of the
    part: a plane on its envelope, or a turned outer surface. A step is cut at the outside; a recess whose open
    sides lead only into other cuts is a pocket those cuts broke into."""
    lo, hi = _envelope(topo)
    for e in floor.outer_edge_ids or floor.edge_ids:
        g = _other_face(topo, e, floor.face_id)
        if g is None or g in own:
            continue
        gi = topo.faces[g]
        if _on_envelope(gi, lo, hi) or (gi.surface_type != "plane" and gi.material_side == "external"):
            return True
    return False


def _span(f: FaceInfo, d) -> tuple[float, float]:
    """The extent of a face along direction `d`, from the corners of its bounding box (an over-estimate
    for an oblique `d`, so two faces only look apart when they are)."""
    if not (f.bbox_min and f.bbox_max):
        return (0.0, 0.0)
    lo, hi = f.bbox_min, f.bbox_max
    ts = [_dot([(lo, hi)[i >> k & 1][k] for k in range(3)], d) for i in range(8)]
    return min(ts), max(ts)


def _other_face(topo: Topology, edge_id: int, face_id: int) -> int | None:
    fids = topo.edge_faces.get(edge_id, [])
    for f in fids:
        if f != face_id:
            return f
    return None


def _concave_components(topo: Topology, faces: set[int]) -> list[set[int]]:
    """Connected components of `faces` linked by concave edges (each is one pocket/slot/step candidate)."""
    seen: set[int] = set()
    comps: list[set[int]] = []
    for start in faces:
        if start in seen:
            continue
        comp: set[int] = set()
        stack = [start]
        while stack:
            f = stack.pop()
            if f in comp:
                continue
            comp.add(f)
            seen.add(f)
            for eid in topo.faces[f].concave_edge_ids:
                nb = _other_face(topo, eid, f)
                if nb is not None and nb in faces and nb not in comp:
                    stack.append(nb)
        comps.append(comp)
    return comps


def _plane_footprint(info: FaceInfo) -> tuple[float, float]:
    """(width, length) of a planar face from its AABB — the two extents not along its normal."""
    if not (info.bbox_min and info.bbox_max and info.normal):
        return 0.0, 0.0
    dims = [abs(info.bbox_max[i] - info.bbox_min[i]) for i in range(3)]
    # drop the axis most aligned with the normal (the near-zero-thickness one for a planar face)
    drop = max(range(3), key=lambda i: abs(info.normal[i]))
    kept = sorted(d for i, d in enumerate(dims) if i != drop)
    return (kept[0], kept[1]) if len(kept) == 2 else (0.0, 0.0)


def _depth_along(normal, floor_pt, wall: FaceInfo) -> float:
    """How far `wall` rises from the floor plane, measured along the floor normal."""
    if not (wall.bbox_min and wall.bbox_max and normal and floor_pt):
        return 0.0
    base = _dot(normal, floor_pt)
    corners = [[(wall.bbox_min if b & 1 else wall.bbox_max)[0],
                (wall.bbox_min if b & 2 else wall.bbox_max)[1],
                (wall.bbox_min if b & 4 else wall.bbox_max)[2]] for b in range(8)]
    return max(abs(_dot(normal, c) - base) for c in corners)


class PrismaticRecognizer(FeatureRecognizer):
    """Pocket / slot / step / groove from concave-edge regions (PLAN.md §B2).

    A prismatic recess is a **floor** joined by concave edges to upstanding **walls**. Faces are grouped
    into concave-connected components; within each, the floor is the planar face perpendicular to the most
    other planar faces (ties by area), and the rest are classified by how they sit relative to it:

      * **wall** — rises from the floor. Accepted out to `_WALL_DRAFT_DEG` of draft, because a wall is very
        often tapered and a strict perpendicular test simply loses the whole feature (a 29° drafted
        shoulder used to vanish: no walls found, so no step emitted).
      * **overhang** — faces *back down* at the floor from above. Material hangs over the opening, so the
        feature cannot be cut from above at all: this is the T-slot signature.
      * **corner** — a vertical cylindrical corner blend, whose radius caps the finishing-tool radius.

    The type then follows from how the floor is enclosed, which is what decides how the feature is
    cut: walls on opposite sides and a long footprint is a slot; a fully-enclosed floor is a closed
    pocket; a floor walled on some sides is an open pocket; one or two adjoining walls is a step.
    """

    name = "prismatic"
    _SLOT_ASPECT = 3.0
    _ASPECT_MARGIN = 0.2      # within ±20 % of _SLOT_ASPECT the other reading is reported as an alternative
    _WALL_DRAFT_DEG = 45.0        # how far a wall may lean off perpendicular and still be a wall
    _OVERHANG_DOT = -0.05         # wall normal opposing the floor normal => material hangs over the mouth
    _MAX_OVERHANG_AREA = 0.6      # an overhang is a ledge; a same-size opposing face is the far wall
    _VEE_AREA_TOL = 0.6           # a vee's flanks are mirror images; another cut may trim one, so loosely

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        region = {fid for fid, f in topo.faces.items()
                  if f.face_id not in claimed and f.normal is not None and f.concave_edge_ids}
        out: list[FeatureCandidate] = []
        for comp in _concave_components(topo, region):
            # Touching recesses (a pocket cut into another's wall, two steps meeting) share one concave region.
            # Take one, then look again in what is left of the region, as long as it still holds a recess.
            left = set(comp)
            while len(left) >= 2:
                cand = self._vee(topo, left) or self._prismatic(topo, left, claimed)
                if not cand or not set(cand.face_ids) & left:
                    break
                out.append(cand)
                claimed.update(cand.face_ids)
                left -= set(cand.face_ids)
                left = max(_concave_components(topo, left), key=len, default=set()) if left else set()
        return out

    def _vee(self, topo: Topology, comp: set[int]) -> FeatureCandidate | None:
        """Two symmetric flanks meeting at a concave apex — a vee groove, which has no floor to find."""
        faces = [topo.faces[c] for c in comp]
        if len(faces) != 2 or any(f.surface_type != "plane" or not f.normal for f in faces):
            return None
        a, b = faces
        if abs(a.area - b.area) > self._VEE_AREA_TOL * max(a.area, b.area):
            return None                      # an L-shaped step: floor and wall are not mirror images
        # Both flanks must be oblique to the blank. A step's floor lies parallel to a stock face, and on a
        # square corner its floor and wall areas can easily match — area symmetry alone is not enough.
        # (Within 1°: a step's floor and wall are exactly parallel to stock faces; a vee flank 12° off a side
        # face is still oblique.)
        if any(_parallel(f.normal, g.normal, 1.0) for f in faces
               for gid, g in topo.faces.items()
               if gid not in comp and g.surface_type == "plane" and g.normal):
            return None
        included = math.degrees(math.acos(max(-1.0, min(1.0, -_dot(a.normal, b.normal)))))
        if not 2.0 < included < 160.0:
            return None
        width, length = _plane_footprint(a)
        depth = width * math.cos(math.radians(included / 2.0)) / max(math.sin(math.radians(included / 2.0)), 1e-6)
        params = {
            "profile": "vee",
            "included_angle_deg": _round4(included),
            "width": _round4(2 * width * math.sin(math.radians(included / 2.0))),
            "depth": _round4(depth),
            "length": _round4(length),
            "flank_face_ids": sorted(comp),
        }
        return FeatureCandidate(
            id="", type=FeatureType.SLOT, face_ids=sorted(comp),
            edge_ids=sorted({e for c in comp for e in topo.faces[c].edge_ids}), params=params, confidence=0.82,
            evidence=["two equal-area planar flanks meeting at a concave apex → vee profile, no planar floor",
                      f"included angle ≈ {included:.1f}° → vee/chamfer cutter"])

    def _prismatic(self, topo: Topology, comp: set[int], claimed: set[int]) -> FeatureCandidate | None:
        floor_id = self._pick_floor(topo, comp)
        if floor_id is None:
            return None
        floor = topo.faces[floor_id]
        walls, overhangs, corners, bulges = [], [], [], []
        opposed = False
        wall_cos = math.sin(math.radians(self._WALL_DRAFT_DEG))
        for c in comp:
            if c == floor_id:
                continue
            fc = topo.faces[c]
            if fc.surface_type == "plane" and fc.normal:
                d = _dot(floor.normal, fc.normal)
                if d < self._OVERHANG_DOT and abs(d) > wall_cos:
                    # Only an overhang if it sits *above* the floor plane. A through opening also has a
                    # face antiparallel to the floor — the far side of the plate — but that one is below,
                    # and reading it as an overhang turned every through pocket into a bogus T-slot.
                    above = fc.point and _dot(floor.normal, fc.point) - _dot(floor.normal, floor.point) > 1e-6
                    if above and fc.area <= self._MAX_OVERHANG_AREA * floor.area:
                        overhangs.append(c)
                    elif above:
                        opposed = True        # a same-size face squarely facing the floor: no floor here
                elif abs(d) <= wall_cos:
                    walls.append(c)
            elif fc.surface_type == "cylinder" and fc.material_side == "internal" \
                    and _parallel(fc.axis_dir, floor.normal):
                corners.append(c)
            elif fc.surface_type == "cylinder" and fc.material_side == "external" \
                    and _parallel(fc.axis_dir, floor.normal) and self._between_two_walls(topo, fc, floor):
                bulges.append(c)          # a corner of the outline bulging into the recess (engraved lettering)
        if opposed:
            # A through opening: every face has a same-size partner squarely facing it, so whichever one
            # is picked as the "floor" has another one directly over it. There is no floor to mill down
            # to, and treating the far wall as an overhang used to report a plain square hole as an
            # undercut T-slot. Leave the faces to PlaneRecognizer rather than invent a recess.
            return None
        if not walls and not corners:
            return None
        # Rounded ends bound the floor as much as flat walls do: a pocket at an angle to the axes has flat walls
        # that stop short of its floor's extent, and only its ends reach it.
        if walls and self._walls_are_an_island(floor, [topo.faces[w] for w in walls + corners]):
            return None
        mouth = self._mouth_walls(topo, comp, walls, overhangs, claimed)
        return self._build(topo, floor, walls, overhangs, corners, mouth, bulges)

    @staticmethod
    def _between_two_walls(topo: Topology, f: FaceInfo, floor: FaceInfo) -> bool:
        """A convex corner of the recess's own outline sits between two of its walls: the faces on either side
        of it (across edges along its axis) both stand on the recess's floor. A round on an edge of the part that
        a step was later cut under sits between the part's outside faces, which do not."""
        sides = set()
        for e in f.edge_ids:
            g = _other_face(topo, e, f.face_id)
            ed = topo.edges.get(e)
            d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
            if g is not None and g != floor.face_id and d and f.axis_dir and abs(abs(_dot(d, f.axis_dir)) - 1.0) < 1e-3:
                sides.add(g)
        return len(sides) >= 2 and all(
            any(_other_face(topo, e, s) == floor.face_id and topo.convexity(e) == "concave" for e in topo.faces[s].edge_ids)
            for s in sides)

    @staticmethod
    def _mouth_walls(topo: Topology, comp: set[int], walls: list[int], overhangs: list[int],
                     claimed: set[int]) -> list[int]:
        """The walls of an undercut slot's narrow mouth, which the concave region never reaches.

        A T-slot's mouth walls meet the overhanging ledges at the lip — a *convex* edge — and the top face
        at another convex edge, so they carry no concave edge and never join the head's region. Without
        them the slot has only the head's depth and width, and no cutter can be chosen. A mouth wall is a
        planar face across a convex edge from an overhang that faces the same way as a head wall (the
        part's end faces also touch the ledge convexly, but face along the slot, not across it)."""
        if not overhangs:
            return []
        head_normals = [topo.faces[w].normal for w in walls if topo.faces[w].normal]
        same_sense = math.cos(math.radians(15.0))
        mouth: list[int] = []
        for o in overhangs:
            for e in topo.faces[o].convex_edge_ids:
                m = _other_face(topo, e, o)
                if m is None or m in comp or m in claimed or m in mouth:
                    continue
                fm = topo.faces[m]
                if fm.surface_type == "plane" and fm.normal \
                        and any(_dot(fm.normal, n) >= same_sense for n in head_normals):
                    mouth.append(m)
        return mouth

    @staticmethod
    def _mouth_width(topo: Topology, mouth: list[int]) -> float | None:
        """Gap between two opposed mouth walls, measured along their (shared) normal."""
        for i, a in enumerate(mouth):
            for b in mouth[i + 1:]:
                fa, fb = topo.faces[a], topo.faces[b]
                if fa.point and fb.point and _parallel(fa.normal, fb.normal):
                    return abs(_dot(fa.normal, [fa.point[k] - fb.point[k] for k in range(3)]))
        return None

    @staticmethod
    def _walls_are_an_island(floor: FaceInfo, walls: list[FaceInfo]) -> bool:
        """True when the walls sit *within* the floor rather than bounding it — so it is not their floor.

        A plate's top face is concave to the walls of every through opening in it, so without this it gets
        picked as their "floor" and the whole face disappears into a feature whose width and length are
        the plate's. The test is margin, not size: a pocket's walls stand on the floor's boundary and a
        step's run off its edge, but a hole's walls leave floor on *both* sides along *every* free axis.
        A plain size ratio cannot say this — a drafted step's floor legitimately overhangs its wall."""
        if not (floor.bbox_min and floor.bbox_max) or not all(w.bbox_min and w.bbox_max for w in walls):
            return False
        lo = [min(w.bbox_min[i] for w in walls) for i in range(3)]
        hi = [max(w.bbox_max[i] for w in walls) for i in range(3)]
        drop = max(range(3), key=lambda i: abs((floor.normal or [0, 0, 1])[i]))
        for i in range(3):
            if i == drop:
                continue
            span = floor.bbox_max[i] - floor.bbox_min[i]
            margin = 0.01 * span
            if not (lo[i] - floor.bbox_min[i] > margin and floor.bbox_max[i] - hi[i] > margin):
                return False          # the walls reach an edge of the floor on this axis → they bound it
        return True

    @staticmethod
    def _pick_floor(topo: Topology, comp: set[int]) -> int | None:
        """The floor: the planar face perpendicular to every other planar face, largest first.

        Perpendicularity is judged at `_WALL_DRAFT_DEG`, not the tighter `_perp` default, or a drafted
        step finds no floor at all and the whole feature is dropped.

        An undercut feature has no such face — a T-slot's head floor is *antiparallel* to the two ledges
        hanging over it — so the fallback takes the largest planar face that is perpendicular to anything.
        Doing it the other way round (always counting perpendicular faces) picks a side wall: the ledges
        make a wall look perpendicular to more faces than the floor is."""
        tol = PrismaticRecognizer._WALL_DRAFT_DEG
        planar = [f for f in comp if topo.faces[f].surface_type == "plane" and topo.faces[f].normal]
        if len(planar) == 1:
            # One plane and curved walls only (a circular step, a round-ended recess): the plane is the floor
            # when a wall stands on it, its axis along the plane's normal.
            nf = topo.faces[planar[0]].normal
            if any(topo.faces[c].surface_type == "cylinder" and topo.faces[c].material_side == "internal"
                   and topo.faces[c].axis_dir and _parallel(topo.faces[c].axis_dir, nf, 5.0) for c in comp):
                return planar[0]
        strict, loose = [], []
        for f in planar:
            nf = topo.faces[f].normal
            others = [g for g in planar if g != f]
            n_perp = sum(1 for g in others if _perp(nf, topo.faces[g].normal, tol))
            if others and n_perp == len(others):
                strict.append(f)
            if n_perp:
                loose.append(f)
        def lean(f):
            nf = topo.faces[f].normal
            return max(abs(_dot(nf, topo.faces[g].normal)) for g in planar if g != f)

        def curved_on(f):
            """Rounded ends and corners standing on `f`: hollow cylinders whose axis is its normal."""
            nf = topo.faces[f].normal
            return sum(1 for c in comp if topo.faces[c].surface_type == "cylinder"
                       and topo.faces[c].material_side == "internal" and topo.faces[c].axis_dir
                       and _parallel(topo.faces[c].axis_dir, nf, 5.0))

        if strict:
            # The floor is the face the others stand on *most* squarely. "Within 45°" alone also admits each
            # wall of a triangular pocket (its walls are 60° apart), and a wall outweighs the floor in area.
            # Rounded ends and corners stand on the floor too, never on a wall.
            return min(strict, key=lambda f: (-curved_on(f), round(lean(f), 3), -topo.faces[f].area))
        # Another feature cut into the recess can add one face that fits neither way (a 45° face of a
        # neighbouring cut). A floor still has every other wall square to it and nothing facing it back: an
        # antiparallel member means an opposite wall or a ledge, so a T-slot (whose floor faces its ledges)
        # still falls through to the rule below.
        near = []
        for f in planar:
            nf = topo.faces[f].normal
            others = [topo.faces[g].normal for g in planar if g != f]
            n_perp = sum(1 for n in others if _perp(nf, n, tol))
            n_anti = sum(1 for n in others if _dot(nf, n) < -0.9)
            if n_anti == 0 and len(others) - n_perp <= 1 and n_perp >= 2:
                near.append((n_perp, f))
        if near:
            # Again the face its walls stand on most squarely: a chamfer crossing a pocket's floor touches
            # as many walls as the floor does, but at a slant.
            def lean_on(f):
                nf = topo.faces[f].normal
                return max(abs(_dot(nf, topo.faces[g].normal)) for g in planar
                           if g != f and _perp(nf, topo.faces[g].normal, tol))
            best = max(n for n, _ in near)
            return min((f for n, f in near if n == best), key=lambda f: (round(lean_on(f), 3), -topo.faces[f].area))
        return max(loose, key=lambda f: topo.faces[f].area) if loose else None

    @staticmethod
    def _drilled_into(topo: Topology, floor: FaceInfo, edge_id: int) -> bool:
        g = _other_face(topo, edge_id, floor.face_id)
        f = topo.faces.get(g) if g is not None else None
        return (f is not None and f.surface_type in ("cylinder", "cone") and f.material_side == "internal"
                and _parallel(f.axis_dir, floor.normal, 1.0))

    def _build(self, topo: Topology, floor: FaceInfo, walls: list[int], overhangs: list[int],
               corners: list[int], mouth: list[int], bulges: list[int] | None = None) -> FeatureCandidate | None:
        bulges = bulges or []
        boundary = set(walls) | set(corners) | set(overhangs) | set(bulges)
        walled_edges = [e for e in floor.concave_edge_ids if _other_face(topo, e, floor.face_id) in boundary]
        # A hole drilled down into the floor (an internal cylinder/cone along the floor normal) pierces the
        # floor; its rim is not an open side. Without this a closed pocket with a hole in it reads as open
        # (interacting-feature corpus i01/i06/i11).
        # Only the floor's outer boundary can be open: an inner loop is a cut through the floor (a passage, a
        # hole) or an island standing on it, and a pocket pierced by a passage is still closed all round.
        outer = set(floor.outer_edge_ids or floor.edge_ids)
        pierced = [e for e in floor.edge_ids if e not in walled_edges
                   and (e not in outer or self._drilled_into(topo, floor, e))]
        n_floor_edges = len(floor.edge_ids) - len(pierced)
        open_ends = max(sum(1 for e in floor.edge_ids if e not in pierced and e not in walled_edges), 0)
        closed = n_floor_edges > 0 and open_ends == 0
        width, length = _plane_footprint(floor)
        head_depth = max((_depth_along(floor.normal, floor.point, topo.faces[w]) for w in walls + overhangs), default=0.0)
        # An undercut slot is cut from its opening, so its depth runs from the floor up through the mouth.
        depth = max([head_depth, *(_depth_along(floor.normal, floor.point, topo.faces[m]) for m in mouth)])
        mouth_width = self._mouth_width(topo, mouth)
        aspect = (length / width) if width > 1e-6 else 0.0
        corner_radii = sorted({_round4(topo.faces[c].radius) for c in corners if topo.faces[c].radius})

        # Draft: how far the most-tilted wall leans off perpendicular to the floor.
        drafts = [abs(90.0 - math.degrees(math.acos(max(-1.0, min(1.0, abs(_dot(floor.normal, topo.faces[w].normal)))))))
                  for w in walls if topo.faces[w].normal]
        draft = max(drafts) if drafts else 0.0
        undercut_walls = [w for w in walls if _dot(floor.normal, topo.faces[w].normal) < self._OVERHANG_DOT]

        if overhangs:
            profile, undercut = "tee", True
        elif undercut_walls:
            profile, undercut = "dovetail", True
        else:
            profile, undercut = "rectangular", False

        # A slot's side walls face each other. Two walls facing the same way are a staircase, or the two
        # halves of a ridged floor, never the sides of a slot.
        distinct = _distinct_planes(topo, walls)
        opposed_pairs = sum(1 for i, a in enumerate(distinct) for b in distinct[i + 1:]
                            if _dot(topo.faces[a].normal, topo.faces[b].normal) <= -math.cos(math.radians(15.0)))
        # A pocket's walls close round its floor; a step's stand along one side of it, all facing the same half.
        surround = _surrounds(floor.normal, [topo.faces[w].normal for w in distinct])
        # Two walls square to each other: a corner step, whatever its open sides lead into.
        square_corner = len(distinct) == 2 and abs(_dot(topo.faces[distinct[0]].normal, topo.faces[distinct[1]].normal)) < 0.1
        on_cylinder = any(topo.faces[n].surface_type == "cylinder" and topo.faces[n].material_side == "external"
                          for f in [floor.face_id, *walls] for n in topo.neighbors(f))

        if undercut or (opposed_pairs and aspect >= self._SLOT_ASPECT):
            ftype, label = FeatureType.SLOT, f"{profile} slot"
        elif closed:
            ftype, label = (FeatureType.SLOT, "slot") if aspect >= self._SLOT_ASPECT else (FeatureType.POCKET, "closed pocket")
        elif len(distinct) >= 3 and (opposed_pairs or surround):
            ftype, label = FeatureType.POCKET, "open pocket"
        elif distinct and not square_corner and not _opens_onto_outside(topo, floor, boundary):
            # A step is cut at the outside of the part. Walls whose open side leads only into other cuts are
            # what is left of a pocket those cuts broke into (MFCAD++ val: 691 pocket faces to 27 step faces).
            ftype, label = FeatureType.POCKET, "open pocket (opened by another cut)"
        else:
            ftype, label = FeatureType.STEP, "step/shoulder"

        # A slot and a pocket differ only in proportion. Within 20 % of the split, say the other reading too.
        alternatives = []
        if not undercut and opposed_pairs and abs(aspect - self._SLOT_ASPECT) <= self._ASPECT_MARGIN * self._SLOT_ASPECT:
            if ftype == FeatureType.SLOT:
                other, other_label = ((FeatureType.POCKET, "closed pocket") if closed else
                                      (FeatureType.POCKET, "open pocket") if len(distinct) >= 3
                                      else (FeatureType.STEP, "step/shoulder"))
            else:
                other, other_label = FeatureType.SLOT, "slot"
            alternatives.append({"label": other_label, "type": other.value, "params": {}, "method": "NEAR_THRESHOLD",
                                 "reason": f"length / width {aspect:.2f} is within {self._ASPECT_MARGIN:.0%} of the "
                                           f"{self._SLOT_ASPECT:g} that separates a slot from a pocket"})

        face_ids = sorted([floor.face_id, *walls, *overhangs, *corners, *mouth, *bulges])
        params = {
            "depth": _round4(depth),
            "width": _round4(width),
            "length": _round4(length),
            "aspect": _round4(aspect),
            "profile": profile,
            "undercut": undercut,
            "draft_angle_deg": _round4(draft) if draft > 1.0 else None,
            "floor_face_id": floor.face_id,
            "wall_face_ids": sorted(walls),
            "wall_count": len(_distinct_planes(topo, walls)),      # a wall another cut split is still one wall
            "overhang_face_ids": sorted(overhangs),
            # Undercut (tee) slots: `width` is the head; the cutter's neck must pass `mouth_width`, and its
            # head is at most `head_depth` thick.
            "mouth_face_ids": sorted(mouth),
            "mouth_width": _round4(mouth_width) if mouth_width else None,
            "head_depth": _round4(head_depth) if mouth else None,
            "corner_face_ids": sorted(corners),
            "convex_corner_face_ids": sorted(bulges),       # outline corners bulging in: no limit on the tool
            "corner_radii": corner_radii,
            "min_corner_radius": corner_radii[0] if corner_radii else None,   # ← caps the finishing-tool radius
            "open": not closed,
            "open_ends": open_ends,
            "on_cylinder": on_cylinder,
            "floor_normal": [_round4(x) for x in (floor.normal or [])],
        }
        evidence = [
            f"planar floor + {len(walls)} wall(s) joined by concave edges",
            f"{len(walled_edges)}/{n_floor_edges} floor edges walled → {'closed' if closed else 'open'}",
            f"footprint {length:.1f}×{width:.1f} mm, depth {depth:.1f} mm → {label}",
        ]
        if overhangs:
            evidence.append(f"{len(overhangs)} overhanging face(s) → undercut, not reachable from above")
            if mouth_width:
                evidence.append(f"mouth {mouth_width:.1f} mm wide over a {width:.1f} mm head, {depth:.1f} mm deep overall")
        elif undercut:
            evidence.append("wall leans back over the floor → dovetail undercut")
        if draft > 1.0:
            evidence.append(f"wall draft ≈ {draft:.1f}°")
        if corner_radii:
            evidence.append(f"{len(corners)} rounded corner(s), min radius R{corner_radii[0]:g} mm")
        confidence = min(0.7 + 0.05 * min(len(walls), 4) + (0.05 if closed else 0.0), 0.95)
        for a in alternatives:
            a["confidence"] = round(confidence - 0.05, 3)
        return FeatureCandidate(id="", type=ftype, face_ids=face_ids,
                                edge_ids=sorted({e for f in face_ids for e in topo.faces[f].edge_ids}),
                                params=params, confidence=confidence, evidence=evidence, alternatives=alternatives)


class CylindricalBlendRecognizer(FeatureRecognizer):
    """Leftover partial cylinders (sweep below the bore threshold) that aren't a pocket corner: a straight
    edge blend. External (convex) → round / edge-break; internal (concave) → fillet. The torus recognizer
    handles curved-edge blends; this handles straight ones (a filleted straight edge is a cylinder slice).
    Runs after the prismatic recognizer, so pocket corner fillets are already claimed as part of the pocket.
    """

    name = "cyl_blend"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        for f in topo.faces.values():
            if f.surface_type != "cylinder" or f.face_id in claimed or _sweep_of(f) >= _MIN_CHANNEL_SWEEP:
                continue
            if not any(topo.convexity(e) == "tangent" for e in f.edge_ids):
                continue                       # meets everything at a sharp edge: a curved wall, not a blend
            internal = f.material_side == "internal"
            ftype = FeatureType.FILLET if internal else FeatureType.ROUND
            params = {
                "radius": _round4(f.radius),
                "length": _round4(f.height),
                "axis": [_round4(x) for x in (f.axis_dir or [])],
                "origin": [_round4(x) for x in (f.axis_loc or [])],
            }
            evidence = [
                f"{'internal' if internal else 'external'} partial cylinder "
                f"(sweep ≈ {math.degrees(f.sweep):.0f}°) → straight edge {'fillet' if internal else 'round'}",
                f"radius R{f.radius:g} mm over {f.height:g} mm",
            ]
            alternatives = []
            if internal and _sweep_of(f) > _MIN_CHANNEL_SWEEP - _SWEEP_MARGIN:
                alternatives.append({"label": "round-bottomed channel", "type": "slot", "method": "NEAR_THRESHOLD",
                                     "params": {"profile": "round", "radius": _round4(f.radius)}, "confidence": 0.7,
                                     "reason": f"sweeps {math.degrees(_sweep_of(f)):.0f}°, within "
                                               f"{math.degrees(_SWEEP_MARGIN):.0f}° of the 120° that separates an edge "
                                               "fillet from a round-bottomed channel"})
            out.append(FeatureCandidate(id="", type=ftype, face_ids=[f.face_id], edge_ids=list(f.edge_ids),
                                        params=params, confidence=0.8, evidence=evidence, alternatives=alternatives))
            claimed.add(f.face_id)
        return out


class PlanarChamferRecognizer(FeatureRecognizer):
    """Chamfers on **straight** edges, which are planar faces — not cones.

    `ConeRecognizer` only ever sees a chamfer that runs round a circular edge. Break a straight edge and
    the new face is an ordinary plane, which used to fall all the way through to `PlaneRecognizer` and be
    reported as part of the blank. Since an edge break is one of the most common things on a machined
    part, that was a silent miss on nearly every real model.

    The signature is geometric and tight: a narrow planar face, joined to exactly two planar neighbours by
    **convex** edges, whose own normal **bisects** those two neighbours' normals. The bisector test is what
    separates a chamfer from any other slanted wall — removing the chamfer would put those two neighbours
    back together along a single edge.
    """

    name = "planar_chamfer"
    _MAX_WIDTH_RATIO = 0.25       # a chamfer is narrow next to the faces it breaks
    # … and an edge break that ends on a face across an inside corner is narrower still: a strip that stands
    # on a face and is wider than 1:20 is read as the wall of a triangular step (MFCAD++ val: 128 chamfers to 8
    # step walls below 1:20, even odds between 1:20 and 1:10).
    _STANDING_WIDTH_RATIO = 0.05
    _BISECT_COS = math.cos(math.radians(12.0))

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        for f in topo.faces.values():
            if f.surface_type != "plane" or f.face_id in claimed or not f.normal:
                continue
            nbrs = self._convex_planar_neighbours(topo, f)
            if len(nbrs) < 2:
                continue
            # A chamfer meets its two end faces convexly as well, so look for the *pair* it bisects
            # rather than demanding it have exactly two neighbours.
            pair = next(((a, b) for i, a in enumerate(nbrs) for b in nbrs[i + 1:]
                         if self._bisects(f.normal, a.normal, b.normal) and self._strip_between(topo, f, a, b)), None)
            if pair is None:
                continue
            a, b = pair
            width, length = _plane_footprint(f)
            ratio = width / max(_plane_footprint(a)[1], _plane_footprint(b)[1], 1e-9)
            if width <= 1e-6 or ratio > self._MAX_WIDTH_RATIO:
                continue
            if ratio > self._STANDING_WIDTH_RATIO and self._stands_on_a_face(topo, f, a, b):
                continue                 # wide enough to be a step's diagonal wall standing on its floor
            angle = math.degrees(math.acos(max(-1.0, min(1.0, abs(_dot(a.normal, b.normal))))))
            params = {
                "width": _round4(width),
                "length": _round4(length),
                "leg": _round4(width / math.sqrt(2.0)),
                "angle_deg": _round4(90.0 - angle / 2.0 if angle > 1e-6 else 45.0),
                "normal": [_round4(x) for x in f.normal],
                "between_face_ids": sorted([a.face_id, b.face_id]),
            }
            out.append(FeatureCandidate(
                id="", type=FeatureType.CHAMFER, face_ids=[f.face_id], edge_ids=list(f.edge_ids),
                params=params, confidence=0.86,
                evidence=["narrow planar face joined to exactly 2 planes by convex edges",
                          "its normal bisects both neighbours → an edge break, not a wall",
                          f"face {width:.3f} mm wide over {length:.3f} mm"]))
            claimed.add(f.face_id)
        return out

    @staticmethod
    def _convex_planar_neighbours(topo: Topology, f: FaceInfo) -> list[FaceInfo]:
        out = []
        for eid in f.convex_edge_ids:
            nb = _other_face(topo, eid, f.face_id)
            if nb is not None and topo.faces[nb].surface_type == "plane" and topo.faces[nb].normal:
                if nb not in [g.face_id for g in out]:
                    out.append(topo.faces[nb])
        return out

    @staticmethod
    def _strip_between(topo: Topology, f: FaceInfo, a: FaceInfo, b: FaceInfo) -> bool:
        """The edges `f` shares with `a` and with `b` are straight and parallel: `f` runs between them as a
        strip. A wall that merely sits next to two slanted faces of other features does not."""
        def shared(g):
            return [topo.edges[e] for e in f.edge_ids if e in g.edge_ids and e in topo.edges]
        ea, eb = shared(a), shared(b)
        if not ea or not eb:
            return False
        da = [e.params.get("direction") for e in ea if e.curve_type == "line" and e.params.get("direction")]
        db = [e.params.get("direction") for e in eb if e.curve_type == "line" and e.params.get("direction")]
        run = next((x for x in da for y in db if abs(_dot(x, y)) > 0.999), None)
        if run is None:
            return False
        # A chamfer never stands in an inside corner along its length: a concave edge running with the strip
        # makes it a wall (of a passage, of a pocket) that two other faces happen to flank.
        for e in f.concave_edge_ids:
            ed = topo.edges.get(e)
            d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
            if d and abs(_dot(d, run)) > 0.999:
                return False
        return True

    @staticmethod
    def _stands_on_a_face(topo: Topology, f: FaceInfo, a: FaceInfo, b: FaceInfo) -> bool:
        """The strip ends on a face across a concave edge (that face's normal runs along the strip). An edge
        that ends at an inside corner leaves its chamfer so, and so does a triangular step leave its diagonal
        wall standing on its floor; only proportion tells them apart."""
        shared = [topo.edges[e] for e in f.edge_ids if e in a.edge_ids and e in topo.edges]
        run = next((e.params.get("direction") for e in shared if e.curve_type == "line" and e.params.get("direction")), None)
        if run is None:
            return False
        return any(topo.faces[g].normal and abs(_dot(topo.faces[g].normal, run)) > 0.95
                   for e in f.concave_edge_ids for g in [_other_face(topo, e, f.face_id)] if g is not None)

    @classmethod
    def _bisects(cls, n, n1, n2) -> bool:
        """True when `n` points along n1 + n2 — i.e. the face splits the angle between its neighbours."""
        mid = [n1[i] + n2[i] for i in range(3)]
        m = math.sqrt(sum(c * c for c in mid))
        if m < 0.3:
            return False                 # (nearly) opposite faces: a chamfer cannot sit between them
        return sum(n[i] * mid[i] / m for i in range(3)) >= cls._BISECT_COS


class ChannelRecognizer(FeatureRecognizer):
    """Round-bottomed channels: the part-cylindrical floors left once closed bores are claimed.

    A groove cut with a ball/round tool and a Woodruff keyseat cut with a disc cutter both leave a
    cylindrical floor that does **not** close a full turn. Before the bore test looked at closure, these
    were emitted as through holes — a drill cycle for something no drill can make.
    """

    name = "channel"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        cyls = [f for f in topo.faces.values() if f.surface_type == "cylinder" and f.material_side == "internal"
                and f.face_id not in claimed]
        out: list[FeatureCandidate] = []
        for group in _radial_groups(cyls):
            sweep = _angular_cover(group)
            if sweep < _MIN_CHANNEL_SWEEP:
                continue                       # a corner blend, not a channel floor
            if sweep >= _MIN_BORE_SWEEP:
                continue                       # it closes: a bore (HoleRecognizer), whatever ran first
            if any(_stands_on_a_floor(topo, g, need_tangent_wall=False) for g in group):
                # A channel's cylinder is its floor; one standing on a floor is a curved wall of a pocket, slot or
                # step (PrismaticRecognizer), or with a tangent wall its rounded end. (MFCAD++ val: of such faces
                # read as channels, 1 of 409 was one.)
                continue
            f = max(group, key=lambda g: _sweep_of(g))
            r = f.radius or 0.0
            half = min(sweep / 2.0, math.pi / 2.0)
            run = max((g.height or 0.0) for g in group)
            on_cyl = self._on_a_turned_part(topo, group)
            params = {
                "profile": "round",
                "radius": _round4(r),
                "width": _round4(2 * r * math.sin(half)),
                "depth": _round4(r * (1 - math.cos(half))),
                "length": _round4(run),
                "arc_floor": on_cyl,
                "on_cylinder": on_cyl,
                "axis": [_round4(x) for x in (f.axis_dir or [])],
                "origin": [_round4(x) for x in (f.axis_loc or [])],
            }
            alternatives = []
            if sweep < _MIN_CHANNEL_SWEEP + _SWEEP_MARGIN:
                alternatives.append({"label": "straight edge fillet", "type": "fillet", "method": "NEAR_THRESHOLD",
                                     "params": {"radius": _round4(r), "length": _round4(run)}, "confidence": 0.74,
                                     "reason": f"floor sweeps {math.degrees(sweep):.0f}°, within "
                                               f"{math.degrees(_SWEEP_MARGIN):.0f}° of the 120° that separates a "
                                               "round-bottomed channel from an edge fillet"})
            out.append(FeatureCandidate(
                id="", type=FeatureType.SLOT, face_ids=sorted(g.face_id for g in group), alternatives=alternatives,
                edge_ids=sorted({e for g in group for e in g.edge_ids}), params=params, confidence=0.84,
                evidence=[f"internal cylindrical floor sweeping {math.degrees(sweep):.0f}° — does not close, so not a bore",
                          f"round profile R{r:g} → ball/disc cutter, not a drill"]))
            claimed.update(g.face_id for g in group)
        return out

    @staticmethod
    def _on_a_turned_part(topo: Topology, group: list[FaceInfo]) -> bool:
        """True when the channel is cut into an external cylinder — i.e. it is a keyseat on a shaft."""
        for g in group:
            for nb in topo.neighbors(g.face_id):
                face = topo.faces[nb]
                if face.surface_type == "cylinder" and face.material_side == "external":
                    return True
        return False


def _convex_components(topo: Topology, faces: set[int]) -> list[set[int]]:
    """Connected components of `faces` linked by convex edges (the protrusion analogue of a pocket region)."""
    seen: set[int] = set()
    comps: list[set[int]] = []
    for start in faces:
        if start in seen:
            continue
        comp: set[int] = set()
        stack = [start]
        while stack:
            f = stack.pop()
            if f in comp:
                continue
            comp.add(f)
            seen.add(f)
            for eid in topo.faces[f].convex_edge_ids:
                nb = _other_face(topo, eid, f)
                if nb is not None and nb in faces and nb not in comp:
                    stack.append(nb)
        comps.append(comp)
    return comps


class ProtrusionRecognizer(FeatureRecognizer):
    """Boss / rib — material standing **proud** of a base face (MFDataset "protrude").

    Concave edges alone cannot tell a pocket from a boss: a pad's base edges are concave in exactly the
    way a pocket floor's are, which is why a pad used to be reported as a step whose width and length were
    the *block's*, and CAM would have machined away material meant to stand.

    What separates them is how the region attaches. A protrusion is grown from faces that are **concave to
    a base and convex to each other** — they sit on something and rise off it — joined across their convex
    edges. A plateau (a pad's top) has no concave edge of its own, so it is pulled in afterwards only when
    every one of its edges leads back into the region: it is a cap the walls enclose.

    The boundary is then required to be *mostly* concave rather than wholly so, because a protrusion may
    run out flush into a face it merges with — a gusset reaching the top of the wall it braces meets it at
    a convex edge. Blank faces never pass: they bound nothing concavely, and the area guard keeps a
    majority of the body from ever being called a protrusion.
    """

    name = "protrusion"
    _MAX_AREA_FRACTION = 0.5
    _MIN_CONCAVE_BOUNDARY = 2 / 3      # share of leaving edges that must be concave (the feet)

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        total_area = sum(f.area for f in topo.faces.values()) or 1.0
        # Seed: faces that sit on something (a concave edge) and rise off it (a convex edge).
        seed = {fid for fid, f in topo.faces.items()
                if fid not in claimed and f.normal is not None and f.concave_edge_ids and f.convex_edge_ids}
        out: list[FeatureCandidate] = []
        for comp in _convex_components(topo, seed):
            if len(comp) < 2:
                continue
            comp = self._absorb_caps(topo, comp, claimed)
            if len(comp) >= len(topo.faces):
                continue
            if sum(topo.faces[c].area for c in comp) > self._MAX_AREA_FRACTION * total_area:
                continue
            if not self._stands_proud(topo, comp):
                continue
            if self._holds_a_recess(topo, comp) or self._walls_face_inward(topo, comp):
                continue
            cand = self._build(topo, comp)
            if cand:
                out.append(cand)
                claimed.update(cand.face_ids)
        return out

    @staticmethod
    def _absorb_caps(topo: Topology, comp: set[int], claimed: set[int]) -> set[int]:
        """Pull in a face the region fully encloses — a pad's top, which has no concave edge of its own."""
        comp = set(comp)
        for fid in [c for c in comp]:
            for eid in topo.faces[fid].convex_edge_ids:
                nb = _other_face(topo, eid, fid)
                if nb is None or nb in comp or nb in claimed:
                    continue
                neighbours = {_other_face(topo, e, nb) for e in topo.faces[nb].edge_ids}
                if neighbours and neighbours <= comp | {None}:
                    comp.add(nb)
        return comp

    @staticmethod
    def _holds_a_recess(topo: Topology, comp: set[int]) -> bool:
        """Two faces of the region meet at a concave edge: an inside corner, so the region holds a recess (the
        walls of a pocket joined to each other through the face they open onto), not material standing up.
        A boss's or rib's own faces meet each other only at convex or tangent edges."""
        for fid in comp:
            for eid in topo.faces[fid].concave_edge_ids:
                nb = _other_face(topo, eid, fid)
                if nb is not None and nb in comp:
                    return True
        return False

    @classmethod
    def _walls_face_inward(cls, topo: Topology, comp: set[int]) -> bool:
        """The region's walls face each other: they bound a recess cut into the face they meet convexly (a
        pocket in a slot's floor), where a boss's or rib's walls face away from it. A planar wall faces in when
        the other walls lie in front of it, a cylindrical one when it is hollow (internal)."""
        top = cls._pick_top([topo.faces[c] for c in comp])
        walls = [topo.faces[c] for c in comp if top is None or (c != top.face_id
                 and not (topo.faces[c].normal and _parallel(topo.faces[c].normal, top.normal, 1.0)))]
        pts = [w.centroid for w in walls if w.centroid]
        if len(pts) < 2:
            return False
        mid = [sum(p[k] for p in pts) / len(pts) for k in range(3)]
        inward = outward = 0
        for w in walls:
            if w.surface_type == "plane" and w.normal and w.centroid:
                s = _dot(w.normal, [mid[k] - w.centroid[k] for k in range(3)])
                inward += s > 1e-6
                outward += s < -1e-6
            elif w.material_side in ("internal", "external"):
                inward += w.material_side == "internal"
                outward += w.material_side == "external"
        return inward > outward

    @classmethod
    def _stands_proud(cls, topo: Topology, comp: set[int]) -> bool:
        """The edges leaving the region must be predominantly concave — the feet it stands on."""
        concave = convex = 0
        for fid in comp:
            for eid in topo.faces[fid].edge_ids:
                nb = _other_face(topo, eid, fid)
                if nb is None or nb in comp:
                    continue
                kind = topo.convexity(eid)
                if kind == "convex":
                    convex += 1
                elif kind == "concave":
                    concave += 1
        total = concave + convex
        return concave >= 2 and total > 0 and concave / total >= cls._MIN_CONCAVE_BOUNDARY

    def _build(self, topo: Topology, comp: set[int]) -> FeatureCandidate | None:
        faces = [topo.faces[c] for c in comp]
        # A rib is a wedge, so it carries a triangular face; a boss is a plateau with quadrilateral walls.
        is_rib = any(len(f.edge_ids) == 3 for f in faces)
        top = self._pick_top(faces)
        height = 0.0
        if top is not None:
            height = max((_depth_along(top.normal, top.point, f) for f in faces if f.face_id != top.face_id), default=0.0)
        width, length = _plane_footprint(top) if top is not None else (0.0, 0.0)
        ftype = FeatureType.RIB if is_rib else FeatureType.BOSS
        params = {
            "height": _round4(height),
            "width": _round4(width),
            "length": _round4(length),
            "face_count": len(comp),
            "top_face_id": top.face_id if top is not None else None,
            "wall_face_ids": sorted(c for c in comp if top is None or c != top.face_id),
            "normal": [_round4(x) for x in (top.normal or [])] if top is not None else [],
        }
        evidence = [
            f"{len(comp)} face(s) convex to each other, concave to the body → stands proud of a base",
            "triangular face present → rib/gusset" if is_rib else "planar top enclosed by upstanding walls → boss/pad",
        ]
        if top is not None:
            evidence.append(f"footprint {length:.1f}×{width:.1f} mm, height {height:.1f} mm")
        return FeatureCandidate(id="", type=ftype, face_ids=sorted(comp),
                                edge_ids=sorted({e for c in comp for e in topo.faces[c].edge_ids}),
                                params=params, confidence=0.85, evidence=evidence)

    @staticmethod
    def _pick_top(faces: list[FaceInfo]) -> FaceInfo | None:
        """The plateau: the planar face perpendicular to the most other planar faces, largest first."""
        planar = [f for f in faces if f.surface_type == "plane" and f.normal]
        best, best_key = None, (-1, -1.0)
        for f in planar:
            n_perp = sum(1 for g in planar if g is not f and _perp(f.normal, g.normal))
            if (n_perp, f.area) > best_key:
                best, best_key = f, (n_perp, f.area)
        return best


class PassageRecognizer(FeatureRecognizer):
    """A through cut with a prismatic cross-section (triangular, rectangular, six-sided, rounded corners): walls
    that close into one ring around a common axis, each joined to the next by a concave edge, with no floor, so
    the cut is open at both ends.

    It runs before PrismaticRecognizer. That one needs a floor, and in a passage it found none, or took one wall
    as the "floor" of a slot (a triangular passage read as a 2-wall slot). A pocket's walls also form a ring,
    but its floor joins the same concave region, which this rejects."""

    name = "passage"
    _AXIS_TOL = 1e-3

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        region = {fid for fid, f in topo.faces.items() if fid not in claimed and f.concave_edge_ids
                  and (f.surface_type == "plane" or (f.surface_type == "cylinder" and f.material_side == "internal"))}
        out: list[FeatureCandidate] = []
        # Two passes: passages first found whole, then those whose walls the first ones cut into pieces.
        found_faces: set[int] = set()
        for crossing in (set(), None):
            for comp in _concave_components(topo, region - claimed):
                for ring, axis in self._rings(topo, comp, found_faces if crossing is None else crossing):
                    if any(f in claimed for f in ring):
                        continue
                    cand = self._passage(topo, ring, axis)
                    if cand:
                        out.append(cand)
                        claimed.update(cand.face_ids)
                        found_faces.update(cand.face_ids)
        # Then passages that overlap each other: their joint section has corners pointing into the cut, whose
        # convex edges split the walls into several concave regions, so the ring is looked for across them.
        left = region - claimed
        if left:
            for ring, axis in self._rings(topo, left, found_faces, stepped=True):
                if any(f in claimed for f in ring):
                    continue
                cand = self._passage(topo, ring, axis)
                if cand:
                    cand.evidence.append("the section has corners pointing into the cut: overlapping passages")
                    out.append(cand)
                    claimed.update(cand.face_ids)
                    found_faces.update(cand.face_ids)
        # Last, what is left of a passage that a through hole or another passage on the same axis cut open: an
        # open chain of walls whose two ends both open into that through cut.
        for comp in _concave_components(topo, region - claimed):
            for chain, axis in self._open_chains(topo, comp, found_faces):
                if any(f in claimed for f in chain):
                    continue
                cand = self._passage(topo, chain, axis)
                if cand:
                    cand.evidence.append("an open ring whose two ends open into a through cut on the same axis")
                    out.append(cand)
                    claimed.update(cand.face_ids)
                    found_faces.update(cand.face_ids)
        return out

    def _open_chains(self, topo: Topology, comp: set[int], through: set[int]) -> list[tuple[set[int], list[float]]]:
        """Chains of walls along an axis, joined end to end by corner edges along it, whose two end walls each
        meet a through cut on that axis (a bore along it, or a passage already found) at an edge along it."""
        axes: list[list[float]] = []
        for f in comp:
            for e in topo.faces[f].concave_edge_ids:
                ed = topo.edges.get(e)
                d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
                if d and all(abs(_dot(d, a)) < 0.9999 for a in axes):
                    axes.append(list(d))

        def along(e, axis):
            ed = topo.edges.get(e)
            d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
            return d is not None and abs(abs(_dot(d, axis)) - 1.0) <= self._AXIS_TOL

        def through_cut(g, axis):
            gi = topo.faces[g]
            if g in through:
                return True
            return (gi.surface_type == "cylinder" and gi.material_side == "internal" and gi.axis_dir is not None
                    and abs(abs(_dot(gi.axis_dir, axis)) - 1.0) <= self._AXIS_TOL)

        found = []
        for axis in axes:
            members = {f for f in comp if topo.faces[f].surface_type == "plane" and topo.faces[f].normal
                       and abs(_dot(topo.faces[f].normal, axis)) <= self._AXIS_TOL}
            graph: dict[int, set[int]] = {f: set() for f in members}
            for f in members:
                for e in topo.faces[f].edge_ids:
                    g = _other_face(topo, e, f)
                    if g in members and g != f and topo.convexity(e) in ("concave", "tangent") and along(e, axis):
                        graph[f].add(g)
            seen: set[int] = set()
            for start in members:
                if start in seen:
                    continue
                part, stack = set(), [start]
                while stack:
                    x = stack.pop()
                    if x not in part:
                        part.add(x)
                        stack.extend(graph[x] - part)
                seen |= part
                ends = [f for f in part if len(graph[f]) == 1]
                if len(part) < 2 or len(ends) != 2 or any(len(graph[f]) > 2 for f in part):
                    continue
                if all(any(through_cut(g, axis) for e in topo.faces[f].edge_ids if along(e, axis)
                           and topo.convexity(e) == "convex" for g in [_other_face(topo, e, f)] if g is not None)
                       for f in ends):
                    found.append((part, axis))
        return found

    def _rings(self, topo: Topology, comp: set[int], crossing: set[int],
               stepped: bool = False) -> list[tuple[set[int], list[float]]]:
        """Closed rings of walls inside a concave region, each with its axis. Another feature touching the
        passage joins its faces to the region, so the ring is looked for inside it: walls lying along an axis,
        each joined to exactly two others by corner edges (concave, or tangent at a rounded corner) running
        along that axis. `stepped` also takes convex corners, for the section two overlapping passages leave."""
        axes: list[list[float]] = []
        for f in comp:
            for e in topo.faces[f].concave_edge_ids:
                ed = topo.edges.get(e)
                d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
                if d and all(abs(_dot(d, a)) < 0.9999 for a in axes):
                    axes.append(list(d))
        found = []
        for axis in axes:
            members = set()
            for f in comp:
                fi = topo.faces[f]
                if fi.surface_type == "plane" and fi.normal and abs(_dot(fi.normal, axis)) <= self._AXIS_TOL:
                    members.add(f)
                elif fi.surface_type == "cylinder" and fi.axis_dir and abs(abs(_dot(fi.axis_dir, axis)) - 1.0) <= self._AXIS_TOL:
                    members.add(f)
            # A second cut crossing the passage splits a wall into coplanar pieces: they are one wall.
            group = {f: f for f in members}
            planes = [f for f in members if topo.faces[f].surface_type == "plane"]
            for i, a in enumerate(planes):
                fa = topo.faces[a]
                for b in planes[i + 1:]:
                    fb = topo.faces[b]
                    # (Not in a stepped section: there two sides of the overlapping passages can share a plane
                    # with the section's own corners between them, and they stay two sides.)
                    if _coplanar(fa, fb) \
                            and (self._one_after_the_other(fa, fb, axis)
                                 or (not stepped and (not self._gap_opens_outward(topo, fa, fb)
                                                      or (self._borders(topo, fa, crossing)
                                                          and self._borders(topo, fb, crossing))))):
                        group[b] = group[a]
            corners = ("concave", "tangent", "convex") if stepped else ("concave", "tangent")
            graph: dict[int, set[int]] = {g: set() for g in set(group.values())}
            kind: dict[frozenset, str] = {}
            for f in members:
                for e in topo.faces[f].edge_ids:
                    k = topo.convexity(e)
                    if k not in corners:
                        continue
                    ed = topo.edges.get(e)
                    d = ed.params.get("direction") if ed is not None and ed.curve_type == "line" else None
                    g = _other_face(topo, e, f)
                    if d and g in members and group[g] != group[f] and abs(abs(_dot(d, axis)) - 1.0) <= self._AXIS_TOL:
                        graph[group[f]].add(group[g])
                        pair = frozenset((group[f], group[g]))
                        if kind.get(pair) != "concave":
                            kind[pair] = k
            seen: set[int] = set()
            for start in graph:
                if start in seen or len(graph[start]) != 2:
                    continue
                ring, stack, ok = set(), [start], True
                while stack:
                    x = stack.pop()
                    if x in ring:
                        continue
                    ring.add(x)
                    if len(graph[x]) != 2:
                        ok = False
                    stack.extend(graph[x] - ring)
                seen |= ring
                if ok and len(ring) >= 3:
                    if stepped:
                        # Round a hole's section its inside corners outnumber the corners that point into it
                        # (two passages overlapping); round the outside of a part it is the other way about.
                        kinds = [kind[p] for p in kind if p <= ring]
                        if kinds.count("concave") <= kinds.count("convex") or "convex" not in kinds:
                            continue
                    found.append(({f for f in members if group[f] in ring}, axis))
        return found

    @staticmethod
    def _one_after_the_other(a: FaceInfo, b: FaceInfo, axis) -> bool:
        """Two coplanar pieces that lie one after the other along the axis and side by side across it: a cut
        crossing the passage took the stretch of wall between them. A T-slot's two ledges are the other way
        round, side by side along the slot with its mouth between them, and are never joined by this."""
        across = _cross3(axis, a.normal)
        (a0, a1), (b0, b1) = _span(a, axis), _span(b, axis)
        (c0, c1), (d0, d1) = _span(a, across), _span(b, across)
        return (a1 < b0 - 1e-6 or b1 < a0 - 1e-6) and min(c1, d1) - max(c0, d0) > 1e-6

    @staticmethod
    def _borders(topo: Topology, f: FaceInfo, faces: set[int]) -> bool:
        """`f` meets one of `faces` (a passage already found, which crosses this one)."""
        return bool(faces) and any(n in faces for n in topo.neighbors(f.face_id))

    @staticmethod
    def _gap_opens_outward(topo: Topology, a: FaceInfo, b: FaceInfo) -> bool:
        """Between two coplanar wall pieces, does the part open to the outside (a T-slot's mouth between its two
        ledges) rather than into another cut that crosses the wall? Looked at along the line from the middle of
        the gap, away from the passage, where the wall's material would be."""
        mid = [(a.point[k] + b.point[k]) / 2.0 for k in range(3)]
        away = [-c for c in a.normal]
        start = [mid[k] + 1e-3 * away[k] for k in range(3)]
        return line_of_sight(topo, start, away) is True

    def _passage(self, topo: Topology, comp: set[int], axis: list[float]) -> FeatureCandidate | None:
        # no floor: nothing the walls stand on across a concave edge faces along the axis
        for f in comp:
            for e in topo.faces[f].concave_edge_ids:
                g = _other_face(topo, e, f)
                if g is None or g in comp:
                    continue
                gi = topo.faces[g]
                if gi.surface_type == "plane" and gi.normal and abs(_dot(gi.normal, axis)) > 0.9:
                    return None
        walls = [f for f in comp if topo.faces[f].surface_type == "plane"]
        corners = sorted(f for f in comp if topo.faces[f].surface_type == "cylinder")
        # sides of the section: distinct wall planes (a crossing cut may split one wall into pieces)
        sides: list[FaceInfo] = []
        for w in walls:
            fw = topo.faces[w]
            if not any(_dot(fw.normal, o.normal) > 0.9999 and abs(_dot(fw.normal, [fw.point[k] - o.point[k] for k in range(3)])) < 1e-4
                       for o in sides):
                sides.append(fw)
        pts = [c for f in comp for c in (topo.faces[f].bbox_min, topo.faces[f].bbox_max) if c]
        along = [_dot(q, axis) for q in pts]
        depth = max(along) - min(along) if along else 0.0
        u = _cross3(axis, [1.0, 0.0, 0.0]) if abs(axis[0]) < 0.9 else _cross3(axis, [0.0, 1.0, 0.0])
        un = math.sqrt(_dot(u, u))
        u = [x / un for x in u]
        v = _cross3(axis, u)
        across_u = [_dot(q, u) for q in pts]
        across_v = [_dot(q, v) for q in pts]
        size = sorted([max(across_u) - min(across_u), max(across_v) - min(across_v)])
        shape = {3: "triangular", 4: "rectangular", 6: "hexagonal"}.get(len(sides), f"{len(sides)}-sided")
        radii = sorted({_round4(topo.faces[c].radius) for c in corners if topo.faces[c].radius})
        params = {
            "through": True, "open": False, "shape": shape, "wall_count": len(sides),
            "wall_face_ids": sorted(walls), "corner_face_ids": corners, "corner_radii": radii,
            "min_corner_radius": radii[0] if radii else None,
            "depth": _round4(depth), "width": _round4(size[0]), "length": _round4(size[1]),
            "axis": [_round4(x) for x in axis],
        }
        evidence = [f"{len(comp)} wall(s) closing into one ring around a common axis, joined by corner edges along it",
                    "no floor: nothing the walls stand on faces along the axis → open at both ends, through",
                    f"{shape} cross-section {size[1]:.1f} × {size[0]:.1f} mm, {depth:.1f} mm deep"]
        return FeatureCandidate(id="", type=FeatureType.POCKET, face_ids=sorted(comp),
                                edge_ids=sorted({e for f in comp for e in topo.faces[f].edge_ids}),
                                params=params, confidence=0.88, evidence=evidence)


class FaceGrooveRecognizer(FeatureRecognizer):
    """An annular groove cut into a face (an O-ring groove): an outer internal cylinder and an inner external
    one on the same axis, both standing on one annular floor whose normal is that axis.

    It runs before the hole and shaft recognizers, which would otherwise take the two walls as a short bore
    and a short pin."""

    name = "face_groove"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        for fid, floor in topo.faces.items():
            if fid in claimed or floor.surface_type != "plane" or not floor.normal:
                continue
            nbrs = [topo.faces[n] for n in topo.neighbors(fid) if n not in claimed]
            outer = [c for c in nbrs if c.surface_type == "cylinder" and c.material_side == "internal"
                     and c.axis_dir and _parallel(c.axis_dir, floor.normal, 0.5)]
            inner = [c for c in nbrs if c.surface_type == "cylinder" and c.material_side == "external"
                     and c.axis_dir and _parallel(c.axis_dir, floor.normal, 0.5)]
            pair = next(((o, i) for o in outer for i in inner if collinear_axes(o, i) and (i.radius or 0) < (o.radius or 0)), None)
            if pair is None:
                continue
            o, i = pair
            walls = [g.face_id for g in topo.faces.values() if g.face_id not in claimed and g.surface_type == "cylinder"
                     and (collinear_axes(g, o) and abs((g.radius or 0) - (o.radius or 0)) < 1e-4
                          or collinear_axes(g, i) and abs((g.radius or 0) - (i.radius or 0)) < 1e-4)
                     and fid in topo.neighbors(g.face_id)]
            if sum(_sweep_of(topo.faces[w]) for w in walls if abs((topo.faces[w].radius or 0) - (o.radius or 0)) < 1e-4) < _MIN_BORE_SWEEP:
                continue                        # the outer wall does not close: not a ring
            face_ids = sorted({fid, *walls})
            depth = max((topo.faces[w].height or 0.0) for w in walls)
            params = {"face_groove": True, "inner_diameter": _round4(2 * i.radius), "outer_diameter": _round4(2 * o.radius),
                      "width": _round4(o.radius - i.radius), "depth": _round4(depth),
                      "axis": [_round4(x) for x in (floor.normal or [])], "origin": [_round4(x) for x in (o.axis_loc or [])]}
            out.append(FeatureCandidate(
                id="", type=FeatureType.GROOVE, face_ids=face_ids, edge_ids=sorted({e for f in face_ids for e in topo.faces[f].edge_ids}),
                params=params, confidence=0.88,
                evidence=[f"annular floor between an outer bore Ø{2 * o.radius:g} and an inner pin Ø{2 * i.radius:g} on one axis",
                          f"ring {o.radius - i.radius:g} mm wide, {depth:g} mm deep → face (O-ring) groove"]))
            claimed.update(face_ids)
        return out


class OpenedBoreRecognizer(FeatureRecognizer):
    """A blind hole or a face (O-ring) groove that a later cut broke into from the side.

    Its wall no longer closes, so neither the hole nor the groove recognizer takes it, and a channel it is not:
    a channel cut into a face cannot wrap past half a turn, and does not stand on a floor. So: hollow cylinder
    pieces on one axis covering more than half a turn, standing on a floor whose normal is that axis, with no
    flat wall running tangent into them (that is a rounded pocket end). If the floor also meets an outward
    cylinder on the same axis, it is the annular floor of a groove; otherwise the hole's bottom.
    (MFCAD++ val: 54 hole faces and 77 groove faces had read as channels.)"""

    name = "opened_bore"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        cyls = [f for f in topo.faces.values() if f.surface_type == "cylinder" and f.material_side == "internal"
                and f.face_id not in claimed and f.axis_dir]
        out: list[FeatureCandidate] = []
        for group in _radial_groups(cyls):
            cover = _angular_cover(group)
            if not (math.pi + math.radians(1.0) < cover < _MIN_BORE_SWEEP):
                continue
            axis = group[0].axis_dir
            ids = {f.face_id for f in group}
            floors, tangent_wall = set(), False
            for f in group:
                for e in f.edge_ids:
                    g = _other_face(topo, e, f.face_id)
                    if g is None or g in ids or g in claimed or topo.faces[g].surface_type != "plane" or not topo.faces[g].normal:
                        continue
                    n, k = topo.faces[g].normal, topo.convexity(e)
                    if k == "concave" and abs(_dot(n, axis)) > 0.996:
                        floors.add(g)
                    elif k == "tangent" and abs(_dot(n, axis)) < 0.05:
                        tangent_wall = True
            if not floors or tangent_wall:
                continue
            inner = sorted({n for fl in floors for n in topo.neighbors(fl) if n not in claimed
                            and topo.faces[n].surface_type == "cylinder" and topo.faces[n].material_side == "external"
                            and collinear_axes(topo.faces[n], group[0])})
            r = group[0].radius or 0.0
            depth = max((f.height or 0.0) for f in group)
            face_ids = sorted(ids | floors | set(inner))
            edge_ids = sorted({e for x in face_ids for e in topo.faces[x].edge_ids})
            evidence = [f"hollow cylinder Ø{2 * r:g} on one axis covering {math.degrees(cover):.0f}° — more than half a "
                        "turn, so not a channel, and not closed, so another cut broke into its side",
                        f"stands on a flat floor across its axis, with no wall running tangent into it"]
            if inner:
                ri = min(topo.faces[i].radius or 0.0 for i in inner)
                params = {"face_groove": True, "opened": True, "inner_diameter": _round4(2 * ri), "outer_diameter": _round4(2 * r),
                          "width": _round4(r - ri), "depth": _round4(depth), "axis": [_round4(x) for x in axis],
                          "origin": [_round4(x) for x in (group[0].axis_loc or [])]}
                evidence.append(f"its floor also meets an inner pin Ø{2 * ri:g} on the same axis → annular floor of a face groove")
                out.append(FeatureCandidate(id="", type=FeatureType.GROOVE, face_ids=face_ids, edge_ids=edge_ids,
                                            params=params, confidence=0.75, evidence=evidence,
                                            recognition_method="OPENED_ANNULAR_FLOOR"))
            else:
                params = {"diameter": _round4(2 * r), "diameters": [_round4(2 * r)], "depth": _round4(depth), "through": False,
                          "opened": True, "counterbored": False, "countersunk": False, "center_hole": False,
                          "bottom_type": "flat", "axis": [_round4(x) for x in axis],
                          "origin": [_round4(x) for x in (group[0].axis_loc or [])], "countersink_face_ids": []}
                evidence.append("nothing on its floor's axis → the flat bottom of a blind hole")
                out.append(FeatureCandidate(id="", type=FeatureType.HOLE, face_ids=face_ids, edge_ids=edge_ids,
                                            params=params, confidence=0.75, evidence=evidence,
                                            recognition_method="OPENED_BORE_ON_FLOOR"))
            claimed.update(face_ids)
        return out


def _stands_on_a_floor(topo: Topology, f: FaceInfo, need_tangent_wall: bool = True) -> bool:
    """A partial internal cylinder that rises from a planar floor (concave edge to a plane whose normal is its
    axis) and runs tangent into a planar wall: the rounded end or corner of a pocket or slot. Without
    `need_tangent_wall`, any curved wall standing on a floor."""
    if not f.axis_dir:
        return False
    floor = tangent_wall = False
    for e in f.edge_ids:
        g = _other_face(topo, e, f.face_id)
        if g is None or topo.faces[g].surface_type != "plane" or not topo.faces[g].normal:
            continue
        n = topo.faces[g].normal
        kind = topo.convexity(e)
        if kind == "concave" and abs(_dot(n, f.axis_dir)) > 0.996:
            floor = True
        elif kind == "tangent" and abs(_dot(n, f.axis_dir)) < 0.05:
            tangent_wall = True
    return floor and (tangent_wall or not need_tangent_wall)


def _cross3(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


class PlaneRecognizer(FeatureRecognizer):
    name = "plane"

    def detect(self, topo: Topology, claimed: set[int]) -> list[FeatureCandidate]:
        out: list[FeatureCandidate] = []
        for f in topo.faces.values():
            if f.surface_type != "plane" or f.face_id in claimed:
                continue
            params = {"area": _round4(f.area), "normal": [_round4(x) for x in (f.normal or [])],
                      "point": [_round4(x) for x in (f.point or [])]}
            out.append(FeatureCandidate(id="", type=FeatureType.PLANE, face_ids=[f.face_id], edge_ids=list(f.edge_ids),
                                        params=params, confidence=0.99, evidence=[f"planar face, area = {f.area:.2f} mm²"]))
            claimed.add(f.face_id)
        return out


# Priority order. Axisymmetric machined features claim their faces first; the protrusion pass must run
# before the prismatic one so a pad's own faces are claimed and the base face it stands on is not then
# mistaken for a pocket floor; the planar-chamfer pass must run before both so an edge break is never
# swallowed as a pocket wall; generic planes mop up last.
DEFAULT_RECOGNIZERS: list[FeatureRecognizer] = [
    FaceGrooveRecognizer(),         # O-ring grooves in a face: before holes and shafts take their two walls
    HoleRecognizer(),               # closed internal cylinders
    ShaftBossRecognizer(),          # closed external cylinders, minus any ring grooves turned into them
    ConeRecognizer(),
    TorusRecognizer(),
    SphereRecognizer(),
    PlanarChamferRecognizer(),      # straight-edge chamfers: planar, so invisible to ConeRecognizer
    OpenedBoreRecognizer(),         # blind holes / face grooves another cut broke into: before channels take them
    ChannelRecognizer(),            # round-bottomed grooves/keyseats: cylinders that never close
    ProtrusionRecognizer(),         # boss/rib: convex regions standing proud of a base
    PassageRecognizer(),            # through cuts with a prismatic section: a floorless ring of walls
    PrismaticRecognizer(),          # pocket/slot/step: claim floor+walls before they surface as bare planes
    CylindricalBlendRecognizer(),   # straight edge rounds/fillets left after pockets claim their corners
    PlaneRecognizer(),
]
