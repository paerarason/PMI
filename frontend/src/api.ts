import type { MeshData, ModelSummary, PmiAddPayload, PmiEditPayload } from "./types";

async function check<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
    } catch {
      /* ignore */
    }
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function uploadStep(file: File): Promise<ModelSummary> {
  const fd = new FormData();
  fd.append("file", file);
  return check(await fetch("/api/models", { method: "POST", body: fd }));
}

export interface BlankModelParams {
  width: number;
  depth: number;
  height: number;
  hole_dia?: number;
  name?: string;
}

export async function createBlank(params: BlankModelParams): Promise<ModelSummary> {
  const q = new URLSearchParams({
    width: String(params.width),
    depth: String(params.depth),
    height: String(params.height),
    hole_dia: String(params.hole_dia ?? 0),
  });
  if (params.name) q.set("name", params.name);
  return check(await fetch(`/api/models/blank?${q.toString()}`, { method: "POST" }));
}

export async function listSamples(): Promise<string[]> {
  return check(await fetch("/api/models/samples"));
}

export async function loadSample(name: string): Promise<ModelSummary> {
  return check(await fetch(`/api/models/samples/${encodeURIComponent(name)}`, { method: "POST" }));
}

/** The mesh, from the binary GET /mesh.bin (backend tessellator.pack_mesh), falling back to the JSON one. */
export async function fetchMesh(modelId: string): Promise<MeshData> {
  const res = await fetch(`/api/models/${modelId}/mesh.bin`);
  if (res.ok) {
    try {
      return parseMesh(await res.arrayBuffer());
    } catch {
      /* an unexpected blob: fall through to JSON */
    }
  }
  return check(await fetch(`/api/models/${modelId}/mesh`));
}

/** Read the PMIM blob: magic, version, a JSON header, then 4-byte aligned little-endian buffers. */
export function parseMesh(buf: ArrayBuffer): MeshData {
  const dv = new DataView(buf);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== "PMIM" || dv.getUint32(4, true) !== 1) throw new Error("not a PMIM v1 mesh");
  const headLen = dv.getUint32(8, true);
  const head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 12, headLen)));
  const b = head.buffers as Record<string, { offset: number; count: number; type: "f32" | "u32" }>;
  const f32 = (n: string) => new Float32Array(buf, b[n].offset, b[n].count);
  const edgePoints = f32("edge_points");
  return {
    positions: f32("positions"),
    normals: f32("normals"),
    indices: new Uint32Array(buf, b.indices.offset, b.indices.count),
    face_ranges: head.face_ranges,
    vertices: head.vertices,
    edges: (head.edges as { edge_id: number; start: number; count: number }[]).map((e) => ({ edge_id: e.edge_id, points: edgePoints.subarray(e.start, e.start + e.count) })),
  };
}

export interface PmiTypes {
  dimension: string[];
  geom_tolerance: string[];
}

export async function fetchPmiTypes(): Promise<PmiTypes> {
  return check(await fetch("/api/models/pmi/types"));
}

export async function addPmi(modelId: string, payload: PmiAddPayload): Promise<ModelSummary> {
  return check(
    await fetch(`/api/models/${modelId}/pmi`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
  );
}

export async function editPmi(modelId: string, characteristicId: string, payload: PmiEditPayload): Promise<ModelSummary> {
  return check(
    await fetch(`/api/models/${modelId}/pmi/${encodeURIComponent(characteristicId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function downloadStepFile(modelId: string, fileName: string): Promise<void> {
  const res = await fetch(`/api/models/${modelId}/file`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** URL of the 2D drawing sheet; the model id changes with every write, so the URL is never stale. */
export const drawingUrl = (modelId: string, format: "svg" | "dxf" = "svg") => `/api/models/${modelId}/drawing.${format}`;

/** Save a file the server renders (the drawing as DXF) through a temporary link. */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
