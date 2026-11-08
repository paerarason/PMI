"""In-memory cache of parsed models (mesh + PMI), keyed by model id."""
from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass, field
from threading import Lock

from app import config
from app.services.pmi_types import in_model_units


@dataclass
class ModelRecord:
    model_id: str
    file_name: str
    path: str
    part_name: str
    schema: str
    header: dict
    bbox: dict
    mesh: dict
    characteristics: list[dict]
    datums: list[dict]
    pmi_source: str
    face_count: int
    warnings: list[str] = field(default_factory=list)
    # Recognized manufacturing features (see services/feature_recognition).
    features: list[dict] = field(default_factory=list)
    # The 2D sheet (services/drawing.py), built on first use.
    drawing: dict | None = None
    # The mesh packed for GET /mesh.bin (tessellator.pack_mesh), built on first use.
    mesh_bin: bytes | None = None

    @property
    def characteristics_mm(self) -> list[dict]:
        """The characteristics in model units (mm, degrees), for anything that compares them with geometry.
        `characteristics` keeps the drawing's units for display."""
        return [in_model_units(c) for c in self.characteristics]

    def summary(self) -> dict:
        return {
            "model_id": self.model_id,
            "file_name": self.file_name,
            "part_name": self.part_name,
            "schema": self.schema,
            "header": self.header,
            "bbox": self.bbox,
            "characteristics": self.characteristics,
            "datums": self.datums,
            "pmi_source": self.pmi_source,
            "face_count": self.face_count,
            "warnings": self.warnings,
            "features": self.features,
            "feature_count": len(self.features),
        }


class ModelStore:
    def __init__(self, capacity: int = config.MAX_CACHED_MODELS):
        self._items: OrderedDict[str, ModelRecord] = OrderedDict()
        self._lock = Lock()
        self._capacity = capacity

    def put(self, rec: ModelRecord) -> None:
        with self._lock:
            self._items[rec.model_id] = rec
            self._items.move_to_end(rec.model_id)
            while len(self._items) > self._capacity:
                self._items.popitem(last=False)

    def get(self, model_id: str) -> ModelRecord | None:
        with self._lock:
            rec = self._items.get(model_id)
            if rec:
                self._items.move_to_end(model_id)
            return rec

    def list(self) -> list[dict]:
        with self._lock:
            return [
                {"model_id": r.model_id, "file_name": r.file_name, "part_name": r.part_name, "characteristics": len(r.characteristics)}
                for r in reversed(self._items.values())
            ]


store = ModelStore()
