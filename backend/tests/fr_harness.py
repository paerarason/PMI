"""B0 — feature-recognition accuracy harness (shared by the golden generator and the accuracy test).

Not a test module itself (no `test_` prefix). It scores a list of recognized features against a curated
"golden" expectation per sample and returns precision/recall per feature type plus per-match parameter
deviations, so a new recognizer can be proven to *add* detections without regressing existing ones.

Golden format (`tests/fr_golden/<sample>.json`):
    {"sample": "...", "features": [{"type": "hole", "diameter": 16.0, "through": true}, ...]}

Each golden feature lists its type and the *signature* params that identify it (see `_SIGNATURE`).
Matching is greedy within a type, pairing the closest primary-size param first.
"""
from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path

GOLDEN_DIR = Path(__file__).resolve().parent / "fr_golden"

# The identifying params captured per feature type; the first is the primary size used for matching.
_SIGNATURE = {
    "hole": ["diameter", "depth", "through", "counterbored", "countersunk"],
    "shaft": ["diameter", "length"],
    "plane": ["area"],
    "chamfer": ["included_angle_deg"],
    "countersink": ["included_angle_deg"],
    "fillet": ["radius"],
    "round": ["radius"],
    "spherical_seat": ["diameter"],
    "spherical_boss": ["diameter"],
    "pocket": ["depth", "width", "length", "min_corner_radius"],
    "slot": ["depth", "width", "length", "min_corner_radius"],
    "step": ["depth", "width", "length"],
}

# Numeric tolerance for a matched param to count as correct: max(abs, rel * |golden|).
_ABS_TOL = 0.05
_REL_TOL = 0.02


def signature(feature: dict) -> dict:
    """The type + signature params of a feature (recognizer output dict or golden entry)."""
    ftype = feature.get("type")
    params = feature.get("params", feature)   # golden entries are flat; recognizer output nests params
    sig = {"type": ftype}
    for key in _SIGNATURE.get(ftype, []):
        if key in params and params[key] is not None:
            sig[key] = params[key]
    return sig


def _primary(sig: dict) -> float | None:
    for key in _SIGNATURE.get(sig["type"], []):
        v = sig.get(key)
        if isinstance(v, (int, float)):
            return float(v)
    return None


def _param_ok(a, b) -> bool:
    if isinstance(a, bool) or isinstance(b, bool):
        return bool(a) == bool(b)
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) <= max(_ABS_TOL, _REL_TOL * abs(b))
    return a == b


@dataclass
class TypeScore:
    tp: int = 0
    fp: int = 0
    fn: int = 0
    param_mismatches: list[str] = field(default_factory=list)

    @property
    def precision(self) -> float:
        return self.tp / (self.tp + self.fp) if (self.tp + self.fp) else 1.0

    @property
    def recall(self) -> float:
        return self.tp / (self.tp + self.fn) if (self.tp + self.fn) else 1.0


@dataclass
class Score:
    by_type: dict[str, TypeScore] = field(default_factory=dict)

    @property
    def precision(self) -> float:
        tp = sum(s.tp for s in self.by_type.values())
        fp = sum(s.fp for s in self.by_type.values())
        return tp / (tp + fp) if (tp + fp) else 1.0

    @property
    def recall(self) -> float:
        tp = sum(s.tp for s in self.by_type.values())
        fn = sum(s.fn for s in self.by_type.values())
        return tp / (tp + fn) if (tp + fn) else 1.0

    @property
    def param_mismatches(self) -> list[str]:
        return [m for s in self.by_type.values() for m in s.param_mismatches]

    def report(self) -> str:
        lines = [f"precision={self.precision:.3f} recall={self.recall:.3f}"]
        for t, s in sorted(self.by_type.items()):
            lines.append(f"  {t:16s} tp={s.tp} fp={s.fp} fn={s.fn} "
                         f"P={s.precision:.2f} R={s.recall:.2f}")
        lines += [f"  ! {m}" for m in self.param_mismatches]
        return "\n".join(lines)


def score(predicted: list[dict], golden: list[dict]) -> Score:
    """Greedy per-type matching (closest primary param first) → precision/recall + param checks."""
    result = Score()
    types = {f.get("type") for f in predicted} | {f.get("type") for f in golden}
    for ftype in types:
        ts = TypeScore()
        preds = [signature(f) for f in predicted if f.get("type") == ftype]
        golds = [signature(f) for f in golden if f.get("type") == ftype]
        remaining = list(preds)
        for g in golds:
            gp = _primary(g)
            # nearest remaining prediction by primary param (or any, if no numeric primary)
            best, best_d = None, math.inf
            for p in remaining:
                pp = _primary(p)
                d = abs((pp or 0.0) - (gp or 0.0)) if (pp is not None and gp is not None) else 0.0
                if d < best_d:
                    best, best_d = p, d
            if best is None:
                ts.fn += 1
                continue
            remaining.remove(best)
            ts.tp += 1
            for key in _SIGNATURE.get(ftype, []):
                if key in g and not _param_ok(best.get(key), g.get(key)):
                    ts.param_mismatches.append(
                        f"{ftype}.{key}: predicted {best.get(key)} vs golden {g.get(key)}")
        ts.fp += len(remaining)
        result.by_type[ftype] = ts
    return result


def load_golden(sample: str) -> list[dict]:
    data = json.loads((GOLDEN_DIR / f"{sample}.json").read_text())
    return data["features"]


def to_golden_features(features) -> list[dict]:
    """Flatten recognizer FeatureCandidates into golden entries (type + signature params)."""
    out = []
    for f in features:
        d = f.to_dict() if hasattr(f, "to_dict") else f
        sig = signature(d)
        out.append(sig)
    return out
