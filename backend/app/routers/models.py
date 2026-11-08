"""STEP upload, PMI authoring, feature recognition and 2D drawing endpoints."""
from __future__ import annotations

import logging
import uuid
from dataclasses import asdict
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, Response

from app import config
from app.schemas import PmiAddIn, PmiEditIn
from app.services import drawing, model_checks, pmi_extractor, pmi_writer, tessellator
from app.services.blank_model import make_blank_block
from app.services.feature_recognition.engine import recognize_with_topology
from app.services.feature_recognition.pmi_link import apply_thread_callouts
from app.services.pmi_types import in_model_units
from app.services.pmi_writer import EditedCharacteristic, NewCharacteristic, PmiWriteError
from app.services.step_loader import StepReadError, load_step
from app.store import ModelRecord, store

log = logging.getLogger("pmi.models")
router = APIRouter(prefix="/api/models", tags=["models"])


def ingest(path: Path, file_name: str, cache: bool = True) -> ModelRecord:
    """Load, mesh, read the PMI and recognize the features of one STEP file. `cache=False` returns the record
    without putting it in the model store, for a caller that may still throw it away."""
    try:
        loaded = load_step(str(path))
    except StepReadError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    mesh = tessellator.tessellate(loaded.shape, loaded.bbox)
    chars, datums, source = pmi_extractor.extract_pmi(str(path), loaded)
    warnings: list[str] = []
    if not chars:
        warnings.append("No semantic PMI (dimensions / geometric tolerances) found in this STEP file.")
    elif source == "part21":
        warnings.append("PMI was read from the STEP text (not geometry-linked in XCAF); balloon placement may be approximate.")
    unlinked = [c.id for c in chars if not c.face_ids]
    if unlinked:
        warnings.append(f"{len(unlinked)} characteristic(s) are not linked to model faces: {', '.join(unlinked)}.")
    warnings.extend(loaded.diagnostics)
    try:
        found, topo = recognize_with_topology(loaded.body)
        features = [f.to_dict() for f in found]
        apply_thread_callouts(features, [c.to_dict() for c in chars])
    except Exception as exc:  # noqa: BLE001 - feature recognition must never block a model load
        log.warning("Feature recognition failed for %s: %s", file_name, exc)
        features, topo = [], None
        warnings.append("Automatic feature recognition failed for this model.")
    if topo is not None:
        try:
            note = model_checks.unexplained_faces(topo, features)
            if note:
                warnings.append(note)
            warnings.extend(model_checks.pmi_size_conflicts(features, [in_model_units(c.to_dict()) for c in chars],
                                                            model_checks.declares_inch_unit(str(path))))
        except Exception as exc:  # noqa: BLE001 - these are advice; a failed check must not block a model load
            log.warning("Model checks failed for %s: %s", file_name, exc)
    rec = ModelRecord(
        model_id=uuid.uuid4().hex[:12],
        file_name=file_name,
        path=str(path),
        part_name=loaded.part_name,
        schema=loaded.schema,
        header=loaded.header,
        bbox={"min": list(loaded.bbox.min), "max": list(loaded.bbox.max)},
        mesh={
            "positions": mesh.positions,
            "normals": mesh.normals,
            "indices": mesh.indices,
            "face_ranges": mesh.face_ranges,
            "edges": mesh.edges,
            "vertices": mesh.vertices,
        },
        characteristics=[c.to_dict() for c in chars],
        datums=[asdict(d) for d in datums],
        pmi_source=source,
        face_count=len(mesh.face_ranges),
        warnings=warnings,
        features=features,
    )
    if cache:
        store.put(rec)
    return rec


@router.post("")
async def upload_model(file: UploadFile = File(...)):
    name = file.filename or "model.step"
    if not name.lower().endswith((".step", ".stp", ".p21")):
        raise HTTPException(status_code=400, detail="Only .step / .stp files are supported")
    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = config.UPLOAD_DIR / f"{uuid.uuid4().hex}_{Path(name).name}"
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    dest.write_bytes(data)
    return ingest(dest, name).summary()


@router.post("/blank")
def create_blank(
    width: float = 80.0,
    depth: float = 50.0,
    height: float = 20.0,
    hole_dia: float = 0.0,
    name: str = "BLANK-PART-001",
):
    """Generate an empty block (geometry only, no PMI) to author PMI onto.

    Optional `hole_dia` cuts a centred through-hole so there is a cylindrical face for a diameter dimension.
    Returns a normal ModelSummary (with a fresh model_id), identical downstream to an uploaded model.
    """
    for label, v in (("width", width), ("depth", depth), ("height", height)):
        if not v or v <= 0 or v > 100000:
            raise HTTPException(status_code=400, detail=f"{label} must be a positive number (mm), <= 100000")
    if hole_dia < 0 or hole_dia >= min(width, depth):
        raise HTTPException(status_code=400, detail="hole_dia must be >= 0 and smaller than width and depth")
    safe = "".join(ch for ch in name if ch.isalnum() or ch in "-_ ").strip() or "BLANK-PART-001"
    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = config.UPLOAD_DIR / f"{uuid.uuid4().hex}_{safe.replace(' ', '_')}.step"
    try:
        make_blank_block(dest, safe, width, depth, height, hole_dia)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate blank model: {exc}") from exc
    return ingest(dest, f"{safe.replace(' ', '_')}.step").summary()


