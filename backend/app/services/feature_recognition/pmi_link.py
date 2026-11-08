"""Facts the drawing states that the geometry cannot show, attached to the recognized features.

**Threads.** A tapped hole is modelled at its tap-drill (or major) diameter, so it looks exactly like a plain
hole of that size; an external thread looks like a plain shaft. The thread lives in the PMI: a callout such
as "M8x1.25 - 6H" on the hole's face. This pass reads metric thread designations from the text of PMI
attached to a hole or shaft (same face ids) and records them. With no callout nothing is guessed, so a
thread modelled without PMI stays a plain hole or shaft for a reviewer to correct.

A thread a reviewer entered by hand (`params.thread`) is kept as it is.
"""
from __future__ import annotations

from app.services.feature_recognition.thread_rules import load_process_rules

_THREAD_CLASS = {"hole": "internal_screw_thread", "shaft": "external_screw_thread"}


def _text(c: dict) -> str:
    return " ".join(str(x) for x in (c.get("feature_name"), c.get("requirement"), *(c.get("modifiers") or [])) if x)


def apply_thread_callouts(features: list[dict], characteristics: list[dict]) -> list[str]:
    """Tag holes/shafts that carry a thread callout. Returns the ids of the features tagged."""
    rules = load_process_rules()
    tagged = []
    for f in features:
        if f.get("type") not in _THREAD_CLASS or f.get("state") == "rejected":
            continue
        params = f.setdefault("params", {})
        if params.get("thread"):
            continue
        fids = set(f.get("face_ids") or [])
        for c in characteristics:
            if not fids & set(c.get("face_ids") or []):
                continue
            th = rules.parse_thread(_text(c))
            if th is None:
                continue
            params["thread"] = th.designation
            params["thread_source"] = f"PMI {c.get('id') or '?'}"
            f["mf_class"] = _THREAD_CLASS[f["type"]]
            f.setdefault("evidence", []).append(f"thread {th.designation} from PMI {c.get('id') or '?'}: {_text(c)!r}")
            tagged.append(f["id"])
            break
    return tagged
