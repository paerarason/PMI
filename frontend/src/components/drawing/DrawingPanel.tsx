import { useState } from "react";
import { downloadFile, drawingUrl } from "../../api";
import type { ModelSummary } from "../../types";
import { Icon } from "../studio/icons";

/** Dock for the Drawing workspace: what is on the sheet (the balloon numbers and the PMI behind them) and the
 * downloads. The sheet itself is DrawingView. */
export default function DrawingPanel({ model, selectedId, onSelect }: { model: ModelSummary | null; selectedId: string | null; onSelect: (id: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!model)
    return (
      <div className="cam-manager flex h-full min-h-0 flex-col">
        <div className="cam-panel-title">Drawing</div>
        <div className="cam-empty">No part loaded.</div>
      </div>
    );
  const stem = model.file_name.replace(/\.[^.]+$/, "");
  const save = async (fmt: "svg" | "dxf") => {
    setBusy(true);
    setErr(null);
    try {
      await downloadFile(drawingUrl(model.model_id, fmt), `${stem}_drawing.${fmt}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };
  const chars = model.characteristics;
  const unplaced = chars.filter((c) => !c.anchor).length;
  return (
    <div className="cam-manager flex h-full min-h-0 flex-col">
      <div className="cam-panel-title">Drawing</div>
      <div className="dw-actions">
        <button className="st-btn primary" disabled={busy} onClick={() => save("svg")} title="The sheet as a vector image">
          <Icon name="save" /> SVG
        </button>
        <button className="st-btn" disabled={busy} onClick={() => save("dxf")} title="The sheet as DXF: views, balloons and table, on named layers, for a CAD package">
          <Icon name="save" /> DXF
        </button>
      </div>
      {err && <div className="ft-note">{err}</div>}
      <div className="ft-note">
        Front, top and right views in third angle, plus an isometric: exact hidden-line removal on the B-rep, hidden edges dashed. Each balloon carries the
        number of a characteristic read from the STEP file. Grey overall sizes are measured from the geometry and are not PMI.
      </div>
      <div className="ft-section">
        Balloons ({chars.length}){unplaced > 0 ? ` · ${unplaced} not linked to geometry` : ""}
      </div>
      <div className="cam-tree min-h-0 flex-1 overflow-auto" onClick={() => onSelect(null)}>
        {chars.map((c) => (
          <div
            key={c.id}
            className={`cam-tree-row ${c.id === selectedId ? "selected" : ""}`}
            style={{ paddingLeft: 14 }}
            onClick={(ev) => {
              ev.stopPropagation();
              onSelect(c.id);
            }}
          >
            <span className="dw-balloon">{c.id}</span>
            <span className="cam-mono">{c.requirement}</span>
            <span className="cam-tree-muted">{c.feature_name}</span>
          </div>
        ))}
        {model.datums.map((d) => (
          <div key={d.label} className="cam-tree-row" style={{ paddingLeft: 14 }}>
            <span className="dw-datum">{d.label}</span>
            <span>Datum {d.label}</span>
            <span className="cam-tree-muted">{d.face_ids.length ? `face ${d.face_ids.join(", ")}` : "unlinked"}</span>
          </div>
        ))}
        {!chars.length && <div className="cam-empty">This part has no PMI, so the sheet has views and overall sizes only. Add GD&amp;T in the GD&amp;T workspace.</div>}
      </div>
    </div>
  );
}
