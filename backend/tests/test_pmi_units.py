"""PMI units: values stay in the drawing's units, geometry consumers get model units (mm, degrees).

The cases come from the NIST PMI test models (NIST, public), rebuilt here as small synthetic inputs:
mm geometry with inch PMI (FTC-06), XCAF converting some measures to mm and not others, tolerances XCAF read
without their value (FTC-08), a common datum E-F, and ± bounds written the wrong way round (D2MI-904).
"""
import pytest
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox

from app.services.pmi_extractor import _enrich_from_part21
from app.services.pmi_part21 import (Ref, _step_face_key, _unit_of, context_length_unit, extract_part21,
                                     parse_step_entities)
from app.services.pmi_types import Characteristic, in_model_units

# mm geometry (the context unit is a conversion-based 'MILLIMETRE'), PMI measures in inches.
STEP = """ISO-10303-21;
HEADER;
ENDSEC;
DATA;
#1=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT(.MILLI.,.METRE.));
#2=LENGTH_MEASURE_WITH_UNIT(LENGTH_MEASURE(25.4),#1);
#3=DIMENSIONAL_EXPONENTS(1.,0.,0.,0.,0.,0.,0.);
#4=(CONVERSION_BASED_UNIT('inch',#2)LENGTH_UNIT()NAMED_UNIT(#3));
#5=LENGTH_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.0),#1);
#6=(CONVERSION_BASED_UNIT('MILLIMETRE',#5)LENGTH_UNIT()NAMED_UNIT(#3));
#7=(NAMED_UNIT(*)PLANE_ANGLE_UNIT()SI_UNIT($,.RADIAN.));
#8=PLANE_ANGLE_MEASURE_WITH_UNIT(PLANE_ANGLE_MEASURE(0.0174532925199433),#7);
#9=(CONVERSION_BASED_UNIT('degree',#8)NAMED_UNIT(#3)PLANE_ANGLE_UNIT());
#10=(LENGTH_MEASURE_WITH_UNIT()MEASURE_REPRESENTATION_ITEM()MEASURE_WITH_UNIT(LENGTH_MEASURE(0.5625),#4)REPRESENTATION_ITEM('nominal value'));
#11=MEASURE_WITH_UNIT(LENGTH_MEASURE(0.02),#6);
#12=(MEASURE_REPRESENTATION_ITEM()MEASURE_WITH_UNIT(PLANE_ANGLE_MEASURE(60.),#9)PLANE_ANGLE_MEASURE_WITH_UNIT()REPRESENTATION_ITEM('nominal value'));
#13=(GEOMETRIC_REPRESENTATION_CONTEXT(3)GLOBAL_UNIT_ASSIGNED_CONTEXT((#6,#9))REPRESENTATION_CONTEXT('',''));
#14=MEASURE_WITH_UNIT(LENGTH_MEASURE(0.1),#15);
#15=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT($,.METRE.));
#20=PRODUCT_DEFINITION_SHAPE('','',$);
#30=SHAPE_ASPECT('FCF 26','',#20,.T.);
#31=DATUM('','',#20,.F.,'D');
#32=DATUM('','',#20,.F.,'E');
#33=DATUM('','',#20,.F.,'F');
#34=DATUM_REFERENCE_COMPARTMENT('',$,#20,.F.,#31,$);
#35=DATUM_REFERENCE_ELEMENT('',$,#20,.F.,#32,$);
#36=DATUM_REFERENCE_ELEMENT('',$,#20,.F.,#33,$);
#37=DATUM_REFERENCE_COMPARTMENT('',$,#20,.F.,COMMON_DATUM_LIST((#35,#36)),$);
#39=DATUM_SYSTEM('','',#20,.F.,(#34,#37));
#40=(GEOMETRIC_TOLERANCE('FCF 26','',#41,#30)GEOMETRIC_TOLERANCE_WITH_DATUM_REFERENCE((#39))SURFACE_PROFILE_TOLERANCE());
#41=(LENGTH_MEASURE_WITH_UNIT()MEASURE_REPRESENTATION_ITEM()MEASURE_WITH_UNIT(POSITIVE_LENGTH_MEASURE(0.04),#4)REPRESENTATION_ITEM('nominal value'));
#50=SHAPE_ASPECT('bore','',#20,.T.);
#51=DIMENSIONAL_SIZE(#50,'diameter');
#52=(LENGTH_MEASURE_WITH_UNIT()MEASURE_REPRESENTATION_ITEM()MEASURE_WITH_UNIT(POSITIVE_LENGTH_MEASURE(0.375),#4)REPRESENTATION_ITEM('nominal value'));
#53=SHAPE_DIMENSION_REPRESENTATION('',(#52),#13);
#54=DIMENSIONAL_CHARACTERISTIC_REPRESENTATION(#51,#53);
#55=MEASURE_WITH_UNIT(LENGTH_MEASURE(5.E-03),#4);
#56=MEASURE_WITH_UNIT(LENGTH_MEASURE(-5.E-03),#4);
#57=TOLERANCE_VALUE(#55,#56);
#58=PLUS_MINUS_TOLERANCE(#57,#51);
#60=CARTESIAN_POINT('',(1.,0.,0.));
#61=DIRECTION('',(1.,0.,0.));
#62=AXIS2_PLACEMENT_3D('',#60,#61,$);
#63=CYLINDRICAL_SURFACE('',#62,0.5);
#64=ADVANCED_FACE('',(),#63,.T.);
ENDSEC;
END-ISO-10303-21;
"""


