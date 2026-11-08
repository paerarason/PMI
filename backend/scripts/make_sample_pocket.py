"""Generate a geometry-only AP242 sample exercising the B2 prismatic features (PLAN.md §B2).

One plate carries three distinct prismatic features so the pocket/slot/step recognizers each have clean
ground truth to be scored against:

  * a **closed blind rectangular pocket** — flat floor + 4 walls, all-concave bounding loop;
  * a **blind slot** — long, narrow blind pocket (high aspect ratio);
  * an **open step / shoulder** — a corner cut away, open to the outside on two sides.

Geometry only, no PMI (the prismatic recognizers read topology, not PMI). Written with the same plain
XCAF -> STEP transfer as blank_model.py.

    .venv/bin/python scripts/make_sample_pocket.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut  # noqa: E402
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox  # noqa: E402
from OCP.gp import gp_Pnt  # noqa: E402
from OCP.IFSelect import IFSelect_RetDone  # noqa: E402
from OCP.Interface import Interface_Static  # noqa: E402
from OCP.STEPCAFControl import STEPCAFControl_Writer  # noqa: E402
from OCP.STEPControl import STEPControl_AsIs, STEPControl_Controller  # noqa: E402
from OCP.TCollection import TCollection_ExtendedString  # noqa: E402
from OCP.TDataStd import TDataStd_Name  # noqa: E402
from OCP.TDocStd import TDocStd_Document  # noqa: E402
from OCP.XCAFDoc import XCAFDoc_DocumentTool  # noqa: E402

from app import config  # noqa: E402
from app.services.step_text_utils import dewrap  # noqa: E402

PRODUCT = "DEMO-POCKET-FEATURES"

# Base plate (mm): 100 (X) x 80 (Y) x 25 (Z), top face at Z=25.
W, D, H = 100.0, 80.0, 25.0


def _cut_box(shape, x0, y0, z0, x1, y1, z1):
    tool = BRepPrimAPI_MakeBox(gp_Pnt(x0, y0, z0), gp_Pnt(x1, y1, z1)).Shape()
    return BRepAlgoAPI_Cut(shape, tool).Shape()


def build_shape():
    shape = BRepPrimAPI_MakeBox(W, D, H).Shape()

    # Closed blind rectangular pocket: 40 x 30 footprint, 10 deep (floor at Z=15). The tool box pokes
    # above the top (Z=26) so the cut cleanly opens the top face.
    shape = _cut_box(shape, 15.0, 25.0, 15.0, 55.0, 55.0, 26.0)

    # Blind slot: 50 (X) long x 12 (Y) wide, 8 deep (floor at Z=17). Along the front, clear of the pocket.
    shape = _cut_box(shape, 20.0, 8.0, 17.0, 70.0, 20.0, 26.0)

    # Open step / shoulder: remove the top-back-right corner (floor at Z=10), open on the +X and +Y sides.
    shape = _cut_box(shape, 78.0, 52.0, 10.0, 101.0, 81.0, 26.0)
    return shape


def write_step(path: Path):
    shape = build_shape()
    doc = TDocStd_Document(TCollection_ExtendedString("MDTV-XCAF"))
    XCAFDoc_DocumentTool.SetLengthUnit_s(doc, 0.001)  # mm
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
    print(f"wrote {path}")


if __name__ == "__main__":
    write_step(config.SAMPLES_DIR / "demo_pocket_features.step")
