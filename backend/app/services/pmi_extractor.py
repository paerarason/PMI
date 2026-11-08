"""Orchestrates PMI extraction: XCAF first, Part-21 text fallback, then balloon placement + IDs."""
from __future__ import annotations

import logging
import re
from collections import Counter

from app.services import balloon_placer, feature_classifier, pmi_part21, pmi_xcaf
from app.services.pmi_types import UNIT_TO_MODEL, Characteristic, Datum
from app.services.step_loader import LoadedStep

log = logging.getLogger("quality.pmi")

_KIND_ORDER = {"dimension": 0, "geom_tolerance": 1}

# Matches a PMI annotation named per the "transcribe from a drawing" convention: either just the
# original balloon number ("5", "C5", "#5") or the number plus a punctuation separator and the real
# feature name ("5 - bore dia", "5: bore dia", "5. bore dia"). Deliberately requires punctuation (not
# a bare space) between the number and any trailing text, so a name like "6 mm hole" (a real dimension
# description, not a numbered callout) is left alone rather than misread as characteristic #6.
_DRAWING_NUMBER_RE = re.compile(r"^\s*(?:[Cc]|#)?(\d{1,3})\s*(?:[-:.]\s*(.+))?\s*$")


def extract_pmi(path: str, loaded: LoadedStep) -> tuple[list[Characteristic], list[Datum], str]:
    chars, datums = [], []
    source = "none"
    try:
        chars, datums = pmi_xcaf.extract_xcaf(loaded.doc, loaded.shape)
        if chars:
            source = "xcaf"
    except Exception as exc:  # noqa: BLE001
        log.exception("XCAF PMI extraction failed: %s", exc)
    try:
        p_chars, p_datums = pmi_part21.extract_part21(path, loaded.shape, loaded.bbox.diagonal)
    except Exception as exc:  # noqa: BLE001
        log.exception("Part21 PMI extraction failed: %s", exc)
        p_chars, p_datums = [], []
    if chars:
        used = _enrich_from_part21(chars, p_chars)
        # OCCT's XCAF reader has been observed to silently drop some geometric-tolerance entities
        # (never dimensions) - recover anything the text parser found that XCAF missed, tolerances only.
        for i, pc in enumerate(p_chars):
            if pc.kind == "geom_tolerance" and i not in used and _match(pc, chars) is None:
                pc.source = "part21"
                chars.append(pc)
        datums = _merge_datums(datums, p_datums)
    elif p_chars:
        chars, datums, source = p_chars, p_datums, "part21"

    chars.sort(key=lambda c: (_KIND_ORDER.get(c.kind, 9), -(len(c.face_ids) > 0)))
    _assign_numbers(chars)
    for c in chars:
        if not c.feature_name:
            c.feature_name = _default_feature_name(c)
        if c.face_ids:  # classify the underlying feature (hole/shaft/fillet/...) for reaction plans
            info = feature_classifier.classify_faces(loaded.shape, c.face_ids)
            c.feature_type = info.feature_type.value
            c.material_side = info.material_side.value
    balloon_placer.place_balloons(loaded.shape, loaded.bbox, chars, datums)
    return chars, datums, source


def _merge_datums(xcaf: list[Datum], text: list[Datum]) -> list[Datum]:
    """XCAF's datums, each given the text reader's faces when XCAF linked it to none, plus any datum only the
    text reader found. XCAF often reads a datum's letter but not the faces of its datum feature (NIST FTC-06:
    all ten), and a datum with no faces can't be shown on the model."""
    by_label = {d.label: d for d in text}
    for d in xcaf:
        t = by_label.get(d.label)
        if t is not None and not d.face_ids and t.face_ids:
            d.face_ids = list(t.face_ids)
    have = {d.label for d in xcaf}
    return xcaf + [d for d in text if d.label not in have]


