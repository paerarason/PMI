"""Generate a blank AP242 solid (geometry only, no PMI) to serve as a starting point for
authoring PMI in the Edit tab.

This is deliberately self-contained (does not depend on scripts/_pmi_helpers.PmiBuilder): a
bare shape needs none of PmiBuilder's dimension/tolerance/datum machinery or its post-write
text patching, only a plain XCAF -> STEP transfer. The one shared piece is step_text_utils.dewrap,
matching how every other STEP file in this app is normalised on write.
"""
from __future__ import annotations

from pathlib import Path

from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder
from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt
from OCP.IFSelect import IFSelect_RetDone
from OCP.Interface import Interface_Static
from OCP.STEPCAFControl import STEPCAFControl_Writer
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller
from OCP.TCollection import TCollection_ExtendedString
from OCP.TDataStd import TDataStd_Name
from OCP.TDocStd import TDocStd_Document
from OCP.XCAFDoc import XCAFDoc_DocumentTool

from app.services.step_text_utils import dewrap


def make_blank_block(
    path: Path,
    product_name: str,
    width: float,
    depth: float,
    height: float,
    hole_dia: float = 0.0,
) -> None:
    """Write a rectangular block (width x depth x height, mm) with no PMI to `path` as AP242 STEP.

    If `hole_dia` > 0, a through-hole of that diameter is cut down the centre (along Z), giving a
    cylindrical face to hang a diameter dimension on. Otherwise the solid is six planar faces -
    all pickable in the Edit tab for dimensions, flatness/perpendicularity, datums, etc.
    """
    shape = BRepPrimAPI_MakeBox(width, depth, height).Shape()
    if hole_dia > 0:
        r = hole_dia / 2.0
        axis = gp_Ax2(gp_Pnt(width / 2.0, depth / 2.0, -1.0), gp_Dir(0, 0, 1))
        hole = BRepPrimAPI_MakeCylinder(axis, r, height + 2.0).Shape()
        shape = BRepAlgoAPI_Cut(shape, hole).Shape()

    doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
    XCAFDoc_DocumentTool.SetLengthUnit_s(doc, 0.001)  # declare mm
    shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    root = shape_tool.AddShape(shape, False)
    TDataStd_Name.Set_s(root, TCollection_ExtendedString(product_name))

    STEPControl_Controller.Init_s()
    Interface_Static.SetCVal_s("write.step.schema", "AP242DIS")
    Interface_Static.SetCVal_s("write.step.product.name", product_name)
    w = STEPCAFControl_Writer()
    w.SetNameMode(True)
    if not w.Transfer(doc, STEPControl_AsIs):
        raise RuntimeError("XCAF -> STEP transfer failed")
    path.parent.mkdir(parents=True, exist_ok=True)
    status = w.Write(str(path))
    if status != IFSelect_RetDone:
        raise RuntimeError(f"STEP write failed: {status}")
    path.write_text(dewrap(path.read_text()))
