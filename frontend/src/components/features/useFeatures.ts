import { useCallback, useMemo, useState } from "react";
import type { Feature, ModelSummary } from "../../types";

/** State of the Features workspace: the recognized features of a part and the selected one. */
export function useFeatures(model: ModelSummary | null) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPlanes, setShowPlanes] = useState(false);
  const [lastModel, setLastModel] = useState<string | null>(null);
  if ((model?.model_id ?? null) !== lastModel) {
    setLastModel(model?.model_id ?? null);
    setSelectedId(null);
  }
  const all = model?.features ?? [];
  const features = useMemo(() => all.filter((f) => f.state !== "rejected" && (showPlanes || f.type !== "plane")), [all, showPlanes]);
  const selected: Feature | null = all.find((f) => f.id === selectedId) ?? null;

  // a click on a face selects the feature that owns it (a machined feature before a plane)
  const owner = useMemo(() => {
    const m = new Map<number, string>();
    for (const f of [...all].sort((a, b) => Number(a.type === "plane") - Number(b.type === "plane"))) for (const id of f.face_ids) if (!m.has(id)) m.set(id, f.id);
    return m;
  }, [all]);
  const selectFace = useCallback((faceId: number | null) => setSelectedId(faceId === null ? null : (owner.get(faceId) ?? null)), [owner]);
  return { features, selected, selectedId, setSelectedId, selectFace, showPlanes, setShowPlanes, planeCount: all.filter((f) => f.type === "plane").length };
}

export type FeaturesState = ReturnType<typeof useFeatures>;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** "Ø8 thru", "20 × 20 × 10 deep", "R6 × 130": the size a feature states, short. */
export function sizeOf(f: Feature): string {
  const p = f.params;
  const parts: string[] = [];
  if (num(p.diameter) !== null) parts.push(`Ø${num(p.diameter)!.toFixed(2).replace(/\.?0+$/, "")}`);
  else if (num(p.radius) !== null) parts.push(`R${num(p.radius)!.toFixed(2).replace(/\.?0+$/, "")}`);
  if (f.type !== "hole") for (const k of ["width", "length", "height"]) if (num(p[k]) !== null) parts.push(num(p[k])!.toFixed(2).replace(/\.?0+$/, ""));
  if (num(p.depth) !== null) parts.push(p.through ? "thru" : `${num(p.depth)!.toFixed(2).replace(/\.?0+$/, "")} deep`);
  return parts.join(" × ");
}

export function labelOf(f: Feature): string {
  const s = (f.mf_class ?? f.type).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
