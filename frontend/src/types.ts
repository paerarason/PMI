export type Kind = "dimension" | "geom_tolerance";
export type Status = "PASS" | "FAIL" | "PENDING";
export type RefKind = "face" | "edge" | "vertex";
export interface PickedRef {
  kind: RefKind;
  ref_id: number;
}

export interface Characteristic {
  id: string;
  index: number;
  kind: Kind;
  feature_name: string;
  type_label: string;
  symbol: string;
  requirement: string;
  nominal: number;
  usl: number | null;
  lsl: number | null;
  unit: string;
  datum_refs: string[];
  modifiers: string[];
  face_ids: number[];
  /** Geometric feature the characteristic sits on + whether material is inside ("external") or outside
   * ("internal") the toleranced surface, inferred by the backend feature_classifier. Null when it
   * couldn't be classified. */
  feature_type: string | null;
  material_side: string | null;
  anchor: [number, number, number] | null;
  label_pos: [number, number, number] | null;
  source: string;
  /** Handle the backend needs to rewrite this characteristic in place; null for PMI that was recovered
   * from the STEP text rather than read from XCAF, which therefore can't be edited. */
  xcaf_index: number | null;
}

export interface Datum {
  label: string;
  face_ids: number[];
  anchor: [number, number, number] | null;
  label_pos: [number, number, number] | null;
}

export interface ModelSummary {
  model_id: string;
  file_name: string;
  part_name: string;
  schema: string;
  header: Record<string, string>;
  bbox: { min: [number, number, number]; max: [number, number, number] };
  characteristics: Characteristic[];
  datums: Datum[];
  pmi_source: string;
  face_count: number;
  warnings: string[];
  /** The recognized machining features (planes included), as the backend's recognizer reports them. */
  features: Feature[];
  feature_count: number;
}

/** One recognized feature (GET /features). `params` is type-specific (diameter, depth, axis, …). */
export interface Feature {
  id: string;
  type: string;
  mf_class: string | null;
  face_ids: number[];
  params: Record<string, unknown>;
  confidence: number;
  evidence: string[];
  state: string;
  recognition_method: string;
  alternatives: { label: string; type: string; confidence: number | null; method: string; reason: string }[];
  ambiguous: boolean;
}


/** Typed arrays when the mesh came as GET /mesh.bin (api.fetchMesh), plain arrays from the JSON fallback. */
export interface MeshData {
  positions: Float32Array | number[];
  normals: Float32Array | number[];
  indices: Uint32Array | number[];
  face_ranges: { face_id: number; index_start: number; index_count: number }[];
  edges: { edge_id: number; points: Float32Array | number[] }[];
  vertices: { vertex_id: number; point: [number, number, number] }[];
}

export interface PmiWritePayload {
  type_label: string;
  feature_name?: string;
  nominal?: number;
  usl?: number | null; // dimension only
  lsl?: number | null; // dimension only
  value?: number | null; // geom_tolerance only (the tolerance zone)
  datum_refs?: string[];
}

export interface PmiAddPayload extends PmiWritePayload {
  kind: Kind;
  refs: PickedRef[];
}

/** Everything sent replaces what's on the characteristic now - an omitted limit or datum ref clears it,
 * so always send the full intended state. `kind` isn't editable; an empty `refs` keeps the geometry the
 * characteristic already references. */
export interface PmiEditPayload extends PmiWritePayload {
  refs: PickedRef[];
}
