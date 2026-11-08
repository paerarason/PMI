"""Semantic PMI extraction through OCCT's XCAF DimTol tool (AP242 files with geometry-linked PMI)."""
from __future__ import annotations

import logging

from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_AttributeIterator, TDF_Label, TDF_LabelSequence
from OCP.TopAbs import TopAbs_FACE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS_Shape
from OCP.XCAFDoc import XCAFDoc_Datum, XCAFDoc_Dimension, XCAFDoc_DocumentTool, XCAFDoc_GeomTolerance

from app.services.pmi_types import Characteristic, Datum

log = logging.getLogger("quality.pmi.xcaf")

_DIM_TYPE_LABELS = {
    "Size_Diameter": "Diameter",
    "Size_Radius": "Radius",
    "Size_SphericalDiameter": "Spherical Diameter",
    "Size_SphericalRadius": "Spherical Radius",
    "Size_LinearDistance": "Linear Size",
    "Size_CurveLength": "Curve Length",
    "Size_Angular": "Angular",
    "Size_Thickness": "Thickness",
    "Size_WithPath": "Size With Path",
    "Location_LinearDistance": "Linear Distance",
    "Location_CurvedDistance": "Curved Distance",
    "Location_Angular": "Angular Location",
    "Location_Oriented": "Oriented Location",
    "Location_WithPath": "Location With Path",
    "CommonLabel": "Common Label",
    "DimensionPresentation": "Presentation",
}
_TOL_TYPE_LABELS = {
    "Flatness": "Flatness",
    "Straightness": "Straightness",
    "CircularityOrRoundness": "Circularity",
    "Cylindricity": "Cylindricity",
    "Coaxiality": "Coaxiality",
    "ProfileOfLine": "Profile of Line",
    "ProfileOfSurface": "Profile of Surface",
    "Angularity": "Angularity",
    "Perpendicularity": "Perpendicularity",
    "Parallelism": "Parallelism",
    "Position": "Position",
    "Concentricity": "Concentricity",
    "Symmetry": "Symmetry",
    "CircularRunout": "Circular Runout",
    "TotalRunout": "Total Runout",
}


def _enum_suffix(value, prefix: str) -> str:
    name = getattr(value, "name", str(value))
    return name.split(prefix, 1)[-1] if prefix in name else name


def _find_attr(label: TDF_Label, cls):
    it = TDF_AttributeIterator(label)
    while it.More():
        a = it.Value()
        if isinstance(a, cls):
            return a
        it.Next()
    return None


def _label_name(label: TDF_Label) -> str:
    name = _find_attr(label, TDataStd_Name)
    if name is None:
        return ""
    return name.Get().ToExtString() if hasattr(name.Get(), "ToExtString") else str(name.Get())


def _face_index(shape: TopoDS_Shape) -> dict:
    """Map TShape -> canonical face id (TopExp order, same as tessellator)."""
    out = {}
    exp = TopExp_Explorer(shape, TopAbs_FACE)
    i = 0
    while exp.More():
        out.setdefault(exp.Current().TShape(), i)
        i += 1
        exp.Next()
    return out


def _ref_face_ids(shape_tool, dimtol_tool, label: TDF_Label, face_index: dict) -> list[int]:
    first, second = TDF_LabelSequence(), TDF_LabelSequence()
    dimtol_tool.GetRefShapeLabel_s(label, first, second)
    ids: list[int] = []
    for seq in (first, second):
        for i in range(1, seq.Length() + 1):
            sub = shape_tool.GetShape_s(seq.Value(i))
            if sub.IsNull():
                continue
            if sub.ShapeType() == TopAbs_FACE:
                fid = face_index.get(sub.TShape())
                if fid is not None and fid not in ids:
                    ids.append(fid)
            else:
                exp = TopExp_Explorer(sub, TopAbs_FACE)
                while exp.More():
                    fid = face_index.get(exp.Current().TShape())
                    if fid is not None and fid not in ids:
                        ids.append(fid)
                    exp.Next()
    return ids


def _semantic_name(obj) -> str:
    try:
        n = obj.GetSemanticName()
        if n is not None and not n.IsEmpty():
            return n.ToCString()
    except Exception:  # noqa: BLE001
        pass
    return ""