def _assign_numbers(chars: list[Characteristic]) -> None:
    """Number characteristics 1..N. An item authored with an explicit drawing/balloon number in its
    name (see _DRAWING_NUMBER_RE - e.g. a DimXpert annotation named "5" or "5 - bore dia") keeps that
    number, so the balloons match the original drawing's characteristic numbers
    instead of an arbitrary extraction order. Everything else auto-numbers into the remaining gaps,
    in extraction order. A duplicate explicit number (two items both named "5") is treated as if
    neither had one - silently trusting either would misattribute a real drawing number."""
    parsed: list[tuple[int | None, str]] = []  # (explicit number, cleaned name) parallel to chars
    counts: dict[int, int] = {}
    for c in chars:
        m = _DRAWING_NUMBER_RE.match(c.feature_name) if c.feature_name else None
        if m:
            n = int(m.group(1))
            counts[n] = counts.get(n, 0) + 1
            parsed.append((n, (m.group(2) or "").strip()))
        else:
            parsed.append((None, c.feature_name))

    for n, cnt in counts.items():
        if cnt > 1:
            log.warning("Duplicate drawing characteristic number %d seen %d times - auto-numbering all of them instead", n, cnt)
    valid = {n for n, cnt in counts.items() if cnt == 1}

    taken: set[int] = set()
    for c, (n, cleaned) in zip(chars, parsed):
        if n in valid:
            c.index = n
            c.feature_name = cleaned
            taken.add(n)

    next_auto = 1
    for c, (n, _cleaned) in zip(chars, parsed):
        if n in valid:
            continue
        while next_auto in taken:
            next_auto += 1
        c.index = next_auto
        taken.add(next_auto)

    for c in chars:
        c.id = f"C{c.index}"
    chars.sort(key=lambda c: c.index)


def _same(x: float | None, y: float | None) -> bool:
    return x is not None and y is not None and abs(x - y) <= 1e-6 * max(1.0, abs(x), abs(y))


def _value(c: Characteristic) -> float | None:
    return c.usl if c.kind == "geom_tolerance" else c.nominal


def _scale(a: Characteristic, b: Characteristic) -> float | None:
    """f with a's value = f × b's, or None if they differ. Both readers usually keep the drawing's value
    (f = 1), but XCAF converts some measures to mm and not others (NIST FTC-06: nominals as written in inches,
    tolerances in mm; FTC-09 converts the nominals too), so a value may also be the other one × its unit.
    Dimensions compare nominals only: XCAF's limits can mix a nominal in inches with a deviation in mm."""
    fa, fb = UNIT_TO_MODEL.get(a.unit, 1.0), UNIT_TO_MODEL.get(b.unit, 1.0)
    vb = _value(b)
    for f in dict.fromkeys((1.0, fb, 1.0 / fa)):
        if vb is not None and _same(_value(a), vb * f):
            return f
    return None


# Tolerance kinds XCAF has been seen to read as a generic "Position" (see _match).
_POSITION_FALLBACK = {"Angularity", "Concentricity", "Coaxiality", "Circular Runout"}


def _same_kind(a: Characteristic, b: Characteristic) -> bool:
    types = {a.type_label, b.type_label}
    position_fallback = a.kind == "geom_tolerance" and "Position" in types and bool(types & _POSITION_FALLBACK)
    return a.kind == b.kind and (a.type_label == b.type_label or position_fallback)


def _flat_datums(c: Characteristic) -> list[str]:
    """Datum letters in order, a common datum E-F as E, F (XCAF lists it that way)."""
    return [x for r in c.datum_refs for x in r.split("-")]


def _same_datums(a: Characteristic, b: Characteristic) -> bool:
    return not a.datum_refs or not b.datum_refs or _flat_datums(a) == _flat_datums(b)


