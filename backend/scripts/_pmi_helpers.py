"""Shared helper for writing AP242 STEP files with geometry-linked XCAF PMI (dimensions,
geometric tolerances, datums). Used by the scripts/make_sample_*.py generators.

Angular dimension values/tolerances must be passed in RADIANS to SetValues/SetLowerTolValue/
SetUpperTolValue - OCP's XCAFDoc_Dimension.GetValue() always returns the stored value * 180/pi,
i.e. it always reports degrees on read regardless of what was intended on write. This was
verified empirically: passing math.radians(30) round-trips to GetValue() == 30.0 (degrees);
passing 30 directly round-trips to 1718.87 (30 treated as radians, converted to degrees).

OCP/OCCT 7.9's STEPCAFControl_Writer only natively writes 7 of the 15 GD&T tolerance types
(Flatness, Straightness, Circularity, Cylindricity, ProfileOfLine, ProfileOfSurface, Position -
see NATIVE_TOLERANCE_KEYWORDS). For the other 8 (Angularity, Perpendicularity, Parallelism,
Concentricity, Coaxiality, Symmetry, CircularRunout, TotalRunout) it still correctly writes the
SHAPE_ASPECT + GEOMETRIC_ITEM_SPECIFIC_USAGE (face link) + LENGTH_MEASURE_WITH_UNIT (value) for
each call, in call order, but omits the wrapping `*_TOLERANCE(...)` entity entirely - verified
empirically by writing all 15 types and diffing the Part-21 output. PmiBuilder.write() patches
these back in as a post-process text pass (see _patch_tolerances), reusing the ids OCCT
already assigned. Native Position also silently drops its datum references on write even though
the POSITION_TOLERANCE entity itself is written - that gets the same datum-reference patch.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from pathlib import Path

from OCP.IFSelect import IFSelect_RetDone
from OCP.Interface import Interface_Static
from OCP.STEPCAFControl import STEPCAFControl_Writer
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller
from OCP.TColStd import TColStd_HArray1OfReal
from OCP.TCollection import TCollection_ExtendedString, TCollection_HAsciiString
from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_Label, TDF_LabelSequence
from OCP.TDocStd import TDocStd_Document
from OCP.TopoDS import TopoDS_Shape
from OCP.XCAFDoc import XCAFDoc_Datum, XCAFDoc_Dimension, XCAFDoc_DocumentTool, XCAFDoc_GeomTolerance
from OCP.XCAFDimTolObjects import XCAFDimTolObjects_DatumObject, XCAFDimTolObjects_DimensionObject, XCAFDimTolObjects_GeomToleranceObject

RAD = math.radians

# type-name suffix (as in XCAFDimTolObjects_GeomToleranceType_<suffix>) -> AP242 EXPRESS entity keyword
NATIVE_TOLERANCE_KEYWORDS = {
    "Flatness": "FLATNESS_TOLERANCE",
    "Straightness": "STRAIGHTNESS_TOLERANCE",
    "CircularityOrRoundness": "ROUNDNESS_TOLERANCE",
    "Cylindricity": "CYLINDRICITY_TOLERANCE",
    "ProfileOfLine": "LINE_PROFILE_TOLERANCE",
    "ProfileOfSurface": "SURFACE_PROFILE_TOLERANCE",
    "Position": "POSITION_TOLERANCE",
}
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

_STUB_RE = re.compile(
    r"#(\d+) = LENGTH_MEASURE_WITH_UNIT\(LENGTH_MEASURE\(([^)]+)\),#(\d+)\);\n"
    r"(?:#\d+ = \( LENGTH_UNIT\(\) NAMED_UNIT\(\*\) SI_UNIT\([^)]*\) \);\n)?"  # unit def, reused (omitted) if identical to an earlier one
    r"#(\d+) = SHAPE_ASPECT\('[^']*','[^']*',#4,\.T\.\);\n"
    r"#(\d+) = GEOMETRIC_ITEM_SPECIFIC_USAGE\('[^']*','[^']*',#\4,#10,\s*#\d+\s*\);"
    r"(?!\s*\n#\d+ = \w*TOLERANCE\()"  # a "native" stub is immediately followed by its *_TOLERANCE entity; skip those
)
_NATIVE_ENTITY_RE = {
    kw: re.compile(rf"^#(\d+) = {kw}\('[^']*','[^']*',\s*#\d+,\s*#(\d+)\s*\);", re.M) for kw in NATIVE_TOLERANCE_KEYWORDS.values()
}
_DATUM_RE = re.compile(r"^#(\d+) = DATUM\('[^']*','[^']*',#4,\.[TF]\.,'([^']+)'\);", re.M)


from app.services.step_text_utils import dewrap as _dewrap  # noqa: E402


@dataclass
class _TolCall:
    name: str
    type_suffix: str
    value: float
    datum_labels: tuple[str, ...]
    entity_id: str = field(default="", init=False)


class PmiBuilder:
    def __init__(self, shape: TopoDS_Shape, product_name: str):
        self.doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
        XCAFDoc_DocumentTool.SetLengthUnit_s(self.doc, 0.001)  # declare mm; see _has_dimension guard below
        self.shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(self.doc.Main())
        self.dt = XCAFDoc_DocumentTool.DimTolTool_s(self.doc.Main())
        self.root = self.shape_tool.AddShape(shape, False)
        TDataStd_Name.Set_s(self.root, TCollection_ExtendedString(product_name))
        self._datums: dict[str, TDF_Label] = {}
        self._tol_calls: list[_TolCall] = []
        self._has_dimension = False

    def sublabel(self, shp) -> TDF_Label:
        lab = TDF_Label()
        if not self.shape_tool.Search(shp, lab, True, True, True) or lab.IsNull():
            lab = self.shape_tool.AddSubShape(self.root, shp)
        return lab

    def add_dim(self, name: str, dtype, value: float, lower: float, upper: float, first, second=(), angular: bool = False):
        """first/second: iterables of TopoDS_Face/Edge.

        `lower`/`upper` are signed deviations from `value` (lower <= 0 for a limit below the nominal).

        angular=True: all three are given in degrees and stored in radians, because OCCT's writer tags an
        angular dimension's values as radians without converting them. Storing the deviations in degrees
        wrote a file that says 90 deg +/- 0.5 rad.

        The lower deviation is stored negated: OCCT keeps it as a magnitude and writes its negative, so a
        signed -0.02 came out in the file as +0.02 (a lower bound above the upper one).
        app/services/pmi_writer.py's `_set_plus_minus` does the same; keep the two in step.
        """
        seq1, seq2 = TDF_LabelSequence(), TDF_LabelSequence()
        for f in first:
            seq1.Append(self.sublabel(f))
        for f in second:
            seq2.Append(self.sublabel(f))
        dl = self.dt.AddDimension()
        self.dt.SetDimension(seq1, seq2, dl)
        obj = XCAFDimTolObjects_DimensionObject()
        obj.SetType(dtype)
        v, lower, upper = (RAD(value), RAD(lower), RAD(upper)) if angular else (value, lower, upper)
        arr = TColStd_HArray1OfReal(1, 1)
        arr.SetValue(1, v)
        obj.SetValues(arr)
        obj.SetLowerTolValue(-lower)
        obj.SetUpperTolValue(upper)
        obj.SetSemanticName(TCollection_HAsciiString(name))
        XCAFDoc_Dimension.Set_s(dl).SetObject(obj)
        TDataStd_Name.Set_s(dl, TCollection_ExtendedString(name))
        self._has_dimension = True
        return dl

    def add_datum(self, label: str, face) -> TDF_Label:
        dl = self.dt.AddDatum()
        seq = TDF_LabelSequence()
        seq.Append(self.sublabel(face))
        self.dt.SetDatum(seq, dl)
        obj = XCAFDimTolObjects_DatumObject()
        obj.SetName(TCollection_HAsciiString(label))
        XCAFDoc_Datum.Set_s(dl).SetObject(obj)
        TDataStd_Name.Set_s(dl, TCollection_ExtendedString(label))
        self._datums[label] = dl
        return dl

    def add_tol(self, name: str, ttype, value: float, face, datums: tuple[str, ...] = ()):
        tl = self.dt.AddGeomTolerance()
        seq = TDF_LabelSequence()
        seq.Append(self.sublabel(face))
        self.dt.SetGeomTolerance(seq, tl)
        for label in datums:
            self.dt.SetDatumToGeomTol(self._datums[label], tl)
        obj = XCAFDimTolObjects_GeomToleranceObject()
        obj.SetType(ttype)
        obj.SetValue(value)
        obj.SetSemanticName(TCollection_HAsciiString(name))
        XCAFDoc_GeomTolerance.Set_s(tl).SetObject(obj)
        TDataStd_Name.Set_s(tl, TCollection_ExtendedString(name))
        suffix = getattr(ttype, "name", str(ttype)).rsplit("GeomToleranceType_", 1)[-1]
        self._tol_calls.append(_TolCall(name, suffix, value, datums))
        return tl

    def write(self, path: Path, product_name: str | None = None) -> None:
        if self._tol_calls and not self._has_dimension:
            # Verified empirically: XCAFDoc_GeomTolerance values round-trip through STEP 1000x too large
            # (0.1 -> 100.0) unless the document also contains at least one XCAFDoc_Dimension - SetLengthUnit_s
            # alone does not fix it. Every real part has dimensions anyway; call add_dim() before add_tol().
            raise RuntimeError("add_tol() was called with no prior add_dim() call - tolerance values would "
                                "round-trip 1000x too large through STEP. Add at least one dimension first.")
        STEPControl_Controller.Init_s()
        Interface_Static.SetCVal_s("write.step.schema", "AP242DIS")
        Interface_Static.SetCVal_s("write.step.product.name", product_name or "")
        w = STEPCAFControl_Writer()
        w.SetDimTolMode(True)
        w.SetNameMode(True)
        if not w.Transfer(self.doc, STEPControl_AsIs):
            raise RuntimeError("XCAF -> STEP transfer failed")
        path.parent.mkdir(parents=True, exist_ok=True)
        status = w.Write(str(path))
        if status != IFSelect_RetDone:
            raise RuntimeError(f"STEP write failed: {status}")
        text = _dewrap(path.read_text())
        text = self._patch_tolerances(text)
        path.write_text(text)
        n_missing = sum(1 for c in self._tol_calls if c.type_suffix in MISSING_TOLERANCE_KEYWORDS)
        n_datum = sum(1 for c in self._tol_calls if c.datum_labels)
        print(f"wrote {path} (patched {n_missing} missing-entity, {n_datum} datum-ref tolerances)")

    # -------------------------------------------------------------- post-write text patch

    def _next_id(self, text: str) -> int:
        return max(int(m) for m in re.findall(r"^#(\d+)\s*=", text, re.M)) + 1

    def _patch_tolerances(self, text: str) -> str:
        """Single coordinated pass: assign each add_tol() call its actual STEP entity id (whether OCCT
        wrote it natively or only a stub), inject missing entities, then wrap datum-referenced ones."""
        if not self._tol_calls:
            return text

        # 1. native calls: map (type_suffix -> [entity_id in file order]), zipped with same-suffix calls
        #    in call order (OCCT preserves call order in its output - verified empirically).
        by_suffix: dict[str, list[_TolCall]] = {}
        for c in self._tol_calls:
            by_suffix.setdefault(c.type_suffix, []).append(c)
        for suffix, keyword in NATIVE_TOLERANCE_KEYWORDS.items():
            calls = by_suffix.get(suffix, [])
            matches = list(_NATIVE_ENTITY_RE[keyword].finditer(text))
            if len(matches) != len(calls):
                raise RuntimeError(f"expected {len(calls)} native {keyword} entit(y/ies), found {len(matches)} - "
                                    "OCCT's writer behaviour may have changed; re-check NATIVE_TOLERANCE_KEYWORDS")
            for call, m in zip(calls, matches):
                call.entity_id = m.group(1)

        # 2. missing-entity calls: consume the unresolved stub triples in file order, inject the wrapping entity
        missing_calls = [c for c in self._tol_calls if c.type_suffix in MISSING_TOLERANCE_KEYWORDS]
        stubs = _STUB_RE.findall(text)
        if len(stubs) != len(missing_calls):
            raise RuntimeError(f"expected {len(missing_calls)} unresolved tolerance stub(s), found {len(stubs)} - "
                                "OCCT's writer behaviour may have changed; re-check MISSING_TOLERANCE_KEYWORDS")
        nxt = self._next_id(text)
        injected: list[str] = []
        for call, (measure_id, _value, _unit_id, aspect_id, _usage_id) in zip(missing_calls, stubs):
            eid, nxt = nxt, nxt + 1
            keyword = MISSING_TOLERANCE_KEYWORDS[call.type_suffix]
            injected.append(f"#{eid} = {keyword}('{call.name}','',#{measure_id},#{aspect_id});\n")
            call.entity_id = str(eid)
        if injected:
            text = text.replace("ENDSEC;\nEND-ISO-10303-21;", "".join(injected) + "ENDSEC;\nEND-ISO-10303-21;")

        # 3. datum-referenced calls: rewrite their (now-known) entity as a complex entity carrying
        #    GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE, building/reusing DATUM_SYSTEM chains per label set.
        datum_ids = {label: eid for eid, label in _DATUM_RE.findall(text)}
        needed = {lbl for c in self._tol_calls for lbl in c.datum_labels}
        missing_datums = needed - datum_ids.keys()
        if missing_datums:
            raise RuntimeError(f"datum(s) {missing_datums} referenced by a tolerance but not found as DATUM(...) entities")
        additions: list[str] = []
        system_cache: dict[tuple[str, ...], int] = {}

        def datum_system_id(labels: tuple[str, ...]) -> int:
            nonlocal nxt
            if labels in system_cache:
                return system_cache[labels]
            compartments = []
            for lbl in labels:
                cid, nxt = nxt, nxt + 1
                additions.append(f"#{cid} = DATUM_REFERENCE_COMPARTMENT('{lbl}',$,#4,.T.,#{datum_ids[lbl]},$);\n")
                compartments.append(cid)
            sid, nxt = nxt, nxt + 1
            refs = ",".join(f"#{c}" for c in compartments)
            additions.append(f"#{sid} = DATUM_SYSTEM('{'|'.join(labels)}',$,#4,.T.,({refs}));\n")
            system_cache[labels] = sid
            return sid

        for call in self._tol_calls:
            if not call.datum_labels:
                continue
            keyword = NATIVE_TOLERANCE_KEYWORDS.get(call.type_suffix) or MISSING_TOLERANCE_KEYWORDS[call.type_suffix]
            entity_id = call.entity_id
            m = re.search(rf"^#{entity_id} = {keyword}\(.*?\)\s*;$", text, re.M)
            if m is None:
                raise RuntimeError(f"could not locate entity #{entity_id} ({keyword}) to attach datum reference to")
            whole = m.group(0)
            inner = whole[whole.index("(") : -1]  # just the '(...)' arg list, not the keyword itself
            sid = datum_system_id(call.datum_labels)
            replacement = f"#{entity_id} = ( GEOMETRIC_TOLERANCE{inner} GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE((#{sid})) {keyword}() );"
            text = text.replace(whole, replacement, 1)

        if additions:
            text = text.replace("ENDSEC;\nEND-ISO-10303-21;", "".join(additions) + "ENDSEC;\nEND-ISO-10303-21;")
        return text


