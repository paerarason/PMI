"""Add a new GD&T characteristic (dimension or geometric tolerance) onto an *already-loaded* STEP file's
XCAF PMI - or rewrite one that's already there (`edit_pmi`) - preserving everything else in the file, and
return the updated file's bytes.

Extends scripts/_pmi_helpers.py's PmiBuilder technique (see that module's docstring for the full writeup
of the underlying OCCT 7.9 STEPCAFControl_Writer quirks) from "build a fresh document from a bare shape"
to "extend a document that was just read from a real file": we reuse app.services.step_loader.load_step's
XCAF doc/shape/shape_tool instead of creating a new TDocStd_Document, so every existing dimension,
tolerance, datum, name and color already in the file survives the round trip untouched.

**Known limitation, verified empirically**: adding a brand-new *datum* this way is unreliable - the STEP
text it produces is correct (checked byte-for-byte: a distinct `DATUM('C')` entity, correctly linked), but
re-reading that file back through STEPCAFControl_Reader silently mis-resolves the new datum's name/identity
(observed: a 3rd datum consistently reads back with the 1st datum's name). Referencing an *existing*
(already-in-the-source-file) datum works reliably, as does everything else here (dimensions, geometric
tolerances, datum-less or referencing existing datums) - only *authoring a new datum* is unsupported for
now; this module deliberately doesn't expose that operation rather than emit something that silently
corrupts on the next round trip.

**Edge/vertex references**: a characteristic can reference an edge or a vertex instead of (or, for a
dimension, alongside) a face - verified empirically to write and read back correctly through XCAF
(`dt.SetGeomTolerance`/`dt.SetDimension` take any TopoDS_Shape sub-label, not just faces). The one gap is
on the *read* side, pre-existing and outside this module: `pmi_xcaf.extract_xcaf`'s `_ref_face_ids` only
resolves face-typed references into `Characteristic.face_ids` (used for balloon anchoring), so an
edge/vertex-only characteristic round-trips with `face_ids: []` and gets placed by the same "unlinked"
fallback as PMI with no geometry link at all - correct data, just not anchored to it visually yet.

Empirically (verified against this module's own output, not just PmiBuilder's from-scratch case) the
picture on a *re-transferred, already-GDT-mode* document turns out simpler than PmiBuilder's docstring:
a geometric tolerance that has ANY datum reference is always written correctly and in full - native or
not - as the complex `( GEOMETRIC_TOLERANCE(...) GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE((...)) KEYWORD()
);` form, wrapper entity, datum system and all. Only the datum-*less* case still reproduces PmiBuilder's
"8 of 15 types silently drop their wrapper entity" quirk (verified: a datum-less native type like Flatness
writes fine as a plain `#n = FLATNESS_TOLERANCE(...)`; a datum-less type from `MISSING_TOLERANCE_KEYWORDS`
leaves only the `LENGTH_MEASURE_WITH_UNIT` + `SHAPE_ASPECT` + `GEOMETRIC_ITEM_SPECIFIC_USAGE` triple with no
wrapper at all). So the only patch needed here is injecting that missing wrapper for datum-less tolerances
of those 8 types - built from the document's current *complete* set of GeomTolerance labels (pre-existing +
newly added, since the whole document gets retransferred and rewritten from scratch, the quirk can resurface
on entities that were already fine in the source file) in `dt.GetGeomToleranceLabels()` order, which is
assumed to match the order OCCT emits same-type STEP entities in (same assumption PmiBuilder relies on).
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass
from pathlib import Path

from OCP.IFSelect import IFSelect_RetDone
from OCP.Interface import Interface_Static
from OCP.STEPCAFControl import STEPCAFControl_Writer
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller
from OCP.TColStd import TColStd_HArray1OfReal
from OCP.TCollection import TCollection_ExtendedString, TCollection_HAsciiString
from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_Label, TDF_LabelSequence
from OCP.TopoDS import TopoDS_Shape
from OCP.XCAFDimTolObjects import (
    XCAFDimTolObjects_DimensionObject,
    XCAFDimTolObjects_DimensionType,
    XCAFDimTolObjects_GeomToleranceObject,
    XCAFDimTolObjects_GeomToleranceType,
)
from OCP.XCAFDoc import XCAFDoc, XCAFDoc_Datum, XCAFDoc_Dimension, XCAFDoc_DocumentTool, XCAFDoc_GeomTolerance

from app.services.pmi_xcaf import _DIM_TYPE_LABELS, _TOL_TYPE_LABELS, _enum_suffix, _find_attr, _label_name
from app.services.step_loader import load_step
from app.services.step_text_utils import dewrap, next_entity_id, step_string
from app.services.tessellator import iter_edges, iter_faces, iter_vertices

RAD = math.radians

# type-suffix (XCAFDimTolObjects_GeomToleranceType_<suffix>) -> AP242 EXPRESS entity keyword, for the 8
# types that need the datum-less-tolerance patch below. Mirrors scripts/_pmi_helpers.py's
# MISSING_TOLERANCE_KEYWORDS table (kept separate/duplicated rather than shared, since that module is an
# offline sample-generation script, not a runtime dependency).
MISSING_TOLERANCE_KEYWORDS = {
    "Angularity": "ANGULARITY_TOLERANCE",
    "Perpendicularity": "PERPENDICULARITY_TOLERANCE",
    "Parallelism": "PARALLELISM_TOLERANCE",
    "Concentricity": "CONCENTRICITY_TOLERANCE",
    "Coaxiality": "COAXIALITY_TOLERANCE",
    "Symmetry": "SYMMETRY_TOLERANCE",
    "CircularRunout": "CIRCULAR_RUNOUT_TOLERANCE",
    "TotalRunout": "TOTAL_RUNOUT_TOLERANCE",
}

DIM_TYPE_BY_LABEL = {v: k for k, v in _DIM_TYPE_LABELS.items()}
TOL_TYPE_BY_LABEL = {v: k for k, v in _TOL_TYPE_LABELS.items()}

_STUB_RE = re.compile(
    r"#(\d+) = LENGTH_MEASURE_WITH_UNIT\(LENGTH_MEASURE\(([^)]+)\),#(\d+)\);\n"
    r"(?:#\d+ = \( LENGTH_UNIT\(\) NAMED_UNIT\(\*\) SI_UNIT\([^)]*\) \);\n)?"
    r"#(\d+) = SHAPE_ASPECT\('([^']*)','[^']*',#4,\.T\.\);\n"
    r"#(\d+) = GEOMETRIC_ITEM_SPECIFIC_USAGE\('[^']*','[^']*',#\4,#10,\s*#\d+\s*\);"
    # a resolved entity (native, or complex with datum refs) is immediately followed by either a bare
    # `#n = XXX_TOLERANCE(...)` or a complex `#n = ( GEOMETRIC_TOLERANCE(...) ... )`; only the true
    # "OCCT dropped the wrapper" case (missing type, no datum refs) has neither.
    r"(?!\s*\n#\d+ = (?:\(|\w*TOLERANCE\())"
)


class PmiWriteError(Exception):
    pass


@dataclass
class NewCharacteristic:
    """One new dimension or geometric tolerance to add.

    refs: 1-2 (kind, id) pairs, kind is "face", "edge" or "vertex", id is the tessellator's canonical
    face_id/edge_id/vertex_id (see app/services/tessellator.py's iter_faces / iter_edges / iter_vertices).
    A dimension uses refs[0] as its first reference and refs[1] (if present) as its second (e.g. a linear
    distance between two vertices, or a face and an edge); a geom_tolerance always uses only refs[0].
    """

    kind: str  # "dimension" | "geom_tolerance"
    type_label: str
    name: str
    refs: list[tuple[str, int]]
    nominal: float = 0.0
    lower: float = 0.0  # dimension: LSL - nominal (<=0); geom_tolerance: unused
    upper: float = 0.0  # dimension: USL - nominal (>=0); geom_tolerance: the zone value
    datum_refs: tuple[str, ...] = ()  # must already exist in the source file - see module docstring


@dataclass
class EditedCharacteristic(NewCharacteristic):
    """One *existing* characteristic to rewrite in place, addressed by `xcaf_index`.

    Same fields as NewCharacteristic (they replace what's currently on the label), plus:

    xcaf_index: the 1-based position of the characteristic's label in the source file's
    `GetDimensionLabels()` / `GetGeomToleranceLabels()` sequence - `Characteristic.xcaf_index`, recorded
    when the file was read (see app/services/pmi_xcaf.py). That sequence is child-label order within the
    document's DimTol label, which is stable across reads of the same file, so the ordinal recorded at
    ingest still addresses the same characteristic here.

    refs: unlike NewCharacteristic's, may be empty - meaning "keep the geometry references the
    characteristic already has", so a value/type/name-only edit needs no re-picking in the 3D view.
    """

    xcaf_index: int = 0


def _tol_type_enum(suffix: str):
    try:
        return getattr(XCAFDimTolObjects_GeomToleranceType, f"XCAFDimTolObjects_GeomToleranceType_{suffix}")
    except AttributeError as exc:
        raise PmiWriteError(f"unknown geometric tolerance type {suffix!r}") from exc


def _dim_type_enum(suffix: str):
    try:
        return getattr(XCAFDimTolObjects_DimensionType, f"XCAFDimTolObjects_DimensionType_{suffix}")
    except AttributeError as exc:
        raise PmiWriteError(f"unknown dimension type {suffix!r}") from exc


# Curated, ordered type labels worth offering in the Add-GD&T dropdown. This encodes the "is this a
# sensible thing to hand-author" judgement; `_DIM_TYPE_LABELS`/`_TOL_TYPE_LABELS` (the full set OCCT can
# *read*) also contain read-only markers like CommonLabel/DimensionPresentation and path/oriented
# variants that make no sense as an authoring choice. Each label here is still filtered through the enum
# resolver below, so anything that lacks a *writable* enum in this OCP build (e.g. Size_LinearDistance ->
# "Linear Size") is dropped rather than offered and then 422'd on submit.
_AUTHORABLE_DIM_LABELS = ("Diameter", "Radius", "Spherical Diameter", "Spherical Radius", "Linear Distance", "Angular", "Thickness")
_AUTHORABLE_TOL_LABELS = (
    "Flatness", "Straightness", "Circularity", "Cylindricity", "Profile of Line", "Profile of Surface",
    "Angularity", "Perpendicularity", "Parallelism", "Position", "Concentricity", "Coaxiality", "Symmetry",
    "Circular Runout", "Total Runout",
)


def _authorable(labels: tuple[str, ...], by_label: dict[str, str], resolve) -> list[str]:
    """Keep only the curated labels whose suffix resolves to a real (writable) OCCT enum member, in the
    curated order. Deriving the dropdown from this (rather than hardcoding it in the UI) keeps the two in
    lockstep and guarantees every offered type actually round-trips through pmi_writer.add_pmi."""
    out = []
    for label in labels:
        suffix = by_label.get(label)
        if suffix is None:
            continue
        try:
            resolve(suffix)
        except PmiWriteError:
            continue
        out.append(label)
    return out


def authorable_dimension_types() -> list[str]:
    return _authorable(_AUTHORABLE_DIM_LABELS, DIM_TYPE_BY_LABEL, _dim_type_enum)


def authorable_geom_tolerance_types() -> list[str]:
    return _authorable(_AUTHORABLE_TOL_LABELS, TOL_TYPE_BY_LABEL, _tol_type_enum)


def _sublabel(shape_tool, root: TDF_Label, shp) -> TDF_Label:
    lab = TDF_Label()
    if not shape_tool.Search(shp, lab, True, True, True) or lab.IsNull():
        lab = shape_tool.AddSubShape(root, shp)
    return lab


def _datum_name(dlabel: TDF_Label) -> str:
    attr = _find_attr(dlabel, XCAFDoc_Datum)
    if attr is not None:
        n = attr.GetObject().GetName()
        if n is not None and not n.IsEmpty():
            return n.ToCString()
    return _label_name(dlabel)


def _existing_datums(dt) -> dict[str, TDF_Label]:
    seq = TDF_LabelSequence()
    dt.GetDatumLabels(seq)
    out: dict[str, TDF_Label] = {}
    for i in range(1, seq.Length() + 1):
        lab = seq.Value(i)
        out[_datum_name(lab)] = lab
    return out


def _has_any_dimension(dt) -> bool:
    seq = TDF_LabelSequence()
    dt.GetDimensionLabels(seq)
    return seq.Length() > 0


@dataclass
class _Session:
    """One STEP file opened for authoring: the XCAF document plus the tools/root label every write step
    needs. Shared by add_pmi and edit_pmi so both go through exactly the same read -> mutate -> transfer
    -> text-patch pipeline."""

    loaded: object
    shape_tool: object
    dt: object
    root: TDF_Label


def _open(path: str) -> _Session:
    loaded = load_step(path, diagnose=False)
    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(loaded.doc.Main())
    dt = XCAFDoc_DocumentTool.DimTolTool_s(loaded.doc.Main())
    free = TDF_LabelSequence()
    shape_tool.GetFreeShapes(free)
    if free.Length() != 1:
        raise PmiWriteError("authoring PMI is only supported on single-part STEP files (this file has "
                             f"{free.Length()} top-level shapes)")
    session = _Session(loaded=loaded, shape_tool=shape_tool, dt=dt, root=free.Value(1))
    _repair_document(session, path)
    return session


def _resolve_refs(session: _Session, refs: list[tuple[str, int]]) -> list[TopoDS_Shape]:
    shape = session.loaded.shape
    shapes: dict[tuple[str, int], TopoDS_Shape] = {}
    shapes.update((("face", fid), f) for fid, f in iter_faces(shape))
    shapes.update((("edge", eid), e) for eid, e in iter_edges(shape))
    shapes.update((("vertex", vid), v) for vid, v in iter_vertices(shape))
    missing = [ref for ref in refs if ref not in shapes]
    if missing:
        raise PmiWriteError(f"{missing} not found on this model")
    return [shapes[ref] for ref in refs]


def _resolve_datums(session: _Session, datum_refs: tuple[str, ...]) -> list[TDF_Label]:
    datums = _existing_datums(session.dt)
    unresolved = [d for d in datum_refs if d not in datums]
    if unresolved:
        raise PmiWriteError(f"datum(s) {unresolved} not found on this model")
    return [datums[d] for d in datum_refs]


def _set_plus_minus(obj, value: float, lower: float, upper: float) -> None:
    """Nominal with signed deviations (`lower` <= 0 for a limit below the nominal), as OCCT wants them.

    OCCT keeps the lower deviation as a magnitude: its reader stores 0.02 for a file's -0.02 and its writer
    writes the negative of what is stored. So the lower deviation goes in negated. Passed signed, a -0.02
    limit was written as +0.02, which says the lower bound is above the upper one."""
    arr = TColStd_HArray1OfReal(1, 1)
    arr.SetValue(1, value)
    obj.SetValues(arr)
    obj.SetLowerTolValue(-lower)
    obj.SetUpperTolValue(upper)


def _repair_document(session: _Session, path: str) -> None:
    """Make the document say what the file says, before it is written back.

    The writer saves OCCT's document, and OCCT's reader loses two things that the app's own readers recover
    (pmi_extractor merges them in), so without this every write put the loss into the file:

    * a tolerance with datums of a type OCCT has no reader for (angularity, concentricity, coaxiality,
      circular run-out) arrives as a position tolerance, and was written back as one;
    * an angular dimension arrives in degrees, and the writer tags whatever it holds as radians: 90 deg
      became 90 rad, read back as 5156.6 deg.

    Each characteristic is matched to its label by `xcaf_index`, the same link editing uses."""
    from app.services import pmi_extractor       # here, not at the top: it imports the balloon placer

    chars, _datums, _source = pmi_extractor.extract_pmi(path, session.loaded)
    tols, dims = TDF_LabelSequence(), TDF_LabelSequence()
    session.dt.GetGeomToleranceLabels(tols)
    session.dt.GetDimensionLabels(dims)
    for c in chars:
        if not c.xcaf_index:
            continue
        if c.kind == "geom_tolerance" and c.xcaf_index <= tols.Length():
            attr = _find_attr(tols.Value(c.xcaf_index), XCAFDoc_GeomTolerance)
            suffix = TOL_TYPE_BY_LABEL.get(c.type_label)
            if attr is None or suffix is None:
                continue
            obj = attr.GetObject()
            if _enum_suffix(obj.GetType(), "GeomToleranceType_") != suffix:
                try:
                    obj.SetType(_tol_type_enum(suffix))
                except PmiWriteError:
                    continue
                attr.SetObject(obj)
        elif c.kind == "dimension" and c.xcaf_index <= dims.Length() and c.nominal is not None:
            attr = _find_attr(dims.Value(c.xcaf_index), XCAFDoc_Dimension)
            if attr is None:
                continue
            obj = attr.GetObject()
            if "Angular" not in _enum_suffix(obj.GetType(), "DimensionType_"):
                continue
            to_rad = (lambda v: float(v)) if c.unit == "rad" else RAD
            nominal = to_rad(c.nominal)
            if obj.IsDimWithRange():
                if c.lsl is None or c.usl is None:
                    continue
                obj.SetLowerBound(to_rad(c.lsl))
                obj.SetUpperBound(to_rad(c.usl))
            elif c.lsl is not None and c.usl is not None and (c.lsl != c.nominal or c.usl != c.nominal):
                _set_plus_minus(obj, nominal, to_rad(c.lsl) - nominal, to_rad(c.usl) - nominal)
            else:
                arr = TColStd_HArray1OfReal(1, 1)
                arr.SetValue(1, nominal)
                obj.SetValues(arr)
            attr.SetObject(obj)


def _write_dimension(session: _Session, label: TDF_Label, spec: NewCharacteristic, resolved: list[TopoDS_Shape] | None) -> None:
    """Set every authorable property of the dimension on `label` (fresh or pre-existing) from `spec`.
    `resolved` of None leaves the label's current geometry references alone (edit-without-repicking)."""
    suffix = DIM_TYPE_BY_LABEL.get(spec.type_label)
    if suffix is None:
        raise PmiWriteError(f"unknown dimension type {spec.type_label!r}")
    angular = "Angular" in suffix
    if resolved is not None:
        # SetDimension *replaces* the label's reference sequences rather than appending to them
        # (verified empirically against a pre-existing dimension), so re-pointing an edited
        # characteristic at different geometry needs no explicit clear-out first.
        seq1, seq2 = TDF_LabelSequence(), TDF_LabelSequence()
        seq1.Append(_sublabel(session.shape_tool, session.root, resolved[0]))
        if len(resolved) > 1:
            seq2.Append(_sublabel(session.shape_tool, session.root, resolved[1]))
        session.dt.SetDimension(seq1, seq2, label)
    attr = _find_attr(label, XCAFDoc_Dimension)
    obj = attr.GetObject() if attr is not None else XCAFDimTolObjects_DimensionObject()
    obj.SetType(_dim_type_enum(suffix))
    # OCCT's writer tags an angular dimension's values as radians without converting them, so all three go
    # in as radians. Writing the deviations in degrees gave a file that says 90 deg +/- 0.5 rad.
    value, lower, upper = (RAD(v) for v in (spec.nominal, spec.lower, spec.upper)) if angular \
        else (spec.nominal, spec.lower, spec.upper)
    _set_plus_minus(obj, value, lower, upper)
    if obj.IsDimWithRange():
        # A dimension already carrying an explicit range is read back from its bounds, not its +/- values
        # (see pmi_xcaf.extract_xcaf), and XCAFDimTolObjects_DimensionObject has no way to un-set the
        # range - so keep both representations in step, or an edited limit would silently not take.
        obj.SetLowerBound(value + lower)
        obj.SetUpperBound(value + upper)
    obj.SetSemanticName(TCollection_HAsciiString(spec.name))
    (attr if attr is not None else XCAFDoc_Dimension.Set_s(label)).SetObject(obj)
    TDataStd_Name.Set_s(label, TCollection_ExtendedString(spec.name))


def _write_geom_tolerance(session: _Session, label: TDF_Label, spec: NewCharacteristic,
                          resolved: list[TopoDS_Shape] | None, datum_labels: list[TDF_Label]) -> None:
    """As _write_dimension, for a geometric tolerance. The datum system is always set from `spec`
    (an empty datum_refs really does mean "datum-less"), never merged with what's already there."""
    if not _has_any_dimension(session.dt):
        raise PmiWriteError("this model has no dimensions yet - add at least one dimension before a "
                             "geometric tolerance (XCAFDoc_GeomTolerance values round-trip through "
                             "STEP 1000x too large otherwise)")
    suffix = TOL_TYPE_BY_LABEL.get(spec.type_label)
    if suffix is None:
        raise PmiWriteError(f"unknown geometric tolerance type {spec.type_label!r}")
    if resolved is not None:
        seq = TDF_LabelSequence()
        seq.Append(_sublabel(session.shape_tool, session.root, resolved[0]))
        session.dt.SetGeomTolerance(seq, label)
    # Drop the tolerance's existing datum system before relinking. XCAFDoc_DimTolTool has no
    # "unset datum" call, so this forgets the tolerance-side half of the datum<->tolerance graph node
    # (a no-op on a freshly added label). The datum-side halves are left pointing at the forgotten node,
    # which is harmless: everything downstream - GetDatumOfTolerLabels_s, and STEPCAFControl_Writer
    # itself - walks the graph from the tolerance, and each edit starts from a fresh read of the file,
    # so nothing accumulates. Verified empirically: re-datum'ing one tolerance rewrites exactly that
    # tolerance's datum references and leaves every other tolerance's intact.
    label.ForgetAttribute(XCAFDoc.DatumTolRefGUID_s())
    for dlabel in datum_labels:
        session.dt.SetDatumToGeomTol(dlabel, label)
    attr = _find_attr(label, XCAFDoc_GeomTolerance)
    obj = attr.GetObject() if attr is not None else XCAFDimTolObjects_GeomToleranceObject()
    obj.SetType(_tol_type_enum(suffix))
    obj.SetValue(spec.upper)
    # STEPCAFControl_Writer mangles a GeomTolerance's semantic name unpredictably (verified
    # empirically: it drops a leading chunk of the text whose length isn't consistently "first word" -
    # e.g. varies with what else is already in the document). This is a pre-existing characteristic of
    # this app's PMI authoring, not something introduced here: the same mangling already affects
    # dimension/tolerance names written by scripts/_pmi_helpers.py's PmiBuilder, which is exactly why
    # pmi_extractor._default_feature_name() exists as a fallback - feature_name here is only ever a
    # best-effort label, never guaranteed to survive the STEP round trip verbatim.
    obj.SetSemanticName(TCollection_HAsciiString(spec.name))
    (attr if attr is not None else XCAFDoc_GeomTolerance.Set_s(label)).SetObject(obj)
    TDataStd_Name.Set_s(label, TCollection_ExtendedString(spec.name))


def _write_step(session: _Session, out_path: Path) -> bytes:
    STEPControl_Controller.Init_s()
    Interface_Static.SetCVal_s("write.step.schema", "AP242DIS")
    Interface_Static.SetCVal_s("write.step.product.name", session.loaded.part_name)
    w = STEPCAFControl_Writer()
    w.SetDimTolMode(True)
    w.SetNameMode(True)
    w.SetColorMode(True)
    if not w.Transfer(session.loaded.doc, STEPControl_AsIs):
        raise PmiWriteError("XCAF -> STEP transfer failed")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    status = w.Write(str(out_path))
    if status != IFSelect_RetDone:
        # "Error" here means the file was written, but with entities OCCT could not complete: PMI that is in
        # the source file and that its writer cannot put back (10 of the 16 NIST parts with PMI).
        out_path.unlink(missing_ok=True)
        raise PmiWriteError("OpenCASCADE cannot write this file's existing PMI back completely "
                            f"({str(status).rsplit('_', 1)[-1]}), so the change was not saved: saving it would "
                            "damage PMI that is already in the file.")

    text = dewrap(out_path.read_text())
    text = _patch_tolerances(text, session.dt)
    out_path.write_text(text)
    return text.encode()


def add_pmi(path: str, spec: NewCharacteristic, out_path: Path) -> bytes:
    """Read the STEP file at `path`, add one new characteristic, write the result to `out_path`, and
    return its bytes."""
    session = _open(path)
    resolved = _resolve_refs(session, spec.refs)
    datum_labels = _resolve_datums(session, spec.datum_refs)

    if spec.kind == "dimension":
        _write_dimension(session, session.dt.AddDimension(), spec, resolved)
    elif spec.kind == "geom_tolerance":
        _write_geom_tolerance(session, session.dt.AddGeomTolerance(), spec, resolved, datum_labels)
    else:
        raise PmiWriteError(f"unknown kind {spec.kind!r}")

    return _write_step(session, out_path)


def _label_at(dt, kind: str, xcaf_index: int) -> TDF_Label:
    seq = TDF_LabelSequence()
    if kind == "dimension":
        dt.GetDimensionLabels(seq)
    elif kind == "geom_tolerance":
        dt.GetGeomToleranceLabels(seq)
    else:
        raise PmiWriteError(f"unknown kind {kind!r}")
    if not 1 <= xcaf_index <= seq.Length():
        raise PmiWriteError(f"characteristic no longer present in this model's STEP file (expected {kind} "
                             f"#{xcaf_index} of {seq.Length()}) - reload the model and try again")
    return seq.Value(xcaf_index)


def edit_pmi(path: str, spec: EditedCharacteristic, out_path: Path) -> bytes:
    """Read the STEP file at `path`, rewrite the characteristic `spec` addresses in place, write the
    result to `out_path`, and return its bytes.

    An edit can change the type (within the same kind - a dimension stays a dimension), the nominal and
    limits / tolerance zone, the feature name, the datum system, and the referenced geometry. Everything
    else in the file - all other PMI, datums, names, colours - survives untouched, same as add_pmi.
    """
    session = _open(path)
    label = _label_at(session.dt, spec.kind, spec.xcaf_index)
    resolved = _resolve_refs(session, spec.refs) if spec.refs else None
    datum_labels = _resolve_datums(session, spec.datum_refs)

    if spec.kind == "dimension":
        _write_dimension(session, label, spec, resolved)
    else:
        _write_geom_tolerance(session, label, spec, resolved, datum_labels)

    return _write_step(session, out_path)


# -------------------------------------------------------------- post-write text patch


def _datumless_missing_type_suffixes(dt) -> list[str]:
    """type_suffix of every current GeomTolerance label (pre-existing + just-added) that is one of the 8
    quirky types AND has no datum reference - the only case that needs the wrapper-entity patch below - in
    `dt.GetGeomToleranceLabels()` order."""
    seq = TDF_LabelSequence()
    dt.GetGeomToleranceLabels(seq)
    out: list[str] = []
    for i in range(1, seq.Length() + 1):
        lab = seq.Value(i)
        attr = _find_attr(lab, XCAFDoc_GeomTolerance)
        if attr is None:
            continue
        type_suffix = _enum_suffix(attr.GetObject().GetType(), "GeomToleranceType_")
        if type_suffix not in MISSING_TOLERANCE_KEYWORDS:
            continue
        dseq = TDF_LabelSequence()
        dt.GetDatumOfTolerLabels_s(lab, dseq)
        if dseq.Length() == 0:
            out.append(type_suffix)
    return out


def _patch_tolerances(text: str, dt) -> str:
    """Inject the wrapper entity OCCT's writer drops for datum-less tolerances of the 8 quirky types. See
    module docstring - every other case (datum-bearing, of any type; native-type + datum-less) is already
    written correctly by STEPCAFControl_Writer and needs no patching."""
    missing = _datumless_missing_type_suffixes(dt)
    if not missing:
        return text

    stubs = _STUB_RE.findall(text)
    if len(stubs) != len(missing):
        raise PmiWriteError(f"expected {len(missing)} unresolved tolerance stub(s), found {len(stubs)} - "
                             "OCCT's writer behaviour may have changed; re-check MISSING_TOLERANCE_KEYWORDS")
    nxt = next_entity_id(text)
    injected: list[str] = []
    for type_suffix, (measure_id, _value, _unit_id, aspect_id, aspect_name, _usage_id) in zip(missing, stubs):
        eid, nxt = nxt, nxt + 1
        keyword = MISSING_TOLERANCE_KEYWORDS[type_suffix]
        # These 8 EXPRESS types are pure leaf subtypes of GEOMETRIC_TOLERANCE with no own attributes (that's
        # *why* OCCT's writer drops them when datum-less: its no-datum code path only knows how to write a
        # standalone/native entity, and these types aren't one). A flat `#n = KEYWORD(name,descr,measure,
        # aspect);` is invalid AP242 (giving args to a type with none) and silently fails to round-trip back
        # through STEPCAFControl_Reader - verified empirically. The valid form is the same complex-instance
        # record OCCT itself emits for a *datum-bearing* tolerance of one of these types, just without the
        # GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE member.
        injected.append(
            f"#{eid} = ( GEOMETRIC_TOLERANCE({step_string(aspect_name)},'',#{measure_id},#{aspect_id}) {keyword}() );\n"
        )
    text = text.replace("ENDSEC;\nEND-ISO-10303-21;", "".join(injected) + "ENDSEC;\nEND-ISO-10303-21;")
    return text
