"""Shared PMI data structures + GD&T symbol tables."""
from __future__ import annotations

import math
from dataclasses import dataclass, field

GDT_SYMBOLS = {
    "Flatness": "⏥",
    "Straightness": "⏤",
    "Circularity": "○",
    "Cylindricity": "⌭",
    "Profile of Line": "⌒",
    "Profile of Surface": "⌓",
    "Angularity": "∠",
    "Perpendicularity": "⟂",
    "Parallelism": "∥",
    "Position": "⌖",
    "Concentricity": "◎",
    "Coaxiality": "◎",
    "Symmetry": "⌯",
    "Circular Runout": "↗",
    "Total Runout": "⌰",
}

DIM_SYMBOLS = {
    "Diameter": "Ø",
    "Radius": "R",
    "Spherical Diameter": "SØ",
    "Spherical Radius": "SR",
    "Angular": "∠",
}


# PMI keeps the drawing's units (`unit`) for display. Geometry is always loaded in mm
# and angles are worked in degrees, so anything that compares PMI with the model uses `in_model_units`.
UNIT_TO_MODEL = {"mm": 1.0, "in": 25.4, "cm": 10.0, "m": 1000.0, "um": 0.001, "ft": 304.8,
                 "deg": 1.0, "rad": math.degrees(1.0)}
_ANGLE_UNITS = {"deg", "rad"}


def in_model_units(c: dict) -> dict:
    """A characteristic dict with its values in model units (mm, degrees). The same dict when they already
    are; otherwise a copy that also records `drawing_unit`."""
    unit = c.get("unit") or "mm"
    f = UNIT_TO_MODEL.get(unit, 1.0)
    if f == 1.0:
        return c
    out = dict(c, unit="deg" if unit in _ANGLE_UNITS else "mm", drawing_unit=unit)
    for k in ("nominal", "usl", "lsl"):
        if out.get(k) is not None:
            out[k] = float(out[k]) * f
    return out


@dataclass
class Datum:
    label: str
    face_ids: list[int] = field(default_factory=list)
    anchor: list[float] | None = None
    label_pos: list[float] | None = None
    source: str = "xcaf"


@dataclass
class Characteristic:
    kind: str  # dimension | geom_tolerance
    feature_name: str
    type_label: str  # "Diameter", "Linear Distance", "Flatness", ...
    nominal: float
    usl: float | None
    lsl: float | None
    unit: str = "mm"
    datum_refs: list[str] = field(default_factory=list)
    face_ids: list[int] = field(default_factory=list)
    anchor: list[float] | None = None
    label_pos: list[float] | None = None
    source: str = "xcaf"
    modifiers: list[str] = field(default_factory=list)
    id: str = ""
    index: int = 0
    # Inferred geometric feature the characteristic sits on + material side (internal/external),
    # populated by feature_classifier in pmi_extractor. Drives the rework/scrap reaction plan.
    feature_type: str | None = None
    material_side: str | None = None
    # 1-based position of this characteristic's label in the source document's
    # XCAFDoc_DimTolTool.GetDimensionLabels() / .GetGeomToleranceLabels() sequence - the handle
    # app/services/pmi_writer.py's edit_pmi uses to find it again. `index`/`id` can't serve: they're
    # assigned after sorting/renumbering (see pmi_extractor._assign_numbers) and shift as PMI is added.
    # None for anything not read from XCAF (part21-only items), which therefore can't be edited.
    xcaf_index: int | None = None

    @property
    def symbol(self) -> str:
        if self.kind == "geom_tolerance":
            return GDT_SYMBOLS.get(self.type_label, "")
        return DIM_SYMBOLS.get(self.type_label, "")

    def requirement_text(self) -> str:
        """Human-readable requirement, e.g. 'Ø16 ±0.05' or '⏥ 0.05' or '⌖ Ø0.1 | A | B'."""
        if self.kind == "geom_tolerance":
            parts = [f"{self.symbol} {self._fmt(self.usl or 0.0)}".strip()]
            parts.extend(self.datum_refs)
            return " | ".join(parts)
        nominal = f"{self.symbol}{self._fmt(self.nominal)}"
        if self.usl is None or self.lsl is None:
            return nominal
        up, lo = self.usl - self.nominal, self.lsl - self.nominal
        if abs(up + lo) < 1e-9:
            return f"{nominal} ±{self._fmt(up)}"
        return f"{nominal} +{self._fmt(up)}/{self._fmt(lo)}"

    @staticmethod
    def _fmt(v: float) -> str:
        s = f"{v:.4f}".rstrip("0").rstrip(".")
        return s if s not in ("", "-0") else "0"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "index": self.index,
            "kind": self.kind,
            "feature_name": self.feature_name,
            "type_label": self.type_label,
            "symbol": self.symbol,
            "requirement": self.requirement_text(),
            "nominal": self.nominal,
            "usl": self.usl,
            "lsl": self.lsl,
            "unit": self.unit,
            "datum_refs": self.datum_refs,
            "modifiers": self.modifiers,
            "face_ids": self.face_ids,
            "feature_type": self.feature_type,
            "material_side": self.material_side,
            "anchor": self.anchor,
            "label_pos": self.label_pos,
            "source": self.source,
            "xcaf_index": self.xcaf_index,
        }
