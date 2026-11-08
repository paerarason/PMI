"""Process rules as data (samples/thread_rules.json) plus the standard tables they carry:
metric tap drills and ISO 286 tolerance grades. Nothing here is specific to a part or a machine."""
from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass, field
from pathlib import Path

from app import config

RULES_FILE = config.SAMPLES_DIR / "thread_rules.json"

_THREAD = re.compile(r"\bM\s?(\d+(?:\.\d+)?)(?:\s*[xX×]\s*(\d+(?:\.\d+)?))?\b")
_FIT = re.compile(r"^\s*([A-Za-z]{1,2})(\d{1,2})\s*$")


@dataclass(frozen=True)
class Thread:
    designation: str          # canonical "M8x1.25"
    major: float
    pitch: float

    def to_dict(self) -> dict:
        return {"designation": self.designation, "major": self.major, "pitch": self.pitch}


@dataclass
class ProcessRules:
    raw: dict
    source: str = ""
    coarse_pitch: dict[float, float] = field(default_factory=dict)

    def __getattr__(self, name):            # rules.spot_depth_mm etc., straight from the JSON
        try:
            return self.raw[name]
        except KeyError:
            raise AttributeError(f"process rule {name!r} is not defined in {self.source}") from None

    # --- threads ---------------------------------------------------------------------------------------
    def parse_thread(self, text: str | None) -> Thread | None:
        """'M8x1.25', 'M8 x 1.25 - 6H', 'M8' (coarse pitch) → Thread. None if the text names no thread."""
        if not text:
            return None
        m = _THREAD.search(str(text))
        if not m:
            return None
        major = float(m.group(1))
        pitch = float(m.group(2)) if m.group(2) else self.coarse_pitch.get(major)
        if pitch is None:
            return None
        return Thread(f"M{major:g}x{pitch:.2f}".rstrip("0").rstrip(".") if pitch % 1 else f"M{major:g}x{pitch:.1f}",
                      major, pitch)

    def tap_drill(self, th: Thread) -> float:
        std = self.raw["tap_drill_mm"].get(th.designation)
        return float(std) if std is not None else round(th.major - th.pitch, 1)

    # --- fits -------------------------------------------------------------------------------------------
    def fit_band(self, fit: str | None, diameter: float) -> tuple[float, float] | None:
        """(lower, upper) deviation in mm for an H-hole fit code like 'H7', else None."""
        if not fit:
            return None
        m = _FIT.match(fit)
        if not m or m.group(1) != "H":
            return None
        grade = f"IT{int(m.group(2))}"
        table = self.raw["it_grades_um"]
        if grade not in table:
            return None
        for limit, um in zip(table["ranges_mm"], table[grade]):
            if diameter <= limit + 1e-9:
                return (0.0, um / 1000.0)
        return None

    def ream_allowance(self, diameter: float) -> float:
        for limit, allow in self.raw["ream_allowance_mm"]:
            if diameter <= limit + 1e-9:
                return float(allow)
        return float(self.raw["ream_allowance_mm"][-1][1])

    def ream_predrill(self, diameter: float) -> float:
        return math.floor((diameter - self.ream_allowance(diameter)) * 10 + 1e-6) / 10.0


def load_process_rules(path: str | Path | None = None) -> ProcessRules:
    p = Path(path) if path else RULES_FILE
    raw = json.loads(p.read_text())
    coarse = {}
    for desig in raw.get("tap_drill_mm", {}):
        m = _THREAD.search(desig)
        if m and m.group(2):
            coarse[float(m.group(1))] = float(m.group(2))
    return ProcessRules(raw=raw, source=str(p), coarse_pitch=coarse)