def test_units_resolve_from_the_conversion_factor_not_the_name():
    ents = parse_step_entities(STEP)
    assert _unit_of(ents, Ref(10)) == "in"
    assert _unit_of(ents, Ref(11)) == "mm"        # a CONVERSION_BASED_UNIT called 'MILLIMETRE', factor 1 mm
    assert _unit_of(ents, Ref(12)) == "deg"       # 'degree' = 0.01745 rad: not 'rad' from the inner SI unit
    assert _unit_of(ents, Ref(14)) == "m"
    assert context_length_unit(ents) == ("mm", 1.0)


def test_step_face_coordinates_are_scaled_to_mm():
    key = _step_face_key(parse_step_entities(STEP), Ref(64), 25.4)
    assert key.kind == "cylinder" and key.loc == pytest.approx((25.4, 0, 0)) and key.radius == pytest.approx(12.7)


def test_text_reader_keeps_drawing_units_swapped_bounds_and_common_datums(tmp_path):
    path = tmp_path / "inch_pmi.step"
    path.write_text(STEP)
    chars, _datums = extract_part21(str(path), BRepPrimAPI_MakeBox(10, 10, 10).Shape(), 17.3)
    bore = next(c for c in chars if c.type_label == "Diameter")
    assert (bore.nominal, bore.unit) == (0.375, "in")
    assert bore.lsl == pytest.approx(0.370) and bore.usl == pytest.approx(0.380)  # written (+0.005, -0.005)
    prof = next(c for c in chars if c.type_label == "Profile of Surface")
    assert (prof.usl, prof.unit) == (0.04, "in")
    assert prof.datum_refs == ["D", "E-F"]


def test_in_model_units():
    c = {"kind": "dimension", "nominal": 0.5, "usl": 0.52, "lsl": 0.48, "unit": "in"}
    mm = in_model_units(c)
    assert mm["nominal"] == pytest.approx(12.7) and mm["usl"] == pytest.approx(13.208) and mm["lsl"] == pytest.approx(12.192)
    assert mm["unit"] == "mm" and mm["drawing_unit"] == "in" and c["unit"] == "in"   # the original is untouched
    ang = in_model_units({"kind": "dimension", "nominal": 0.5, "usl": None, "lsl": None, "unit": "rad"})
    assert ang["nominal"] == pytest.approx(28.6479, abs=1e-4) and ang["unit"] == "deg"
    already = {"kind": "dimension", "nominal": 3.0, "usl": None, "lsl": None, "unit": "mm"}
    assert in_model_units(already) is already


