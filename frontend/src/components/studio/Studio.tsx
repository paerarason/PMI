import { useCallback, useEffect, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { fmt } from "../../format";
import type { Characteristic, ModelSummary } from "../../types";
import DrawingPanel from "../drawing/DrawingPanel";
import DrawingView from "../drawing/DrawingView";
import FeaturesPanel from "../features/FeaturesPanel";
import { useFeatures } from "../features/useFeatures";
import Viewer3D, { type PickTarget, type ViewName, type ViewerHandle } from "../Viewer3D";
import PmiManager from "./PmiManager";
import { Icon, type IconName } from "./icons";

export interface StudioActions {
  openFile: () => void;
  newBlank: () => void;
  loadSample: (name: string) => void;
  download: () => void;
  addGdt: () => void;
  edit: (c: Characteristic) => void;
}

interface Props {
  model: ModelSummary | null;
  samples: string[];
  busy: string | null;
  error: string | null;
  toast: string | null;
  onDismissError: () => void;
  hint: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  viewerProps: Omit<ComponentProps<typeof Viewer3D>, "theme" | "handle" | "onCursor" | "onViewChange">;
  /** The add/edit GD&T panel, rendered docked in place of the manager while open. */
  functionPanel: ReactNode | null;
  pickMode: boolean;
  pickTarget: PickTarget;
  onPickTargetChange: (t: PickTarget) => void;
  actions: StudioActions;
}

type Workspace = "design" | "features" | "drawing";

const VIEWS: { view: ViewName; label: string }[] = [
  { view: "iso", label: "Isometric" },
  { view: "top", label: "Top" },
  { view: "front", label: "Front" },
  { view: "right", label: "Right" },
  { view: "back", label: "Back" },
  { view: "left", label: "Left" },
  { view: "bottom", label: "Bottom" },
];

const DOCK_MIN = 280;
const DOCK_MAX = 640;

const featuresHint = "Click a row or a face to see a recognized feature in the view, with the evidence behind it";
const drawingHint = "The sheet is drawn from the B-rep: scroll to move, use + / − to zoom, download it as SVG or DXF";

/** The studio shell: a top bar (part, workspace switch, file actions), a contextual toolbar for the active
 * workspace, the manager panel on the left, the 3D view or the drawing, and a status bar. */
export default function Studio(p: Props) {
  const { model, actions, busy } = p;
  const [ws, setWs] = useState<Workspace>("design");
  const [view, setView] = useState<ViewName>("iso");
  const [dockWidth, setDockWidth] = useState(340);
  const [menu, setMenu] = useState<"samples" | "more" | null>(null);
  const viewer = useRef<ViewerHandle>(null);
  const features = ws === "features";
  const drawing = ws === "drawing";
  const fs = useFeatures(model);
  const coordEl = useRef<HTMLSpanElement>(null);
  const chars = model?.characteristics ?? [];
  const selected = chars.find((c) => c.id === p.selectedId) ?? null;
  const panelOpen = !!p.functionPanel;
  const canWrite = !!model && !panelOpen && !busy;
  const canEditSel = !!selected && canWrite && selected.xcaf_index !== null;

  // written straight into the DOM: a per-frame setState would re-render the whole app on mouse move
  const onCursor = useCallback((pt: [number, number, number] | null) => {
    if (!coordEl.current) return;
    coordEl.current.textContent = pt ? `X ${fmt(pt[0], 3)}  Y ${fmt(pt[1], 3)}  Z ${fmt(pt[2], 3)}` : "X —  Y —  Z —";
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [menu]);

  const startResize = (e: ReactPointerEvent) => {
    e.preventDefault();
    const x0 = e.clientX;
    const w0 = dockWidth;
    const move = (ev: PointerEvent) => setDockWidth(Math.min(DOCK_MAX, Math.max(DOCK_MIN, w0 + ev.clientX - x0)));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const goView = (v: ViewName) => viewer.current?.setView(v);
  const addGdt = () => {
    if (ws !== "design") setWs("design");
    actions.addGdt();
  };

  const viewButtons = (list: typeof VIEWS) => (
    <div className="st-group">
      <span className="st-group-label">View</span>
      {list.map((v) => (
        <button key={v.view} className={`st-btn icon ${model && view === v.view ? "active" : ""}`} title={v.label} onClick={() => goView(v.view)} disabled={!model}>
          <Icon name={`view-${v.view}`} size={18} />
        </button>
      ))}
    </div>
  );

  const designBar = (
    <>
      <div className="st-group">
        <button className="st-btn primary" onClick={addGdt} disabled={!canWrite}>
          <Icon name="addGdt" /> Add GD&amp;T
        </button>
        <Btn icon="edit" label="Edit" onClick={() => selected && actions.edit(selected)} disabled={!canEditSel} />
      </div>
      <span className="st-divider" />
      <div className="st-group">
        <span className="st-group-label">Pick</span>
        <div className="st-seg sm">
          {(
            [
              ["auto", "selAuto", "Auto"],
              ["vertex", "selVertex", "Vertex"],
              ["edge", "selEdge", "Edge"],
              ["face", "selFace", "Face"],
            ] as const
          ).map(([t, icon, label]) => (
            <button key={t} className={p.pickMode && p.pickTarget === t ? "active" : ""} disabled={!p.pickMode} onClick={() => p.onPickTargetChange(t)} title={p.pickMode ? `Pick ${label.toLowerCase()}s` : "Open Add GD&T to pick geometry"}>
              <Icon name={icon} size={14} /> {label}
            </button>
          ))}
        </div>
      </div>
      <span className="st-divider" />
      {viewButtons(VIEWS)}
      <div className="st-group">
        <Btn icon="fit" label="Fit" onClick={() => goView("iso")} disabled={!model} />
      </div>
    </>
  );

  const featuresBar = <>{viewButtons(VIEWS.slice(0, 4))}</>;

  const drawingBar = (
    <div className="st-group">
      <span className="st-group-label">Sheet</span>
      <span className="ft-bar-note">Third-angle projection · exact hidden-line views · balloons from the file's PMI</span>
    </div>
  );

  const status =
    p.error ??
    p.busy ??
    p.toast ??
    (features ? featuresHint : drawing ? drawingHint : p.hint);

  const featureFaces = fs.selected?.face_ids ?? null;

  return (
    <div className="st-root">
      <header className="st-top">
        <div className="st-brand">
          <span className="st-logo">
            <Icon name="part" size={15} />
          </span>
          PMI Studio
        </div>
        <div className="st-file" title={model?.file_name}>
          <Icon name="part" size={14} />
          {model ? (
            <>
              <b>{model.file_name}</b>
              <span>
                {model.face_count} faces · {chars.length} PMI · {model.feature_count} features
              </span>
            </>
          ) : (
            <span>No part open</span>
          )}
        </div>
        <div className="st-spacer" />
        <nav className="st-seg" aria-label="Workspace">
          <button className={ws === "design" ? "active" : ""} onClick={() => setWs("design")}>
            <Icon name="tol" size={15} /> GD&amp;T
          </button>
          <button className={features ? "active" : ""} onClick={() => setWs("features")} disabled={panelOpen} title={panelOpen ? "Close the GD&T panel first" : "The machining features recognized from the geometry"}>
            <Icon name="features" size={15} /> Features
          </button>
          <button className={drawing ? "active" : ""} onClick={() => setWs("drawing")} disabled={panelOpen} title={panelOpen ? "Close the GD&T panel first" : "The 2D drawing: views, balloons and the PMI table"}>
            <Icon name="drawing" size={15} /> Drawing
          </button>
        </nav>
        <div className="st-spacer" />
        <div className="st-actions">
          <Btn icon="open" label="Open" onClick={actions.openFile} disabled={!!busy} />
          <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
            <Btn icon="sample" label="Samples" onClick={() => setMenu((x) => (x === "samples" ? null : "samples"))} disabled={!!busy || !p.samples.length} active={menu === "samples"} />
            {menu === "samples" && (
              <div className="st-menu">
                <div className="st-menu-label">Sample parts (generated, not in git)</div>
                {p.samples.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setMenu(null);
                      actions.loadSample(s);
                    }}
                  >
                    <Icon name="part" size={15} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Btn icon="save" label="Save .step" onClick={actions.download} disabled={!model} />
          <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
            <button className={`st-btn icon ${menu === "more" ? "active" : ""}`} title="More" onClick={() => setMenu((x) => (x === "more" ? null : "more"))}>
              <span style={{ fontSize: 18, lineHeight: 1, marginTop: -6 }}>…</span>
            </button>
            {menu === "more" && (
              <div className="st-menu">
                <button
                  onClick={() => {
                    setMenu(null);
                    actions.newBlank();
                  }}
                  disabled={!!busy}
                >
                  <Icon name="new" size={15} /> New blank part…
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="st-toolbar">{features ? featuresBar : drawing ? drawingBar : designBar}</div>

      <div className="flex min-h-0">
        <aside className="cam-dock min-h-0" style={{ width: dockWidth }}>
          {features ? (
            <FeaturesPanel f={fs} model={model} />
          ) : drawing ? (
            <DrawingPanel model={model} selectedId={p.selectedId} onSelect={p.onSelect} />
          ) : (
            (p.functionPanel ?? <PmiManager model={model} selectedId={p.selectedId} onSelect={p.onSelect} onAdd={actions.addGdt} onEdit={actions.edit} canWrite={canWrite} />)
          )}
        </aside>
        <div className="cam-splitter" onPointerDown={startResize} />
        <section className="cam-graphics relative min-h-0 flex-1 overflow-hidden">
          {drawing ? (
            <DrawingView modelId={model?.model_id ?? null} />
          ) : (
            <Viewer3D
              {...p.viewerProps}
              theme="cam"
              handle={viewer}
              onCursor={onCursor}
              onViewChange={setView}
              {...(features ? { highlightFaces: featureFaces, focusFaces: featureFaces, onFaceClick: fs.selectFace, hidePmi: true, pickMode: false } : {})}
            />
          )}
          {!drawing && model && model.warnings.length > 0 && (
            <div className="cam-viewport-warn pointer-events-none">
              <Icon name="warn" size={14} /> {model.warnings.length} warning(s): see the Part tab in the manager
            </div>
          )}
        </section>
      </div>

      <div className="cam-statusbar">
        <span className={`cam-status-msg ${p.error ? "error" : p.toast ? "ok" : p.busy ? "busy" : ""}`}>
          {status}
          {p.error && (
            <button className="cam-status-link" onClick={p.onDismissError}>
              dismiss
            </button>
          )}
        </span>
        {features ? (
          <span className="cam-status-seg">{fs.features.length} FEATURES</span>
        ) : drawing ? (
          <span className="cam-status-seg">A3 · THIRD ANGLE</span>
        ) : (
          <>
            <span className="cam-status-seg" ref={coordEl}>
              X —  Y —  Z —
            </span>
            <span className="cam-status-seg">VIEW {view.toUpperCase()}</span>
          </>
        )}
        <span className="cam-status-seg">MM</span>
      </div>
    </div>
  );
}

function Btn({ icon, label, onClick, disabled, active, title }: { icon: IconName; label: string; onClick: () => void; disabled?: boolean; active?: boolean; title?: string }) {
  return (
    <button className={`st-btn ${active ? "active" : ""}`} onClick={onClick} disabled={disabled} title={title}>
      <Icon name={icon} />
      {label}
    </button>
  );
}