def _match(a: Characteristic, pool: list[Characteristic], faces: bool = True) -> Characteristic | None:
    """Same PMI item seen by both parsers: same kind/type, same value (up to a unit conversion, see `_scale`),
    same datums, and overlapping faces (if any). With `faces=False` the first such item in file order is
    taken whatever its faces: the text reader can resolve a plane to a different coplanar face than XCAF.

    For geom_tolerance, XCAF's reader has been observed to mis-type some complex-entity tolerance kinds
    (Angularity, Concentricity, Coaxiality, CircularRunout) as a generic "Position" fallback even though it
    reads the rest of the entity correctly - so a type_label mismatch is still allowed to match when either
    side says "Position" (part21's text-derived type_label is always correct and wins in _enrich_from_part21).
    """
    cands = []
    for b in pool:
        if not _same_kind(a, b) or not _same_datums(a, b) or _scale(a, b) is None:
            continue
        if faces and a.face_ids and b.face_ids and not set(a.face_ids) & set(b.face_ids):
            continue
        cands.append(b)
    # Two dimensions with the same nominal (the two Ø30 journals of a shaft) both pass, and the text reader
    # can put both on the same face (same axis, same radius). The limits tell them apart: taking the first
    # one gave each journal the other's limits as soon as one of them was edited.
    return next((b for b in cands if _same_limits(a, b)), cands[0] if cands else None)


def _same_limits(a: Characteristic, b: Characteristic) -> bool:
    """Both readers give the same limits for a dimension, up to the unit factor their nominals differ by."""
    f = _scale(a, b)
    if a.kind != "dimension" or f is None or None in (a.usl, a.lsl, b.usl, b.lsl):
        return False
    return _same(a.usl, b.usl * f) and _same(a.lsl, b.lsl * f)


def _match_valueless(a: Characteristic, pool: list[Characteristic]) -> Characteristic | None:
    """A tolerance XCAF read without its value (0; NIST FTC-08, CTC-02) and the text reader's copy of it: same
    type and datums; the same faces, else overlapping ones, else the first in file order."""
    if a.kind != "geom_tolerance" or a.usl:
        return None
    cands = [b for b in pool if b.kind == a.kind and b.type_label == a.type_label and b.usl and _same_datums(a, b)]
    fa = set(a.face_ids)
    return (next((b for b in cands if fa and set(b.face_ids) == fa), None)
            or next((b for b in cands if fa & set(b.face_ids)), None)
            or next(iter(cands), None))


def _match_on_faces(a: Characteristic, pool: list[Characteristic]) -> Characteristic | None:
    """A dimension whose value XCAF misread (NIST D2MI-904: Ø0.251 for the file's Ø0.375) and the text
    reader's copy of it: same type, overlapping faces."""
    if a.kind != "dimension" or not a.face_ids:
        return None
    return next((b for b in pool if b.kind == a.kind and b.type_label == a.type_label
                 and set(a.face_ids) & set(b.face_ids)), None)


def _adopt_values(c: Characteristic, m: Characteristic) -> None:
    """Keep the drawing's values and unit, as the text reader saw them (it reads each measure with its own
    unit; XCAF's limits can mix units). Limits only XCAF found are kept as they are, if it kept the nominal
    in the drawing's unit."""
    if not m.unit:
        return
    if c.kind == "geom_tolerance":
        if m.usl is not None:
            c.usl, c.lsl = m.usl, 0.0
    elif m.usl is not None and m.lsl is not None:
        c.nominal, c.usl, c.lsl = m.nominal, m.usl, m.lsl
    elif not _same(c.nominal, m.nominal):
        c.nominal, c.usl, c.lsl = m.nominal, None, None
    c.unit = m.unit


