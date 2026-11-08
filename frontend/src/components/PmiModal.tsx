import { useEffect, useState } from "react";
import { addPmi, editPmi, fetchPmiTypes } from "../api";
import type { PickTarget } from "./Viewer3D";
import type { Characteristic, Kind, MeshData, ModelSummary, PickedRef } from "../types";

interface Props {
  model: ModelSummary;
  mesh: MeshData | null;
  /** null = author a new characteristic; otherwise the existing one being rewritten in place. */
  editing: Characteristic | null;
  pickedRefs: PickedRef[];
  pickTarget: PickTarget;
  onPickTargetChange: (t: PickTarget) => void;
  onClose: () => void;
  onSaved: (m: ModelSummary) => void;
  onClearPicks: () => void;
  /** Render inline to fill a docked side panel (CAM theme's function panel) instead of floating. */
  docked?: boolean;
}

// Fallback type lists, used only until GET /api/models/pmi/types resolves (and if it fails). The backend
// is the source of truth - it filters these to exactly the labels pmi_writer can actually author
// (see pmi_writer.authorable_*), so an unwritable type never appears in the dropdown to be 422'd.
const DIM_TYPES = ["Diameter", "Radius", "Spherical Diameter", "Spherical Radius", "Linear Distance", "Angular", "Thickness"];
const TOL_TYPES = [
  "Flatness", "Straightness", "Circularity", "Cylindricity", "Profile of Line", "Profile of Surface",
  "Angularity", "Perpendicularity", "Parallelism", "Position", "Concentricity", "Coaxiality", "Symmetry",
  "Circular Runout", "Total Runout",
];
const AXES: { key: "x" | "y" | "z"; i: 0 | 1 | 2 }[] = [
  { key: "x", i: 0 },
  { key: "y", i: 1 },
  { key: "z", i: 2 },
];

const num = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v));

/** A representative point for a picked vertex/edge/face, from the same mesh data already in the viewer -
 * a vertex's exact point, or a face/edge's centroid (triangle-vertex / polyline average). A vertex-to-
 * vertex Linear Distance is therefore exact (to tessellation precision); face/edge ones are an estimate -
 * good enough for a starting nominal along one axis, not a substitute for the exact CAD measurement. */
function refPoint(ref: PickedRef, mesh: MeshData): [number, number, number] | null {
  if (ref.kind === "vertex") {
    const v = mesh.vertices.find((x) => x.vertex_id === ref.ref_id);
    return v ? v.point : null;
  }
  if (ref.kind === "face") {
    const fr = mesh.face_ranges.find((x) => x.face_id === ref.ref_id);
    if (!fr || !fr.index_count) return null;
    const verts = new Set(mesh.indices.slice(fr.index_start, fr.index_start + fr.index_count));
    let sx = 0, sy = 0, sz = 0;
    for (const vi of verts) {
      sx += mesh.positions[vi * 3];
      sy += mesh.positions[vi * 3 + 1];
      sz += mesh.positions[vi * 3 + 2];
    }
    return [sx / verts.size, sy / verts.size, sz / verts.size];
  }
  const e = mesh.edges.find((x) => x.edge_id === ref.ref_id);
  if (!e || !e.points.length) return null;
  const n = e.points.length / 3;
  let sx = 0, sy = 0, sz = 0;
  for (let i = 0; i < n; i++) {
    sx += e.points[i * 3];
    sy += e.points[i * 3 + 1];
    sz += e.points[i * 3 + 2];
  }
  return [sx / n, sy / n, sz / n];
}

