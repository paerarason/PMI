"""Generate samples/demo_bracket_pmi.step - a compact AP242 file with geometry-linked semantic PMI.

Exercises the primary (XCAF) extraction path: 4 dimensions (2 diameters + 2 linear distances, all with
+/- tolerances), 3 geometric tolerances (flatness, position with 2-datum reference, perpendicularity with
1-datum reference), 2 datums. Small and easy to read end-to-end - see make_sample_shaft.py and
make_sample_comprehensive.py for larger/broader-coverage samples.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder
from OCP.GeomAbs import GeomAbs_Cylinder, GeomAbs_Plane
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt
from OCP.TopAbs import TopAbs_FACE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS
from OCP.XCAFDimTolObjects import (
    XCAFDimTolObjects_DimensionType_Location_LinearDistance,
    XCAFDimTolObjects_DimensionType_Size_Diameter,
    XCAFDimTolObjects_GeomToleranceType_Flatness,
    XCAFDimTolObjects_GeomToleranceType_Perpendicularity,
    XCAFDimTolObjects_GeomToleranceType_Position,
)

from scripts._pmi_helpers import PmiBuilder

OUT = Path(__file__).resolve().parent.parent / "samples" / "demo_bracket_pmi.step"


def build() -> None:
    box = BRepPrimAPI_MakeBox(100.0, 60.0, 20.0).Shape()
    hole = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(30.0, 30.0, -1.0), gp_Dir(0, 0, 1)), 8.0, 30.0).Shape()
    hole2 = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(75.0, 30.0, -1.0), gp_Dir(0, 0, 1)), 5.0, 30.0).Shape()
    shape = BRepAlgoAPI_Cut(BRepAlgoAPI_Cut(box, hole).Shape(), hole2).Shape()

    faces = {}
    exp = TopExp_Explorer(shape, TopAbs_FACE)
    while exp.More():
        f = TopoDS.Face_s(exp.Current())
        s = BRepAdaptor_Surface(f)
        if s.GetType() == GeomAbs_Cylinder:
            faces["hole16" if abs(s.Cylinder().Radius() - 8.0) < 1e-6 else "hole10"] = f
        elif s.GetType() == GeomAbs_Plane:
            n, p = s.Plane().Axis().Direction(), s.Plane().Location()
            if abs(n.Z()) > 0.9:
                faces["top" if p.Z() > 10 else "bottom"] = f
            elif abs(n.X()) > 0.9:
                faces["right" if p.X() > 50 else "left"] = f
            elif abs(n.Y()) > 0.9:
                faces["back" if p.Y() > 30 else "front"] = f
        exp.Next()

    b = PmiBuilder(shape, "DEMO-BRACKET-001")
    b.add_dim("Main bore diameter", XCAFDimTolObjects_DimensionType_Size_Diameter, 16.0, -0.02, 0.05, [faces["hole16"]])
    b.add_dim("Pilot hole diameter", XCAFDimTolObjects_DimensionType_Size_Diameter, 10.0, -0.05, 0.05, [faces["hole10"]])
    b.add_dim("Overall length", XCAFDimTolObjects_DimensionType_Location_LinearDistance, 100.0, -0.2, 0.2, [faces["left"]], [faces["right"]])
    b.add_dim("Overall width", XCAFDimTolObjects_DimensionType_Location_LinearDistance, 60.0, -0.15, 0.15, [faces["front"]], [faces["back"]])

    b.add_datum("A", faces["bottom"])
    b.add_datum("B", faces["left"])
    b.add_tol("Top face flatness", XCAFDimTolObjects_GeomToleranceType_Flatness, 0.05, faces["top"])
    b.add_tol("Side face squareness", XCAFDimTolObjects_GeomToleranceType_Perpendicularity, 0.1, faces["right"], ("A",))
    b.add_tol("Main bore position", XCAFDimTolObjects_GeomToleranceType_Position, 0.2, faces["hole16"], ("A", "B"))

    b.write(OUT, "DEMO-BRACKET-001")


if __name__ == "__main__":
    build()