@router.get("/pmi/types")
def pmi_types():
    """The dimension / geometric-tolerance type labels the writer can actually author, so the Add-GD&T
    dropdown offers exactly those (see pmi_writer.authorable_* for how the list is derived)."""
    return {
        "dimension": pmi_writer.authorable_dimension_types(),
        "geom_tolerance": pmi_writer.authorable_geom_tolerance_types(),
    }


@router.get("/samples")
def list_samples():
    if not config.SAMPLES_DIR.exists():
        return []
    return sorted(p.name for p in config.SAMPLES_DIR.iterdir() if p.suffix.lower() in (".step", ".stp"))


@router.post("/samples/{name}")
def load_sample(name: str):
    path = (config.SAMPLES_DIR / Path(name).name).resolve()
    if not path.exists() or config.SAMPLES_DIR.resolve() not in path.parents:
        raise HTTPException(status_code=404, detail="Sample not found (generate them: python scripts/make_samples.py)")
    return ingest(path, path.name).summary()


@router.get("")
def list_models():
    return store.list()


def _require(model_id: str) -> ModelRecord:
    rec = store.get(model_id)
    if rec is None:
        raise HTTPException(status_code=404, detail="Model not found: open or upload the file again")
    return rec


@router.get("/{model_id}")
def get_model(model_id: str):
    return _require(model_id).summary()


@router.get("/{model_id}/mesh")
def get_mesh(model_id: str):
    return _require(model_id).mesh


@router.get("/{model_id}/mesh.bin")
def get_mesh_binary(model_id: str):
    """The same mesh as GET /mesh, packed little-endian (tessellator.pack_mesh): a third of the size, and the
    browser reads the buffers as typed arrays instead of parsing millions of numbers."""
    rec = _require(model_id)
    if rec.mesh_bin is None:
        rec.mesh_bin = tessellator.pack_mesh(rec.mesh)
    return Response(content=rec.mesh_bin, media_type="application/octet-stream")


@router.get("/{model_id}/features")
def get_features(model_id: str):
    """The recognized manufacturing features, each with its faces, parameters, confidence and evidence."""
    return _require(model_id).features


def _drawing(model_id: str) -> dict:
    rec = _require(model_id)
    if rec.drawing is None:
        try:
            rec.drawing = drawing.build_drawing(load_step(rec.path).body, rec.summary())
        except StepReadError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
    return rec.drawing


@router.get("/{model_id}/drawing")
def get_drawing(model_id: str):
    """The 2D sheet as data: views (polylines), balloons, datum flags, overall sizes and the PMI table."""
    return _drawing(model_id)


@router.get("/{model_id}/drawing.svg")
def get_drawing_svg(model_id: str):
    return Response(content=drawing.to_svg(_drawing(model_id)), media_type="image/svg+xml")


@router.get("/{model_id}/drawing.dxf")
def get_drawing_dxf(model_id: str):
    rec = _require(model_id)
    name = Path(rec.file_name).stem + "_drawing.dxf"
    return Response(content=drawing.to_dxf(_drawing(model_id)), media_type="application/dxf",
                    headers={"Content-Disposition": f'attachment; filename="{name}"'})


@router.get("/{model_id}/file")
def download_file(model_id: str):
    rec = _require(model_id)
    return FileResponse(rec.path, media_type="model/step", filename=rec.file_name)


def _tolerance_band(kind: str, payload: PmiAddIn | PmiEditIn) -> tuple[float, float]:
    """(lower, upper) as pmi_writer wants them: for a dimension, the limits as offsets from the nominal;
    for a geometric tolerance, the zone value in `upper`."""
    if kind == "dimension":
        lower = (payload.lsl - payload.nominal) if payload.lsl is not None else 0.0
        upper = (payload.usl - payload.nominal) if payload.usl is not None else 0.0
        return lower, upper
    return 0.0, payload.value or 0.0