def _dim(nominal, usl, lsl, unit, faces, source, type_label="Linear Distance"):
    return Characteristic(kind="dimension", feature_name="", type_label=type_label, nominal=nominal, usl=usl,
                          lsl=lsl, unit=unit, face_ids=faces, source=source)


def _tol(type_label, value, unit, datums, faces, source, name=""):
    return Characteristic(kind="geom_tolerance", feature_name=name, type_label=type_label, nominal=0.0, usl=value,
                          lsl=0.0, unit=unit, datum_refs=datums, face_ids=faces, source=source)


def test_merge_keeps_the_drawing_values_whatever_xcaf_converted():
    xcaf = [
        # FTC-06: nominal as written in inches, ± deviation converted to mm (0.508 = 0.02 in); the text reader
        # resolved the plane to a different coplanar face
        _dim(0.5, 1.008, -0.008, "mm", [82, 75], "xcaf"),
        # FTC-06 tolerances: XCAF gives mm (0.635 = 0.025 in)
        _tol("Position", 0.635, "mm", ["A", "B"], [5], "xcaf"),
        # FTC-08: value dropped, common datum E-F flattened
        _tol("Profile of Surface", 0.0, "mm", ["D", "E", "F"], [104, 35], "xcaf"),
        # STC-10: a cylindricity without its value must not take a zero-tolerance position's place
        _tol("Cylindricity", 0.0, "mm", [], [62, 63], "xcaf"),
        # D2MI-904: XCAF misread the value; same faces as the text reader's Ø0.375
        _dim(0.251, 0.127, None, "mm", [31, 29, 32], "xcaf", "Diameter"),
        # STC-07: no copy in the text reader at all; converted like the paired item above
        _dim(0.3, 0.808, -0.208, "mm", [2, 19], "xcaf"),
    ]
    text = [
        _dim(0.5, 0.52, 0.48, "in", [72], "part21"),
        _tol("Position", 0.025, "in", ["A", "B"], [5], "part21"),
        _tol("Profile of Surface", 0.04, "in", ["D", "E-F"], [104], "part21"),
        _tol("Position", 0.0, "in", ["D", "E", "F"], [62, 63], "part21"),
        _tol("Cylindricity", 0.001, "in", [], [62, 63], "part21"),
        _dim(0.375, 0.38, 0.37, "in", [31, 29], "part21", "Diameter"),
    ]
    used = _enrich_from_part21(xcaf, text)
    dist, pos, prof, cyl, dia, lone = xcaf
    assert (dist.nominal, dist.usl, dist.lsl, dist.unit) == (0.5, 0.52, 0.48, "in")
    assert (pos.usl, pos.unit) == (0.025, "in")
    assert (prof.usl, prof.unit, prof.datum_refs) == (0.04, "in", ["D", "E-F"])
    assert (cyl.usl, cyl.unit) == (0.001, "in")
    assert (dia.nominal, dia.usl, dia.lsl, dia.unit) == (0.375, 0.38, 0.37, "in")
    assert lone.unit == "in" and lone.nominal == pytest.approx(0.3)
    assert lone.usl == pytest.approx(0.32) and lone.lsl == pytest.approx(0.28)
    assert used == {0, 1, 2, 4, 5}       # the zero-tolerance position is left for the recovery pass


def test_mm_drawing_is_left_alone():
    xcaf = [_dim(16.0, 16.05, 15.98, "mm", [3], "xcaf", "Diameter"), _dim(40.0, 40.1, 39.9, "mm", [7, 9], "xcaf")]
    text = [_dim(16.0, 16.05, 15.98, "mm", [3], "part21", "Diameter")]
    _enrich_from_part21(xcaf, text)
    assert [(c.nominal, c.usl, c.lsl, c.unit) for c in xcaf] == [(16.0, 16.05, 15.98, "mm"), (40.0, 40.1, 39.9, "mm")]