def _xcaf_unit_policy(pairs: list[tuple[Characteristic, Characteristic]]) -> dict | None:
    """How XCAF treated this file's lengths, learnt from items both readers saw: the drawing's length unit and,
    for dimension nominals, dimension deviations and tolerance values, the factor XCAF applied (1, or the
    unit's mm factor). A factor nothing showed is missing. None for a mm drawing or no evidence."""
    units = Counter(m.unit for c, m in pairs if m.unit not in ("deg", "rad", ""))
    if not units:
        return None
    unit = units.most_common(1)[0][0]
    f = UNIT_TO_MODEL.get(unit, 1.0)
    if f == 1.0:
        return None
    votes: dict[str, Counter] = {"nominal": Counter(), "deviation": Counter(), "tolerance": Counter()}

    def vote(kind: str, x: float | None, y: float | None) -> None:
        if x is None or y is None or abs(y) < 1e-12:
            return
        for k in (1.0, f):
            if _same(x, y * k):
                votes[kind][k] += 1

    for c, m in pairs:
        if m.unit != unit:
            continue
        if c.kind == "geom_tolerance":
            vote("tolerance", c.usl, m.usl)
        else:
            vote("nominal", c.nominal, m.nominal)
            if None not in (c.usl, m.usl):
                vote("deviation", c.usl - c.nominal, m.usl - m.nominal)
    return {"unit": unit, **{k: v.most_common(1)[0][0] for k, v in votes.items() if v}}


def _apply_unit_policy(c: Characteristic, policy: dict) -> None:
    """Bring an XCAF-only item to the drawing's unit with the factors `_xcaf_unit_policy` found. Left as it is
    when a factor it needs was not seen."""
    if c.unit in ("deg", "rad"):
        return
    if c.kind == "geom_tolerance":
        if "tolerance" in policy and c.usl is not None:
            c.usl /= policy["tolerance"]
            c.unit = policy["unit"]
        return
    if "nominal" not in policy or (c.usl is not None and "deviation" not in policy):
        return
    nominal = c.nominal / policy["nominal"]
    if c.usl is not None:
        c.usl = nominal + (c.usl - c.nominal) / policy["deviation"]
    if c.lsl is not None:
        c.lsl = nominal + (c.lsl - c.nominal) / policy["deviation"]
    c.nominal, c.unit = nominal, policy["unit"]


def _enrich_from_part21(chars: list[Characteristic], p_chars: list[Characteristic]) -> set[int]:
    """Fill in what XCAF dropped from the text reader's copy of each item. Returns the p_chars indices used."""
    used: set[int] = set()
    pairs: dict[int, tuple[Characteristic, Characteristic]] = {}

    def pair(finder) -> None:
        for c in chars:
            if id(c) in pairs:
                continue
            m = finder(c, [p for i, p in enumerate(p_chars) if i not in used])
            if m is not None:
                used.add(next(i for i, p in enumerate(p_chars) if p is m))
                pairs[id(c)] = (c, m)

    pair(_match)
    pair(lambda c, pool: _match(c, pool, faces=False))
    pair(_match_valueless)
    pair(_match_on_faces)

    policy = _xcaf_unit_policy([(c, m) for c, m in pairs.values() if c.source == "xcaf"])
    for c, m in pairs.values():
        if c.type_label == "Position" and m.type_label != "Position":
            c.type_label = m.type_label  # correct XCAF's mis-typed fallback (see _match docstring)
        if not c.feature_name and m.feature_name:
            c.feature_name = m.feature_name
        if m.datum_refs and (not c.datum_refs or any("-" in r for r in m.datum_refs)):
            c.datum_refs = list(m.datum_refs)  # the text reader keeps a common datum E-F together
        if not c.modifiers and m.modifiers:
            c.modifiers = list(m.modifiers)
        if not c.face_ids and m.face_ids:
            c.face_ids = list(m.face_ids)
        _adopt_values(c, m)
    if policy:
        for c in chars:
            if id(c) not in pairs and c.source == "xcaf":
                _apply_unit_policy(c, policy)
    return used


def _default_feature_name(c: Characteristic) -> str:
    if c.kind == "geom_tolerance":
        return f"{c.type_label}" + (f" to {'|'.join(c.datum_refs)}" if c.datum_refs else "")
    if c.face_ids:
        return f"{c.type_label} (face {', '.join(str(f) for f in c.face_ids)})"
    return c.type_label