def _require_mm_pmi(rec: ModelRecord) -> None:
    """Refuse a PMI write on a drawing whose PMI is not in mm. OCCT's STEP writer writes every XCAF value
    as mm, but XCAF holds some of an inch drawing's values as written: one edit turned every other
    characteristic's 0.8125 in into 0.8125 mm (NIST STC-06, CTC-05). Angles survive (written in radians,
    read back in degrees). Metadata writes are text edits and are not affected."""
    units = sorted({c.get("unit") for c in rec.characteristics} - {"mm", "deg", "rad", None})
    if units:
        raise HTTPException(
            status_code=422,
            detail=f"This drawing's PMI is in {', '.join(units)}. Adding or editing PMI would rewrite every "
                   "existing characteristic in mm without converting its value, so it is blocked for "
                   "drawings that are not in mm.",
        )


def _write_and_reingest(rec: ModelRecord, write, edited_id: str | None = None) -> dict:
    """Run `write(dest)` - the pmi_writer call that produces an updated STEP file - and re-ingest the
    result, so it comes back through the same extraction/placement pipeline as every other
    characteristic: a new model_id, with the change present.

    The write is kept only if every characteristic it was not meant to touch comes back unchanged
    (`edited_id` is the one it was). OCCT rewrites the whole file, and on real files it cannot always put
    the existing PMI back: one added dimension dropped a straightness tolerance and merged three position
    tolerances on NIST FTC-10. A drawing that silently loses a tolerance is worse than a refused edit."""
    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = config.UPLOAD_DIR / f"{uuid.uuid4().hex}_{Path(rec.file_name).stem}.step"
    try:
        write(dest)
    except PmiWriteError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    new = ingest(dest, rec.file_name, cache=False)      # not cached yet: a refused write must not evict a model
    damage = model_checks.pmi_damaged_by_write(rec.characteristics, new.characteristics, edited_id)
    if damage:
        dest.unlink(missing_ok=True)
        shown = "; ".join(damage[:6]) + (f"; and {len(damage) - 6} more" if len(damage) > 6 else "")
        raise HTTPException(
            status_code=422,
            detail=f"Not saved. Writing this file back would damage {len(damage)} characteristic(s) you did not "
                   f"edit, because OpenCASCADE's STEP writer cannot reproduce them: {shown}. The model is unchanged.",
        )
    store.put(new)
    return new.summary()


@router.post("/{model_id}/pmi")
def add_pmi(model_id: str, payload: PmiAddIn):
    """Add a new dimension or geometric tolerance to the model's STEP file."""
    rec = _require(model_id)
    _require_mm_pmi(rec)

    lower, upper = _tolerance_band(payload.kind, payload)
    spec = NewCharacteristic(
        kind=payload.kind,
        type_label=payload.type_label,
        name=payload.feature_name or payload.type_label,
        refs=[(r.kind, r.ref_id) for r in payload.refs],
        nominal=payload.nominal,
        lower=lower,
        upper=upper,
        datum_refs=tuple(payload.datum_refs),
    )
    return _write_and_reingest(rec, lambda dest: pmi_writer.add_pmi(rec.path, spec, dest))


@router.put("/{model_id}/pmi/{characteristic_id}")
def edit_pmi(model_id: str, characteristic_id: str, payload: PmiEditIn):
    """Rewrite an existing characteristic in the model's STEP file, in place.

    Only PMI that was read out of the file's XCAF data can be edited - it's the XCAF label the writer
    mutates. A characteristic recovered from the STEP text instead (pmi_source "part21", or a tolerance
    XCAF dropped; see app/services/pmi_extractor.py) has no such label, so there's nothing to edit
    through and it's rejected rather than silently written as a duplicate.
    """
    rec = _require(model_id)

    char = next((c for c in rec.characteristics if c["id"] == characteristic_id), None)
    if char is None:
        raise HTTPException(status_code=404, detail=f"Characteristic {characteristic_id} not found on this model")
    if char.get("xcaf_index") is None:
        raise HTTPException(
            status_code=422,
            detail=f"{characteristic_id} was read from the STEP text, not the file's semantic (XCAF) PMI, "
                   "so it can't be edited in place. Add a replacement characteristic instead.",
        )
    if char["kind"] == "geom_tolerance" and payload.value is None:
        raise HTTPException(status_code=422, detail="value is required when editing a geometric tolerance")
    _require_mm_pmi(rec)

    lower, upper = _tolerance_band(char["kind"], payload)
    spec = EditedCharacteristic(
        kind=char["kind"],
        xcaf_index=char["xcaf_index"],
        type_label=payload.type_label,
        name=payload.feature_name or payload.type_label,
        refs=[(r.kind, r.ref_id) for r in payload.refs],
        nominal=payload.nominal,
        lower=lower,
        upper=upper,
        datum_refs=tuple(payload.datum_refs),
    )
    return _write_and_reingest(rec, lambda dest: pmi_writer.edit_pmi(rec.path, spec, dest), edited_id=characteristic_id)
