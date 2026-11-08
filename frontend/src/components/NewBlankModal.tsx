import { useState } from "react";
import { createBlank } from "../api";
import type { ModelSummary } from "../types";

interface Props {
  onClose: () => void;
  onCreated: (m: ModelSummary) => void;
}

export default function NewBlankModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("BLANK-PART-001");
  const [width, setWidth] = useState(80);
  const [depth, setDepth] = useState(50);
  const [height, setHeight] = useState(20);
  const [withHole, setWithHole] = useState(false);
  const [holeDia, setHoleDia] = useState(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dims = [
    { label: "Width (X)", value: width, set: setWidth },
    { label: "Depth (Y)", value: depth, set: setDepth },
    { label: "Height (Z)", value: height, set: setHeight },
  ];

  const holeTooBig = withHole && holeDia >= Math.min(width, depth);
  const canCreate = !busy && width > 0 && depth > 0 && height > 0 && (!withHole || (holeDia > 0 && !holeTooBig));

  const onCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      const m = await createBlank({
        width,
        depth,
        height,
        hole_dia: withHole ? holeDia : 0,
        name: name.trim() || "BLANK-PART-001",
      });
      onCreated(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md overflow-auto rounded-lg bg-slate-900 shadow-xl ring-1 ring-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">New blank model</h2>
            <p className="text-xs text-slate-400">Generate an empty block (geometry only) to author PMI onto in the Edit tab.</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-4 p-4">
          <label className="block">
            <span className="text-xs text-slate-300">Part name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            {dims.map((d) => (
              <label key={d.label} className="block">
                <span className="text-xs text-slate-300">{d.label} · mm</span>
                <input
                  type="number"
                  min={0.1}
                  value={d.value}
                  onChange={(e) => d.set(Number(e.target.value))}
                  className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"
                />
              </label>
            ))}
          </div>

          <section className="rounded border border-slate-700 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-100">
              <input type="checkbox" checked={withHole} onChange={(e) => setWithHole(e.target.checked)} />
              Cut a centred through-hole
            </label>
            <p className="mt-0.5 text-xs text-slate-400">Adds a cylindrical face (along Z) so you can hang a diameter dimension on it.</p>
            <label className="mt-2 block">
              <span className="text-xs text-slate-300">Hole diameter · mm</span>
              <input
                type="number"
                min={0.1}
                disabled={!withHole}
                value={holeDia}
                onChange={(e) => setHoleDia(Number(e.target.value))}
                className="mt-0.5 w-32 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"
              />
            </label>
            {holeTooBig && <p className="mt-1 text-xs text-amber-400">Hole must be smaller than width and depth.</p>}
          </section>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-4 py-3">
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800">
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!canCreate}
            className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {busy ? "Generating…" : "Create & edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