export default function PmiModal({ model, mesh, editing, pickedRefs, pickTarget, onPickTargetChange, onClose, onSaved, onClearPicks, docked }: Props) {
  const [dimTypes, setDimTypes] = useState<string[]>(DIM_TYPES);
  const [tolTypes, setTolTypes] = useState<string[]>(TOL_TYPES);
  // In edit mode the kind is fixed: a dimension and a geometric tolerance are different XCAF entities,
  // so one can't be turned into the other - only the type within the kind is changeable.
  const [kind, setKind] = useState<Kind>(editing?.kind ?? "geom_tolerance");
  const [typeLabel, setTypeLabel] = useState(editing?.type_label ?? TOL_TYPES[0]);
  const [featureName, setFeatureName] = useState(editing?.feature_name ?? "");
  const [nominal, setNominal] = useState(editing ? String(editing.nominal) : "0");
  const [usl, setUsl] = useState(editing ? num(editing.usl) : "");
  const [lsl, setLsl] = useState(editing ? num(editing.lsl) : "");
  const [value, setValue] = useState(editing?.kind === "geom_tolerance" ? num(editing.usl) : "0.1");
  const [datumRefs, setDatumRefs] = useState<string[]>(editing?.datum_refs ?? []);
  const [axis, setAxis] = useState<"x" | "y" | "z">("x");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const types = kind === "dimension" ? dimTypes : tolTypes;
  // Editing keeps the existing geometry when nothing is picked, so only adding requires a pick.
  const hasRefs = pickedRefs.length >= 1 || !!editing;
  const canSubmit = hasRefs && (kind === "dimension" ? nominal.trim() !== "" : value.trim() !== "");
  const isLinearDistance = kind === "dimension" && typeLabel === "Linear Distance";
  // A characteristic read out of a file can have a type the writer can't author (e.g. "Linear Size"),
  // which the dropdown therefore doesn't offer - it has to be changed to a writable one to save.
  const typeUnwritable = !!editing && !types.includes(editing.type_label);

  // Exact overall extents from the model's bounding box - useful for the common "overall length/height"
  // dimension when the extreme sits on a curved/smooth surface with no vertex to pick precisely.
  const extents = AXES.map(({ i }) => model.bbox.max[i] - model.bbox.min[i]);

  // Replace the fallback lists with exactly the types the backend can author. Keep the current
  // selection if it survived the filter, otherwise snap to the first offered type of this kind.
  useEffect(() => {
    let live = true;
    fetchPmiTypes()
      .then((t) => {
        if (!live) return;
        if (t.dimension.length) setDimTypes(t.dimension);
        if (t.geom_tolerance.length) setTolTypes(t.geom_tolerance);
        const current = kind === "dimension" ? t.dimension : t.geom_tolerance;
        if (current.length && !current.includes(typeLabel)) setTypeLabel(current[0]);
      })
      .catch(() => {/* keep fallback lists */});
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill the nominal from the two picked refs' geometry along the chosen axis, and default the
  // axis to whichever one actually separates them (largest coordinate difference) - the user only
  // needs to type the tolerance. Still fully editable afterwards.
  useEffect(() => {
    if (!isLinearDistance || !mesh || pickedRefs.length !== 2) return;
    const p1 = refPoint(pickedRefs[0], mesh);
    const p2 = refPoint(pickedRefs[1], mesh);
    if (!p1 || !p2) return;
    const diffs = AXES.map(({ i }) => Math.abs(p1[i] - p2[i]));
    setAxis((cur) => (diffs[AXES.findIndex((a) => a.key === cur)] > 1e-6 ? cur : AXES[diffs.indexOf(Math.max(...diffs))].key));
  }, [isLinearDistance, mesh, pickedRefs]);

  useEffect(() => {
    if (!isLinearDistance || !mesh || pickedRefs.length !== 2) return;
    const p1 = refPoint(pickedRefs[0], mesh);
    const p2 = refPoint(pickedRefs[1], mesh);
    if (!p1 || !p2) return;
    const i = AXES.find((a) => a.key === axis)!.i;
    setNominal(Math.abs(p1[i] - p2[i]).toFixed(3));
  }, [isLinearDistance, mesh, pickedRefs, axis]);

  const toggleDatum = (label: string) => setDatumRefs((refs) => (refs.includes(label) ? refs.filter((r) => r !== label) : [...refs, label]));

  const onSubmit = async () => {
    setBusy(true);
    setError(null);
    try {
      const common = {
        type_label: typeLabel,
        feature_name: featureName.trim(),
        nominal: kind === "dimension" ? Number(nominal) || 0 : 0,
        usl: kind === "dimension" && usl.trim() !== "" ? Number(usl) : null,
        lsl: kind === "dimension" && lsl.trim() !== "" ? Number(lsl) : null,
        value: kind === "geom_tolerance" ? Number(value) || 0 : null,
        datum_refs: datumRefs,
      };
      const updated = editing
        ? await editPmi(model.model_id, editing.id, { ...common, refs: pickedRefs })
        : await addPmi(model.model_id, { ...common, kind, refs: pickedRefs });
      onClearPicks();
      onSaved(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  // A floating panel, not a full-screen modal: picking faces requires clicking through to the 3D
  // viewer underneath while this is open, so (unlike MetadataModal) there's no blocking backdrop.
  return (
    <div
      className={
        docked
          ? "cam-function-panel h-full overflow-auto bg-slate-900"
          : "fixed right-4 top-16 z-40 max-h-[85vh] w-96 overflow-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl"
      }
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {editing ? `Edit ${editing.id} · ${editing.type_label}` : "Add GD&T Characteristic"}
            </h2>
            <p className="text-xs text-slate-400">
              {editing
                ? "Rewrites this characteristic in the model's STEP file. Whatever is left blank here is cleared, not kept."
                : "Writes a new dimension or geometric tolerance into the model's STEP file."}
            </p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-4 p-4">
          <section className="rounded border border-slate-700 p-3">
            <div className="text-xs font-medium text-slate-300">Vertex(es) / edge(s) / face(s)</div>
            <p className="mt-0.5 text-xs text-slate-400">
              Click a vertex (the small dots at corners/hole centers), an edge or a face on the model in the 3D view to pick it (a 2nd click picks a second
              one, for a two-reference location dimension). Hover shows a preview in blue before you click. Use the Front/Top/Right… buttons (top-right of
              the 3D view) to look straight along an axis if a target is hard to hit.
            </p>
            <div className="mt-2 flex gap-1">
              {(["auto", "vertex", "edge", "face"] as PickTarget[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onPickTargetChange(t)}
                  className={`rounded px-2 py-0.5 text-xs ${pickTarget === t ? "bg-blue-600 text-white" : "border border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  title={
                    t === "auto"
                      ? "A nearby vertex wins, then a nearby edge, otherwise the face"
                      : t === "vertex"
                        ? "Only vertices can be picked"
                        : t === "edge"
                          ? "Only edges can be picked"
                          : "Only faces can be picked"
                  }
                >
                  {t === "auto" ? "Auto" : t === "vertex" ? "Vertices only" : t === "edge" ? "Edges only" : "Faces only"}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {pickedRefs.length === 0 &&
                (editing ? (
                  <span className="text-xs text-slate-400">
                    Keeping the current geometry
                    {editing.face_ids.length ? ` (face ${editing.face_ids.join(", ")})` : " (not linked to any face)"} — pick to re-point it.
                  </span>
                ) : (
                  <span className="text-xs text-amber-400">Nothing picked yet</span>
                ))}
              {pickedRefs.map((r) => (
                <span key={`${r.kind}-${r.ref_id}`} className="rounded bg-amber-900/60 px-2 py-0.5 text-xs text-amber-300">
                  {r.kind} {r.ref_id}
                </span>
              ))}
              {pickedRefs.length > 0 && (
                <button onClick={onClearPicks} className="text-xs text-slate-400 underline">
                  clear
                </button>
              )}
            </div>
          </section>

          <label className="block">
            <span className="text-xs text-slate-300">Kind</span>
            <select
              value={kind}
              disabled={!!editing}
              title={editing ? "A dimension can't be changed into a geometric tolerance — delete and re-add instead" : undefined}
              onChange={(e) => {
                const k = e.target.value as Kind;
                setKind(k);
                setTypeLabel((k === "dimension" ? dimTypes : tolTypes)[0]);
              }}
              className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:opacity-60"
            >
              <option value="geom_tolerance">Geometric tolerance</option>
              <option value="dimension">Dimension</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-300">Type</span>
            <select value={typeLabel} onChange={(e) => setTypeLabel(e.target.value)} className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100">
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {typeUnwritable && (
              <span className="mt-1 block text-[11px] text-amber-400">
                This characteristic's original type ({editing!.type_label}) can't be written back by the STEP writer — saving will change it to the type
                selected above.
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-xs text-slate-300">Feature name (optional)</span>
            <input value={featureName} onChange={(e) => setFeatureName(e.target.value)} className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100" />
            <span className="mt-1 block text-[11px] text-slate-500">
              Best effort: OCCT's STEP writer mangles PMI names on write, so this may come back shortened.
            </span>
          </label>

          {isLinearDistance && pickedRefs.length === 2 && (
            <div className="rounded border border-slate-700 bg-slate-800/50 p-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Axis</span>
                {AXES.map(({ key }) => (
                  <button
                    key={key}
                    onClick={() => setAxis(key)}
                    className={`rounded px-2 py-0.5 text-xs uppercase ${axis === key ? "bg-blue-600 text-white" : "border border-slate-700 text-slate-300 hover:bg-slate-700"}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Nominal below is the distance between the two picked refs along this axis
                {pickedRefs.every((r) => r.kind === "vertex") ? " (exact, both are vertices)" : " (an estimate - pick vertices instead of faces/edges for an exact point-to-point distance)"}
                - edit it if it's not quite what you meant.
              </p>
            </div>
          )}

          {kind === "dimension" && (
            <div className="rounded border border-slate-700 bg-slate-800/50 p-2">
              <div className="text-[11px] text-slate-400">
                Overall size (model bounding box) — click to use as the nominal when the extreme has no vertex to pick:
              </div>
              <div className="mt-1 flex gap-1">
                {AXES.map(({ key, i }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setNominal(extents[i].toFixed(3));
                      if (isLinearDistance) setAxis(key);
                    }}
                    className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-700"
                    title={`Set nominal to the overall ${key.toUpperCase()} extent`}
                  >
                    {key.toUpperCase()} {extents[i].toFixed(2)} mm
                  </button>
                ))}
              </div>
            </div>
          )}

          {kind === "dimension" ? (
            <div className="grid grid-cols-3 gap-2">
              <label className="block">
                <span className="text-xs text-slate-300">Nominal</span>
                <input value={nominal} onChange={(e) => setNominal(e.target.value)} className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100" />
              </label>
              <label className="block">
                <span className="text-xs text-slate-300">LSL</span>
                <input value={lsl} onChange={(e) => setLsl(e.target.value)} placeholder="optional" className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100" />
              </label>
              <label className="block">
                <span className="text-xs text-slate-300">USL</span>
                <input value={usl} onChange={(e) => setUsl(e.target.value)} placeholder="optional" className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100" />
              </label>
            </div>
          ) : (
            <label className="block w-32">
              <span className="text-xs text-slate-300">Zone value</span>
              <input value={value} onChange={(e) => setValue(e.target.value)} className="mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100" />
            </label>
          )}

          {model.datums.length > 0 && (
            <div>
              <span className="text-xs text-slate-300">Datum reference(s) (must already exist on this model)</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {model.datums.map((d) => (
                  <label key={d.label} className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-200">
                    <input type="checkbox" checked={datumRefs.includes(d.label)} onChange={() => toggleDatum(d.label)} />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-4 py-3">
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800">
            {editing ? "Cancel" : "Close"}
          </button>
          <button
            onClick={onSubmit}
            disabled={busy || !canSubmit}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {busy ? "Writing…" : editing ? "Save changes" : "Add to model"}
          </button>
        </div>
      </div>
    </div>
  );
}
