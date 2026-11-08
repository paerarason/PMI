"""Small utilities for post-processing raw Part-21 (ISO 10303-21) STEP text.

Shared by app/services/step_metadata.py (runtime, patches an uploaded file's revision/approval on
export) and scripts/_pmi_helpers.py (offline sample generation) so the two never drift apart.
"""
from __future__ import annotations

import re


def dewrap(text: str) -> str:
    """STEP-21 soft-wraps long entity lines at ~80 chars. Regex patching over the raw text assumes
    one entity per line, so re-join any continuation line (one that doesn't start a new `#id = `
    entity, or a section keyword) onto the previous line first."""
    out: list[str] = []
    for line in text.split("\n"):
        if out and not re.match(r"^(#\d+ = |ENDSEC;|DATA;|HEADER;|END-ISO-10303-21;)", line):
            out[-1] = out[-1] + line
        else:
            out.append(line)
    return "\n".join(out)


def next_entity_id(text: str) -> int:
    ids = re.findall(r"^#(\d+)\s*=", text, re.M)
    return (max(int(m) for m in ids) + 1) if ids else 1


def step_string(value: str) -> str:
    """Escape a Python string for embedding as a STEP simple string literal ('...')."""
    return "'" + value.replace("'", "''") + "'"