def extract_xcaf(doc, shape: TopoDS_Shape) -> tuple[list[Characteristic], list[Datum]]:
    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    dt = XCAFDoc_DocumentTool.DimTolTool_s(doc.Main())
    face_index = _face_index(shape)

    datums: list[Datum] = []
    datum_by_label_tag: dict[str, str] = {}

    def datum_name(dlabel: TDF_Label) -> str:
        attr = _find_attr(dlabel, XCAFDoc_Datum)
        if attr is None:
            return ""
        obj = attr.GetObject()
        n = obj.GetName()
        return n.ToCString() if n is not None and not n.IsEmpty() else _label_name(dlabel)

    def register_datum(dlabel: TDF_Label) -> str:
        key = dlabel.EntryDumpToString() if hasattr(dlabel, "EntryDumpToString") else str(dlabel.Tag())
        if key in datum_by_label_tag:
            return datum_by_label_tag[key]
        name = datum_name(dlabel) or chr(ord("A") + len(datums))
        if not any(d.label == name for d in datums):
            datums.append(Datum(label=name, face_ids=_ref_face_ids(shape_tool, dt, dlabel, face_index), source="xcaf"))
        datum_by_label_tag[key] = name
        return name

    seq = TDF_LabelSequence()
    dt.GetDatumLabels(seq)
    for i in range(1, seq.Length() + 1):
        register_datum(seq.Value(i))

    chars: list[Characteristic] = []

    seq = TDF_LabelSequence()
    dt.GetDimensionLabels(seq)
    for i in range(1, seq.Length() + 1):
        lab = seq.Value(i)
        attr = _find_attr(lab, XCAFDoc_Dimension)
        if attr is None:
            continue
        obj = attr.GetObject()
        type_key = _enum_suffix(obj.GetType(), "DimensionType_")
        type_label = _DIM_TYPE_LABELS.get(type_key, type_key)
        if type_key in ("CommonLabel", "DimensionPresentation"):
            continue
        try:
            nominal = float(obj.GetValue())
        except Exception:  # noqa: BLE001
            continue
        lower = abs(float(obj.GetLowerTolValue()))
        upper = abs(float(obj.GetUpperTolValue()))
        has_tol = obj.IsDimWithTolerance() if hasattr(obj, "IsDimWithTolerance") else (lower or upper)
        usl = nominal + upper if has_tol else None
        lsl = nominal - lower if has_tol else None
        if obj.IsDimWithRange():
            lsl, usl = float(obj.GetLowerBound()), float(obj.GetUpperBound())
        name = _label_name(lab) or _semantic_name(obj)
        if name.lower() in ("diameter", "linear distance", "radius", "linear size", ""):
            name = ""
        unit = "deg" if "Angular" in type_key else "mm"
        chars.append(
            Characteristic(
                kind="dimension",
                feature_name=name,
                type_label=type_label,
                nominal=nominal,
                usl=usl,
                lsl=lsl,
                unit=unit,
                face_ids=_ref_face_ids(shape_tool, dt, lab, face_index),
                source="xcaf",
                xcaf_index=i,
            )
        )

    seq = TDF_LabelSequence()
    dt.GetGeomToleranceLabels(seq)
    for i in range(1, seq.Length() + 1):
        lab = seq.Value(i)
        attr = _find_attr(lab, XCAFDoc_GeomTolerance)
        if attr is None:
            continue
        obj = attr.GetObject()
        type_key = _enum_suffix(obj.GetType(), "GeomToleranceType_")
        type_label = _TOL_TYPE_LABELS.get(type_key, type_key)
        value = float(obj.GetValue())
        refs: list[str] = []
        dseq = TDF_LabelSequence()
        dt.GetDatumOfTolerLabels_s(lab, dseq)
        for j in range(1, dseq.Length() + 1):
            ref = register_datum(dseq.Value(j))
            if ref not in refs:  # XCAF can list a datum once per datum-system entry (NIST CTC-02: A,A,A,B,...)
                refs.append(ref)
        modifiers: list[str] = []
        try:
            mm = _enum_suffix(obj.GetMaterialRequirementModifier(), "MaterialRequirementModif_")
            if mm in ("M", "L"):
                modifiers.append(mm)
        except Exception:  # noqa: BLE001
            pass
        name = _label_name(lab) or _semantic_name(obj)
        if name.lower() == type_label.lower():
            name = ""
        chars.append(
            Characteristic(
                kind="geom_tolerance",
                feature_name=name,
                type_label=type_label,
                nominal=0.0,
                usl=value,
                lsl=0.0,
                unit="mm",
                datum_refs=refs,
                modifiers=modifiers,
                face_ids=_ref_face_ids(shape_tool, dt, lab, face_index),
                source="xcaf",
                xcaf_index=i,
            )
        )

    log.info("XCAF PMI: %d characteristics, %d datums", len(chars), len(datums))
    return chars, datums
