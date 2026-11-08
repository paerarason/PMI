"""Generate a geometry-only AP242 sample with a **filleted-corner** closed pocket (PLAN.md §B2/§C2).

A rectangular blind pocket whose four vertical corners are rounded to a radius R. That corner radius is the
hard constraint on the largest finishing tool that can clean the pocket walls, so the pocket recognizer
must extract it (and not mis-read the quarter-cylinder corners as holes). One clean feature = clean ground
truth for corner-radius extraction.

    .venv/bin/python scripts/make_sample_pocket_filleted.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from OCP.BRepAdaptor import BRepAdaptor_Curve  # noqa: E402
from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut  # noqa: E402
from OCP.BRepFilletAPI import BRepFilletAPI_MakeFillet  # noqa: E402
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox  # noqa: E402
from OCP.GeomAbs import GeomAbs_Line  # noqa: E402
from OCP.gp import gp_Pnt  # noqa: E402
from OCP.IFSelect import IFSelect_RetDone  # noqa: E402
from OCP.Interface import Interface_Static  # noqa: E402
from OCP.STEPCAFControl import STEPCAFControl_Writer  # noqa: E402
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller  # noqa: E402
from OCP.TCollection import TCollection_ExtendedString  # noqa: E402
from OCP.TDataStd import TDataStd_Name  # noqa: E402
from OCP.TDocStd import TDocStd_Document  # noqa: E402
from OCP.TopAbs import TopAbs_EDGE  # noqa: E402
from OCP.TopExp import TopExp_Explorer  # noqa: E402
from OCP.TopoDS import TopoDS  # noqa: E402
from OCP.XCAFDoc import XCAFDoc_DocumentTool  # noqa: E402

from app import config  # noqa: E402
from app.services.step_text_utils import dewrap  # noqa: E402

PRODUCT = "DEMO-POCKET-FILLETED"
W, D, H = 80.0, 60.0, 25.0            # base plate
CORNER_R = 6.0                         # vertical corner radius of the pocket


def _fillet_vertical_edges(box, radius):
    """Round the box's four vertical (Z-parallel) edges to `radius`."""
    mk = BRepFilletAPI_MakeFillet(box)
    exp = TopExp_Explorer(box, TopAbs_EDGE)
    while exp.More():
        edge = TopoDS.Edge_s(exp.Current())
        curve = BRepAdaptor_Curve(edge)
        if curve.GetType() == GeomAbs_Line:
            d = curve.Line().Direction()
            if abs(d.Z()) > 0.99:      # vertical edge
                mk.Add(radius, edge)
        exp.Next()
    return mk.Shape()


def build_shape():
    base = BRepPrimAPI_MakeBox(W, D, H).Shape()
    # Pocket tool: 40 (X) x 30 (Y), floor at Z=13 (12 deep); pokes above the top (Z=26) to open it.
    tool = BRepPrimAPI_MakeBox(gp_Pnt(20.0, 15.0, 13.0), gp_Pnt(60.0, 45.0, 26.0)).Shape()
    tool = _fillet_vertical_edges(tool, CORNER_R)
    return BRepAlgoAPI_Cut(base, tool).Shape()


def write_step(path: Path):
    shape = build_shape()
    doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
    XCAFDoc_DocumentTool.SetLengthUnit_s(doc, 0.001)
    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    root = shape_tool.AddShape(shape, False)
    TDataStd_Name.Set_s(root, TCollection_ExtendedString(PRODUCT))

    STEPControl_Controller.Init_s()
    Interface_Static.SetCVal_s("write.step.schema", "AP242DIS")
    Interface_Static.SetCVal_s("write.step.product.name", PRODUCT)
    w = STEPCAFControl_Writer()
    w.SetNameMode(True)
    if not w.Transfer(doc, STEPControl_AsIs):
        raise RuntimeError("XCAF -> STEP transfer failed")
    path.parent.mkdir(parents=True, exist_ok=True)
    if w.Write(str(path)) != IFSelect_RetDone:
        raise RuntimeError("STEP write failed")
    path.write_text(dewrap(path.read_text()))
    print(f"wrote {path}  (corner R={CORNER_R})")


if __name__ == "__main__":
    write_step(config.SAMPLES_DIR / "demo_pocket_filleted.step")
