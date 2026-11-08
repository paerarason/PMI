"""Pydantic request schemas for authoring PMI."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class PmiRefIn(BaseModel):
    """A picked face, edge or vertex on the model, by the tessellator's canonical face_id/edge_id/vertex_id
    (see app/services/tessellator.py's iter_faces / iter_edges / iter_vertices, and MeshData.face_ranges /
    .edges / .vertices)."""

    kind: Literal["face", "edge", "vertex"]
    ref_id: int = Field(..., ge=0)


class PmiWriteIn(BaseModel):
    """The authorable properties of one dimension or geometric tolerance - shared by adding a new one
    and editing an existing one.

    datum_refs may only name datums already present on the model (returned in ModelSummary.datums) -
    authoring a brand-new datum isn't supported: verified empirically to write correct STEP text that
    OCCT's own reader then silently mis-resolves on the next round trip (see app/services/pmi_writer.py).
    """

    type_label: str = Field(..., min_length=1, max_length=32)
    feature_name: str = ""
    nominal: float = 0.0
    usl: float | None = None  # dimension only
    lsl: float | None = None  # dimension only
    value: float | None = None  # geom_tolerance only (the tolerance zone)
    datum_refs: list[str] = []

    @field_validator("refs", check_fields=False)
    @classmethod
    def _check_refs(cls, v):
        keys = [(r.kind, r.ref_id) for r in v]
        if len(set(keys)) != len(keys):
            raise ValueError("refs must not repeat")
        return v

    # A model_validator, not a field_validator on `usl`: `usl` is declared before `lsl`, so at
    # field-validation time info.data has no `lsl` yet and the check would never fire.
    @model_validator(mode="after")
    def _check_limits(self):
        if self.usl is not None and self.lsl is not None and self.usl < self.lsl:
            raise ValueError("USL must be >= LSL")
        return self


class PmiAddIn(PmiWriteIn):
    """A single new dimension or geometric tolerance to write into the model's STEP file.

    refs may reference edges and vertices as well as faces - also verified to write/read back correctly -
    but an edge/vertex-only characteristic isn't anchored to it visually yet (face_ids come back empty,
    same as any other PMI without a geometry link); see app/services/pmi_writer.py's docstring.
    """

    kind: Literal["dimension", "geom_tolerance"]
    refs: list[PmiRefIn] = Field(..., min_length=1, max_length=2)

    @model_validator(mode="after")
    def _check_value(self):
        if self.kind == "geom_tolerance" and self.value is None:
            raise ValueError("value is required for a geom_tolerance")
        return self


class PmiEditIn(PmiWriteIn):
    """New values for one characteristic already on the model, addressed by its characteristic id
    (ModelSummary.characteristics[].id, e.g. "C3"). Whatever is sent replaces what's on the
    characteristic now - an omitted usl/lsl/datum_refs clears the limits / datum system rather than
    keeping them, so send the full intended state.

    `kind` isn't editable: a dimension can't become a geometric tolerance (they're different XCAF
    entities). `type_label` can change freely within the kind.

    refs is optional here, unlike PmiAddIn's: leaving it empty keeps the geometry the characteristic
    already references, so a values-only edit needs no re-picking in the 3D view.
    """

    refs: list[PmiRefIn] = Field(default_factory=list, max_length=2)
