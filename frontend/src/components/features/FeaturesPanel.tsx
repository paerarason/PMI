import { useEffect, useRef } from "react";
import type { ModelSummary } from "../../types";
import { Icon } from "../studio/icons";
import { labelOf, sizeOf, type FeaturesState } from "./useFeatures";

/** The features recognized from the geometry, each with its size, how sure the recognizer is and the evidence. */
export default function FeaturesPanel({ f, model }: { f: FeaturesState; model: ModelSummary | null }) {
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  useEffect(() => {
    if (f.selectedId) rowRefs.current[f.selectedId]?.scrollIntoView({ block: "nearest" });
  }, [f.selectedId]);

  if (!model)
    return (
      <div className="cam-manager flex h-full min-h-0 flex-col">
        <div className="cam-panel-title">Features</div>
        <div className="cam-empty">No part loaded.</div>
      </div>
    );
  const sel = f.selected;
  const unknown = f.features.filter((x) => x.type === "unknown").length;
  const ambiguous = f.features.filter((x) => x.ambiguous).length;
  return (
    <div className="cam-manager flex h-full min-h-0 flex-col">
      <div className="cam-panel-title">Features</div>
      <div className="ft-kpis">
        <div className="ft-kpi">
          <span>Recognized</span>
          <b>{f.features.length}</b>
          <i>{f.showPlanes ? "with planes" : "planes hidden"}</i>
        </div>
        <div className="ft-kpi">
          <span>Ambiguous</span>
          <b>{ambiguous}</b>
          <i>another reading fits</i>
        </div>
        <div className="ft-kpi">
          <span>Unexplained</span>
          <b>{unknown}</b>
          <i>curved regions</i>
        </div>
      </div>
      <div className="ft-compare">
        <label className="ft-check">
          <input type="checkbox" checked={f.showPlanes} onChange={(e) => f.setShowPlanes(e.target.checked)} /> Show planes ({f.planeCount})
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="ft-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Size</th>
              <th className="r">Conf.</th>
            </tr>
          </thead>
          <tbody>
            {f.features.map((x) => (
              <tr
                key={x.id}
                ref={(el) => {
                  rowRefs.current[x.id] = el;
                }}
                className={x.id === f.selectedId ? "selected" : ""}
                onClick={() => f.setSelectedId(x.id === f.selectedId ? null : x.id)}
              >
                <td>
                  {labelOf(x)} {x.ambiguous && <Icon name="warn" size={12} />}
                  <small>{x.id}</small>
                </td>
                <td className="cam-mono">{sizeOf(x) || "—"}</td>
                <td className="r cam-mono">{Math.round(x.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!f.features.length && <div className="cam-empty">No features were recognized on this part.</div>}
        {sel && (
          <>
            <div className="ft-section">{sel.id}</div>
            <div className="ft-note">
              <div>
                Faces {sel.face_ids.join(", ")} · found by <span className="cam-mono">{sel.recognition_method || "—"}</span>
              </div>
              {sel.evidence.map((e) => (
                <div key={e}>• {e}</div>
              ))}
              {sel.alternatives.length > 0 && (
                <div>
                  <b>Other readings:</b> {sel.alternatives.map((a) => `${a.label}${a.confidence !== null ? ` (${Math.round(a.confidence * 100)}%)` : ""}`).join("; ")}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
