"""Generate samples/demo_shaft_pmi.step - a stepped shaft exercising rotational-feature PMI that the
bracket sample doesn't: circularity, cylindricity, circular/total runout, and a cross-drilled hole
with position tolerance, all against an axis datum system (A = end face, B = journal cylinder).
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut, BRepAlgoAPI_Fuse
from OCP.BRepPrimAPI import BRepPrimAPI_MakeCylinder
from OCP.GeomAbs import GeomAbs_Cylinder, GeomAbs_Plane
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt
from OCP.TopAbs import TopAbs_FACE
from OCP.TopExp import TopExp_Explorer
from OCP.TopoDS import TopoDS
from OCP.XCAFDimTolObjects import (
    XCAFDimTolObjects_DimensionType_Location_LinearDistance,
    XCAFDimTolObjects_DimensionType_Size_Diameter,
    XCAFDimTolObjects_GeomToleranceType_CircularityOrRoundness,
    XCAFDimTolObjects_GeomToleranceType_CircularRunout,
    XCAFDimTolObjects_GeomToleranceType_Cylindricity,
    XCAFDimTolObjects_GeomToleranceType_Position,
    XCAFDimTolObjects_GeomToleranceType_TotalRunout,
)

from scripts._pmi_helpers import PmiBuilder

OUT = Path(__file__).resolve().parent.parent / "samples" / "demo_shaft_pmi.step"

X = gp_Dir(1, 0, 0)


def build() -> None:
    # 3 coaxial cylinders along X: left journal (r15, 0-30), middle (r10, 30-70), right journal (r15, 70-100)
    left = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(0, 0, 0), X), 15.0, 30.0).Shape()
    mid = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(30, 0, 0), X), 10.0, 40.0).Shape()
    right = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(70, 0, 0), X), 15.0, 30.0).Shape()
    shaft = BRepAlgoAPI_Fuse(BRepAlgoAPI_Fuse(left, mid).Shape(), right).Shape()

    # cross-drilled pin hole through the left journal, along Z, centered at x=15
    pin = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(15, 0, -20), gp_Dir(0, 0, 1)), 4.0, 40.0).Shape()
    shape = BRepAlgoAPI_Cut(shaft, pin).Shape()

    faces: dict[str, object] = {}
    exp = TopExp_Explorer(shape, TopAbs_FACE)
    while exp.More():
        f = TopoDS.Face_s(exp.Current())
        s = BRepAdaptor_Surface(f)
        if s.GetType() == GeomAbs_Cylinder:
            c = s.Cylinder()
            r, x0 = c.Radius(), c.Location().X()
            if abs(r - 4.0) < 1e-6:
                faces["pin_hole"] = f
            elif abs(r - 15.0) < 1e-6:
                faces["left_journal" if x0 < 10 else "right_journal"] = f
            elif abs(r - 10.0) < 1e-6:
                faces["middle"] = f
        elif s.GetType() == GeomAbs_Plane:
            p = s.Plane().Location()
            if abs(p.X()) < 1e-6:
                faces["left_end"] = f
            elif abs(p.X() - 100.0) < 1e-6:
                faces["right_end"] = f
        exp.Next()
    assert set(faces) == {"pin_hole", "left_journal", "right_journal", "middle", "left_end", "right_end"}, faces.keys()

    b = PmiBuilder(shape, "DEMO-SHAFT-001")
    b.add_dim("left journal dia", XCAFDimTolObjects_DimensionType_Size_Diameter, 30.0, -0.02, 0.0, [faces["left_journal"]])
    b.add_dim("middle dia", XCAFDimTolObjects_DimensionType_Size_Diameter, 20.0, -0.03, 0.03, [faces["middle"]])
    b.add_dim("right journal dia", XCAFDimTolObjects_DimensionType_Size_Diameter, 30.0, -0.02, 0.0, [faces["right_journal"]])
    b.add_dim("pin hole dia", XCAFDimTolObjects_DimensionType_Size_Diameter, 8.0, -0.05, 0.05, [faces["pin_hole"]])
    b.add_dim("overall length", XCAFDimTolObjects_DimensionType_Location_LinearDistance, 100.0, -0.2, 0.2, [faces["left_end"]], [faces["right_end"]])
    b.add_dim("hole location", XCAFDimTolObjects_DimensionType_Location_LinearDistance, 15.0, -0.1, 0.1, [faces["left_end"]], [faces["pin_hole"]])

    b.add_datum("A", faces["left_end"])
    b.add_datum("B", faces["left_journal"])
    b.add_tol("middle roundness", XCAFDimTolObjects_GeomToleranceType_CircularityOrRoundness, 0.01, faces["middle"])
    b.add_tol("middle cylindricity", XCAFDimTolObjects_GeomToleranceType_Cylindricity, 0.015, faces["middle"])
    b.add_tol("journal runout", XCAFDimTolObjects_GeomToleranceType_CircularRunout, 0.02, faces["right_journal"], ("A", "B"))
    b.add_tol("journal total runout", XCAFDimTolObjects_GeomToleranceType_TotalRunout, 0.03, faces["right_journal"], ("A", "B"))
    b.add_tol("pin hole position", XCAFDimTolObjects_GeomToleranceType_Position, 0.1, faces["pin_hole"], ("A", "B"))

    b.write(OUT, "DEMO-SHAFT-001")


if __name__ == "__main__":
    build()
