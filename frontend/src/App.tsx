import { useCallback, useEffect, useRef, useState } from "react";
import { downloadStepFile, fetchMesh, listSamples, loadSample, uploadStep } from "./api";
import PmiModal from "./components/PmiModal";
import NewBlankModal from "./components/NewBlankModal";
import { type PickTarget } from "./components/Viewer3D";
import Studio from "./components/studio/Studio";
import type { Characteristic, MeshData, ModelSummary, PickedRef, RefKind } from "./types";

export default function App() {
  const [model, setModel] = useState<ModelSummary | null>(null);
  const [mesh, setMesh] = useState<MeshData | null>(null);
  const [samples, setSamples] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [blankOpen, setBlankOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [pickTarget, setPickTarget] = useState<PickTarget>("auto");
  const [pickedRefs, setPickedRefs] = useState<PickedRef[]>([]);
  // null = the PMI panel is closed; { editing: null } = authoring a new characteristic;
  // { editing: c } = rewriting an existing one.
  const [pmiPanel, setPmiPanel] = useState<{ editing: Characteristic | null } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listSamples()
      .then(setSamples)
      .catch(() => {
        setSamples([]);
        setError("Cannot reach the backend API — is it running on port 8001? (uvicorn app.main:app --port 8001)");
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

    const applyModel = useCallback(async (m: ModelSummary) => {
    setBusy("Building mesh…");
    const md = await fetchMesh(m.model_id);
    const ids = new Set(m.characteristics.map((c) => c.id));
    setModel(m);
    setMesh(md);
    setSelectedId((prev) => (prev && ids.has(prev) ? prev : m.characteristics[0]?.id ?? null));
  }, []);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const openPmiPanel = (editing: Characteristic | null) => {
    setPickedRefs([]);
    setPickTarget("auto");
    setPickMode(true);
    setPmiPanel({ editing });
  };

  const closePmiPanel = () => {
    setPmiPanel(null);
    setPickMode(false);
    setPickedRefs([]);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    run(`Parsing ${f.name}…`, async () => applyModel(await uploadStep(f)));
  };

  const onPickRef = (kind: RefKind, refId: number) =>
    setPickedRefs((refs) => {
      const already = refs.findIndex((r) => r.kind === kind && r.ref_id === refId);
      if (already >= 0) return refs.filter((_, i) => i !== already);
      return refs.length >= 2 ? [refs[1], { kind, ref_id: refId }] : [...refs, { kind, ref_id: refId }];
    });

  const viewerProps = { model, mesh, statuses: {}, selectedId, onSelect: setSelectedId, pickMode, pickTarget, pickedRefs, onPickRef };

  const hint = pickMode
    ? pmiPanel?.editing
      ? `Click faces or edges to re-point ${pmiPanel.editing.id} (click again to unpick, or leave empty to keep its current geometry)`
      : "Click faces or edges to pick them for the new characteristic (click again to unpick)"
    : "Drag to orbit · scroll to zoom · right-drag to pan · click a face or balloon to select";

  const loadSampleByName = (name: string) => run(`Loading ${name}…`, async () => applyModel(await loadSample(name)));
  const download = () => run("Downloading…", async () => downloadStepFile(model!.model_id, model!.file_name));

  const pmiNode =
    pmiPanel && model ? (
      <PmiModal
        key={pmiPanel.editing?.id ?? "new"}
        model={model}
        mesh={mesh}
        editing={pmiPanel.editing}
        pickedRefs={pickedRefs}
        pickTarget={pickTarget}
        onPickTargetChange={setPickTarget}
        onClose={closePmiPanel}
        onClearPicks={() => setPickedRefs([])}
        docked
        onSaved={(m) => {
          const edited = pmiPanel.editing;
          run(`Reloading ${m.file_name}…`, async () => applyModel(m));
          closePmiPanel();
          setToast(edited ? `${edited.id} updated and written to the STEP file.` : "PMI added and written to the STEP file.");
        }}
      />
    ) : null;

  return (
    <>
      <input ref={fileRef} type="file" accept=".step,.stp,.p21" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <Studio
        model={model}
        samples={samples}
        busy={busy}
        error={error}
        toast={toast}
        onDismissError={() => setError(null)}
        hint={hint}
        viewerProps={viewerProps}
        selectedId={selectedId}
        onSelect={setSelectedId}
        functionPanel={pmiNode}
        pickMode={pickMode}
        pickTarget={pickTarget}
        onPickTargetChange={setPickTarget}
        actions={{
          openFile: () => fileRef.current?.click(),
          newBlank: () => setBlankOpen(true),
          loadSample: loadSampleByName,
          download,
          addGdt: () => openPmiPanel(null),
          edit: (c) => {
            setSelectedId(c.id);
            openPmiPanel(c);
          },
        }}
      />
      {blankOpen && (
        <NewBlankModal
          onClose={() => setBlankOpen(false)}
          onCreated={(m) => {
            setBlankOpen(false);
            run(`Loading ${m.file_name}…`, async () => applyModel(m));
            setToast("Blank model created. Use Add GD&T… to author PMI onto it.");
          }}
        />
      )}
    </>
  );
}
