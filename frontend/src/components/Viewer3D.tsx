import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type { Theme } from "../theme";
import type { Characteristic, Datum, MeshData, ModelSummary, PickedRef, RefKind, Status } from "../types";

export type PickTarget = "auto" | "vertex" | "edge" | "face";
export type ViewName = "iso" | "front" | "back" | "top" | "bottom" | "left" | "right";

interface Props {
  model: ModelSummary | null;
  mesh: MeshData | null;
  statuses: Record<string, Status>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** When set, clicking a face or edge calls onPickRef(kind, id) instead of selecting a characteristic. */
  pickMode?: boolean;
  /** "vertex"/"edge"/"face" makes that the only thing a click (and hover preview) can land on - "auto"
   * (default) prefers a nearby vertex, then a nearby edge, falling back to the face otherwise. */
  pickTarget?: PickTarget;
  pickedRefs?: PickedRef[];
  onPickRef?: (kind: RefKind, id: number) => void;
  theme?: Theme;
  /** Imperative access for toolbars that live outside the viewer (the CAM ribbon's View tab). */
  handle?: Ref<ViewerHandle>;
  /** Model-space point under the cursor (null when it's off the part) - throttled to once per frame. */
  onCursor?: (p: [number, number, number] | null) => void;
  onViewChange?: (view: ViewName) => void;
  /** Faces to highlight instead of the selected characteristic's (feature review). */
  highlightFaces?: number[] | null;
  /** When set, a click reports the face under the cursor (null: off the part) instead of selecting PMI. */
  onFaceClick?: (faceId: number | null) => void;
  /** Hide balloons and datum flags (feature review shows features, not PMI). */
  hidePmi?: boolean;
  /** Fly the camera to these faces whenever the set changes, looking at them from outside (feature review). */
  focusFaces?: number[] | null;
}

export interface ViewerHandle {
  setView: (view: ViewName) => void;
}

// Axis-aligned view direction (camera -> target) and up vector, in this app's Z-up world.
const VIEW_DIRS: Record<Exclude<ViewName, "iso">, { dir: [number, number, number]; up: [number, number, number] }> = {
  front: { dir: [0, -1, 0], up: [0, 0, 1] },
  back: { dir: [0, 1, 0], up: [0, 0, 1] },
  left: { dir: [-1, 0, 0], up: [0, 0, 1] },
  right: { dir: [1, 0, 0], up: [0, 0, 1] },
  top: { dir: [0, 0, 1], up: [0, 1, 0] },
  bottom: { dir: [0, 0, -1], up: [0, -1, 0] },
};

interface SceneRefs {
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  modelGroup: THREE.Group;
  pmiGroup: THREE.Group;
  highlightGroup: THREE.Group;
  grid: THREE.GridHelper;
  partMesh: THREE.Mesh | null;
  edgeLines: { line: THREE.Line; edgeId: number }[];
  vertexPoints: { mesh: THREE.Mesh; vertexId: number }[];
  balloons: Map<string, { obj: CSS2DObject; el: HTMLDivElement; leader: THREE.Line }>;
  raycaster: THREE.Raycaster;
  hoverHighlight: THREE.Object3D | null;
  edgeMat: THREE.LineBasicMaterial | null;
  wcs: THREE.AxesHelper;
  hemi: THREE.HemisphereLight;
  setView: (view: ViewName) => void;
  /** Animate the camera to frame `box`, looking along `dir` (camera → target). */
  focus: (box: THREE.Box3, dir: THREE.Vector3) => void;
  dispose: () => void;
}

const GRID_COLOR_MAJOR = 0x475569;
const GRID_COLOR_MINOR = 0x2a3646;
const PICKED_COLOR = 0xf59e0b;
const VERTEX_COLOR = 0xe2e8f0;

/** Per-theme scene look. Studio ("cam"): no scene background (the container's dark CSS gradient shows
 * through the transparent canvas), no grid, light steel solid with crisp dark edges, blue selection. */
const PALETTES: Record<Theme, {
  background: number | null;
  grid: boolean;
  body: number;
  /** hemisphere-light ground colour: how bright down/away-facing faces stay */
  ground: number;
  metalness: number;
  roughness: number;
  edge: number;
  edgeOpacity: number;
  select: number;
  hover: number;
}> = {
  classic: { background: 0x0f172a, grid: true, body: 0xaab4c4, ground: 0x1e293b, metalness: 0.15, roughness: 0.55, edge: 0x0f172a, edgeOpacity: 0.65, select: 0x3b82f6, hover: 0x38bdf8 },
  cam: { background: null, grid: false, body: 0xc6ccd4, ground: 0x3a424c, metalness: 0.15, roughness: 0.45, edge: 0x0b0e12, edgeOpacity: 0.85, select: 0x4d8dff, hover: 0x7fd3ff },
};

function applyTheme(r: SceneRefs, theme: Theme) {
  const pal = PALETTES[theme];
  r.scene.background = pal.background === null ? null : new THREE.Color(pal.background);
  r.scene.fog = pal.background === null ? null : new THREE.Fog(pal.background, 400, 3000);
  r.grid.visible = pal.grid;
  r.wcs.visible = theme === "cam";
  r.hemi.groundColor.setHex(pal.ground);
  if (r.partMesh) {
    const mat = r.partMesh.material as THREE.MeshStandardMaterial;
    mat.color.setHex(pal.body);
    mat.metalness = pal.metalness;
    mat.roughness = pal.roughness;
  }
  if (r.edgeMat) {
    r.edgeMat.color.setHex(pal.edge);
    r.edgeMat.opacity = pal.edgeOpacity;
  }
}

/** A camera-facing text label for the orientation triad. */
function axisLabel(text: string, color: number): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 46px Segoe UI, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.fillText(text, 32, 34);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthTest: false }));
  sprite.scale.setScalar(0.5);
  return sprite;
}

/** Default (perspective, angled) framing - also what "iso" resets to. */
function fitCamera(refs: SceneRefs, bbox: ModelSummary["bbox"]) {
  const min = new THREE.Vector3(...bbox.min);
  const max = new THREE.Vector3(...bbox.max);
  const center = min.clone().add(max).multiplyScalar(0.5);
  const size = max.clone().sub(min).length() || 1;
  const cam = refs.camera;
  cam.fov = 40;
  cam.near = size / 100;
  cam.far = size * 20;
  cam.position.copy(center).add(new THREE.Vector3(size * 0.9, -size * 1.1, size * 0.8));
  cam.up.set(0, 0, 1);
  cam.lookAt(center);
  cam.updateProjectionMatrix();
  refs.controls.target.copy(center);
  refs.controls.update();
}

function statusClass(s: Status | undefined): string {
  return s === "PASS" ? "pass" : s === "FAIL" ? "fail" : "";
}

export default function Viewer3D({
  model,
  mesh,
  statuses,
  selectedId,
  onSelect,
  pickMode,
  pickTarget,
  pickedRefs,
  onPickRef,
  theme = "classic",
  handle,
  onCursor,
  onViewChange,
  highlightFaces = null,
  onFaceClick,
  hidePmi = false,
  focusFaces = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<SceneRefs | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const modelRef = useRef(model);
  modelRef.current = model;
  const meshRef = useRef(mesh);
  meshRef.current = mesh;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const pickModeRef = useRef(pickMode);
  pickModeRef.current = pickMode;
  const pickTargetRef = useRef<PickTarget>(pickTarget ?? "auto");
  pickTargetRef.current = pickTarget ?? "auto";
  const onPickRefRef = useRef(onPickRef);
  onPickRefRef.current = onPickRef;
  const themeRef = useRef<Theme>(theme);
  themeRef.current = theme;
  const onCursorRef = useRef(onCursor);
  onCursorRef.current = onCursor;
  const onViewChangeRef = useRef(onViewChange);
  onViewChangeRef.current = onViewChange;
  const onFaceClickRef = useRef(onFaceClick);
  onFaceClickRef.current = onFaceClick;

  useImperativeHandle(handle, () => ({ setView: (view: ViewName) => refs.current?.setView(view) }), []);

  // ---- scene bootstrap (once)
  useEffect(() => {
    const container = containerRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.inset = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.Fog(0x0f172a, 400, 3000);
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(150, -150, 120);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;

    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x1e293b, 1.3);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(1, -1.5, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xaec6ff, 0.5);
    fill.position.set(-1.5, 1, -0.5);
    scene.add(fill);

    // reference grid on the ground (XY) plane - three's GridHelper lies flat in XZ by default
    // (Y-up convention), so rotate 90° about X to lie in XY for this app's Z-up scene.
    const grid = new THREE.GridHelper(400, 40, GRID_COLOR_MAJOR, GRID_COLOR_MINOR);
    grid.rotation.x = Math.PI / 2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.6;
    scene.add(grid);

    // WCS marker at the model origin (CAM theme only - see applyTheme); rescaled per model.
    const wcs = new THREE.AxesHelper(1);
    wcs.visible = false;
    scene.add(wcs);

    // Orientation triad drawn into the bottom-left corner of the same canvas with its own ortho camera
    // that copies the main camera's viewing direction.
    const triadScene = new THREE.Scene();
    const triadCam = new THREE.OrthographicCamera(-1.7, 1.7, 1.7, -1.7, 0.1, 20);
    const axes: [THREE.Vector3, number, string][] = [
      [new THREE.Vector3(1, 0, 0), 0xd62828, "X"],
      [new THREE.Vector3(0, 1, 0), 0x2b9348, "Y"],
      [new THREE.Vector3(0, 0, 1), 0x1d4ed8, "Z"],
    ];
    for (const [dir, color, label] of axes) {
      triadScene.add(new THREE.ArrowHelper(dir, new THREE.Vector3(), 1, color, 0.32, 0.18));
      const sprite = axisLabel(label, color);
      sprite.position.copy(dir).multiplyScalar(1.38);
      triadScene.add(sprite);
    }
    const TRIAD_PX = 96;
    const canvasSize = new THREE.Vector2();

    const modelGroup = new THREE.Group();
    const pmiGroup = new THREE.Group();
    const highlightGroup = new THREE.Group();
    scene.add(modelGroup, pmiGroup, highlightGroup);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Line = { threshold: 1 }; // world units; rescaled per-model in the geometry-rebuild effect
    let animId = 0;
    let tween: { p0: THREE.Vector3; p1: THREE.Vector3; t0: THREE.Vector3; t1: THREE.Vector3; start: number } | null = null;
    controls.addEventListener("start", () => {
      tween = null; // the user took the camera
    });
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (tween) {
        const t = Math.min(1, (performance.now() - tween.start) / 450);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        camera.position.lerpVectors(tween.p0, tween.p1, e);
        controls.target.lerpVectors(tween.t0, tween.t1, e);
        if (t >= 1) tween = null;
      }
      controls.update();
      renderer.render(scene, camera);
      if (themeRef.current === "cam") {
        renderer.getSize(canvasSize);
        triadCam.position.copy(camera.position).sub(controls.target).normalize().multiplyScalar(5);
        triadCam.up.copy(camera.up);
        triadCam.lookAt(0, 0, 0);
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(6, 6, TRIAD_PX, TRIAD_PX);
        renderer.setViewport(6, 6, TRIAD_PX, TRIAD_PX);
        renderer.render(triadScene, triadCam);
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, canvasSize.x, canvasSize.y);
        renderer.autoClear = true;
      }
      labelRenderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    const ndcFromEvent = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      return new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    };

    // Resolve a screen point to a picked vertex/edge/face, honoring pickTarget (a specific kind restricts
    // to just that kind - a click that misses just does nothing rather than falling back to another kind;
    // "auto" prefers the smallest/nearest target: a nearby vertex wins, then a nearby edge, falling back
    // to whatever face is under the cursor). Shared by the click handler and the hover-preview handler.
    const resolvePick = (ndc: THREE.Vector2): { kind: RefKind; id: number } | null => {
      const r = refs.current;
      if (!r || !r.partMesh) return null;
      raycaster.setFromCamera(ndc, camera);
      if (pickTargetRef.current !== "edge" && pickTargetRef.current !== "face" && r.vertexPoints.length) {
        const vertexHits = raycaster.intersectObjects(
          r.vertexPoints.map((x) => x.mesh),
          false,
        );
        if (vertexHits.length) {
          const hit = vertexHits.sort((a, b) => a.distance - b.distance)[0].object;
          const vertexId = r.vertexPoints.find((x) => x.mesh === hit)?.vertexId;
          if (vertexId !== undefined) return { kind: "vertex", id: vertexId };
        }
      }
      if (pickTargetRef.current === "vertex") return null;
      if (pickTargetRef.current !== "face" && r.edgeLines.length) {
        const edgeHits = raycaster.intersectObjects(
          r.edgeLines.map((x) => x.line),
          false,
        );
        if (edgeHits.length) {
          const hitLine = edgeHits.sort((a, b) => a.distance - b.distance)[0].object;
          const edgeId = r.edgeLines.find((x) => x.line === hitLine)?.edgeId;
          if (edgeId !== undefined) return { kind: "edge", id: edgeId };
        }
      }
      if (pickTargetRef.current === "edge") return null;
      const hits = raycaster.intersectObject(r.partMesh, false);
      if (!hits.length || hits[0].faceIndex === undefined) return null;
      const faceId = (r.partMesh.userData.faceLookup as (i: number) => number)(hits[0].faceIndex ?? -1);
      return faceId >= 0 ? { kind: "face", id: faceId } : null;
    };

    // cursor read-out: at most one part raycast per animation frame
    let cursorEvt: PointerEvent | null = null;
    let cursorRaf = 0;
    const reportCursor = (e: PointerEvent) => {
      cursorEvt = e;
      if (cursorRaf) return;
      cursorRaf = requestAnimationFrame(() => {
        cursorRaf = 0;
        const r = refs.current;
        if (!r?.partMesh || !cursorEvt) return onCursorRef.current?.(null);
        raycaster.setFromCamera(ndcFromEvent(cursorEvt), camera);
        const hit = raycaster.intersectObject(r.partMesh, false)[0];
        onCursorRef.current?.(hit ? [hit.point.x, hit.point.y, hit.point.z] : null);
      });
    };

    const clearHover = () => {
      const r = refs.current;
      if (!r?.hoverHighlight) return;
      r.pmiGroup.remove(r.hoverHighlight);
      r.hoverHighlight = null;
    };

    // click-to-select on faces (ignore drags); in pick mode, resolvePick() decides face vs edge.
    let downPos: [number, number] | null = null;
    const onDown = (e: PointerEvent) => (downPos = [e.clientX, e.clientY]);
    const onMove = (e: PointerEvent) => {
      if (onCursorRef.current) reportCursor(e);
      const r = refs.current;
      const mm = meshRef.current;
      if (!r || !pickModeRef.current) return;
      const pick = resolvePick(ndcFromEvent(e));
      clearHover();
      if (!pick || !mm) return;
      const HOVER_COLOR = PALETTES[themeRef.current].hover;
      if (pick.kind === "vertex") {
        const v = mm.vertices.find((x) => x.vertex_id === pick.id);
        if (!v) return;
        const src = r.vertexPoints.find((x) => x.vertexId === pick.id)?.mesh;
        const radius = (src?.geometry as THREE.SphereGeometry | undefined)?.parameters.radius ?? 0.5;
        const m = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.6), new THREE.MeshBasicMaterial({ color: HOVER_COLOR, depthTest: false }));
        m.position.set(...v.point);
        m.renderOrder = 14;
        r.hoverHighlight = m;
        r.pmiGroup.add(m);
      } else if (pick.kind === "face" && r.partMesh) {
        const fr = mm.face_ranges.find((x) => x.face_id === pick.id);
        if (!fr || !fr.index_count) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", r.partMesh.geometry.getAttribute("position"));
        g.setIndex(new THREE.Uint32BufferAttribute(mm.indices.slice(fr.index_start, fr.index_start + fr.index_count), 1));
        const m = new THREE.Mesh(
          g,
          new THREE.MeshBasicMaterial({ color: HOVER_COLOR, transparent: true, opacity: 0.45, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, depthWrite: false }),
        );
        r.hoverHighlight = m;
        r.pmiGroup.add(m);
      } else if (pick.kind === "edge") {
        const e2 = mm.edges.find((x) => x.edge_id === pick.id);
        if (!e2) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(e2.points, 3));
        const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: HOVER_COLOR, depthTest: false }));
        line.renderOrder = 13;
        r.hoverHighlight = line;
        r.pmiGroup.add(line);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!downPos || Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]) > 4) return;
      const r = refs.current;
      const m = modelRef.current;
      if (!r || !r.partMesh || !m) return;
      const ndc = ndcFromEvent(e);

      if (pickModeRef.current) {
        const pick = resolvePick(ndc);
        if (pick) onPickRefRef.current?.(pick.kind, pick.id);
        return;
      }

      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObject(r.partMesh, false);
      if (!hits.length || hits[0].faceIndex === undefined) {
        if (onFaceClickRef.current) onFaceClickRef.current(null);
        else onSelectRef.current(null);
        return;
      }
      const faceId = (r.partMesh.userData.faceLookup as (i: number) => number)(hits[0].faceIndex ?? -1);
      if (onFaceClickRef.current) {
        onFaceClickRef.current(faceId);
        return;
      }
      const candidates = m.characteristics.filter((c) => c.face_ids.includes(faceId));
      if (!candidates.length) {
        onSelectRef.current(null);
        return;
      }
      // cycle through characteristics sharing the same face on repeated clicks
      const cur = candidates.findIndex((c) => c.id === selectedRef.current);
      onSelectRef.current(candidates[(cur + 1) % candidates.length].id);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", clearHover);
    const onLeave = () => {
      cancelAnimationFrame(cursorRaf);
      cursorRaf = 0;
      onCursorRef.current?.(null);
    };
    renderer.domElement.addEventListener("pointerleave", onLeave);

    // Axis-locked "view" buttons: reorient the (single) perspective camera straight down an axis and
    // narrow its FOV a long way out - a cheap near-orthographic look (no separate camera/frustum
    // bookkeeping) that removes the foreshortening which makes it hard to tell which edge you're
    // about to click. "iso" restores the normal angled/wide-FOV framing via fitCamera.
    const setView = (view: ViewName) => {
      const m = modelRef.current;
      if (!m) return;
      onViewChangeRef.current?.(view);
      if (view === "iso") {
        fitCamera(refs.current!, m.bbox);
        return;
      }
      const min = new THREE.Vector3(...m.bbox.min);
      const max = new THREE.Vector3(...m.bbox.max);
      const center = min.clone().add(max).multiplyScalar(0.5);
      const size = max.clone().sub(min).length() || 1;
      const { dir, up } = VIEW_DIRS[view];
      camera.fov = 2; // narrow FOV + far distance ~= orthographic, without a second camera type
      camera.near = size * 5;
      camera.far = size * 200;
      camera.position.copy(center).addScaledVector(new THREE.Vector3(...dir), size * 50);
      camera.up.set(...up);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      controls.update();
    };

    const focus = (box: THREE.Box3, dir: THREE.Vector3) => {
      const m = modelRef.current;
      const diag = m ? new THREE.Vector3(...m.bbox.max).sub(new THREE.Vector3(...m.bbox.min)).length() : 1;
      const center = box.getCenter(new THREE.Vector3());
      const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, diag * 0.08);
      let dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.5;
      if (m) {
        // stay outside the part: a feature in a cavity is then seen through the x-ray highlight, not from inside a wall
        const part = new THREE.Box3(new THREE.Vector3(...m.bbox.min), new THREE.Vector3(...m.bbox.max)).expandByScalar(diag * 0.05);
        const exit = new THREE.Ray(center.clone().addScaledVector(dir, diag * 4), dir.clone().negate()).intersectBox(part, new THREE.Vector3());
        if (exit) dist = Math.max(dist, exit.distanceTo(center));
      }
      camera.near = Math.max(dist / 200, diag / 2000);
      camera.far = dist + diag * 20;
      camera.updateProjectionMatrix();
      tween = { p0: camera.position.clone(), p1: center.clone().addScaledVector(dir, dist), t0: controls.target.clone(), t1: center, start: performance.now() };
    };

    refs.current = {
      renderer,
      labelRenderer,
      scene,
      camera,
      controls,
      modelGroup,
      pmiGroup,
      highlightGroup,
      grid,
      partMesh: null,
      edgeLines: [],
      vertexPoints: [],
      balloons: new Map(),
      raycaster,
      hoverHighlight: null,
      edgeMat: null,
      wcs,
      hemi,
      setView,
      focus,
      dispose: () => {
        cancelAnimationFrame(animId);
        cancelAnimationFrame(cursorRaf);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerleave", clearHover);
        renderer.domElement.removeEventListener("pointerleave", onLeave);
        controls.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        labelRenderer.domElement.remove();
      },
    };
    return () => refs.current?.dispose();
  }, []);

  // ---- rebuild geometry + balloons when a model/mesh arrives
  useEffect(() => {
    const r = refs.current;
    if (!r) return;
    r.modelGroup.clear();
    r.pmiGroup.clear();
    r.highlightGroup.clear();
    r.balloons.clear();
    r.partMesh = null;
    r.edgeLines = [];
    r.vertexPoints = [];
    r.hoverHighlight = null; // pmiGroup.clear() just disposed it
    r.edgeMat = null;
    if (!model || !mesh) return;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(mesh.positions, 3));
    geom.setAttribute("normal", new THREE.Float32BufferAttribute(mesh.normals, 3));
    geom.setIndex(new THREE.Uint32BufferAttribute(mesh.indices, 1));
    const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    const partMesh = new THREE.Mesh(geom, mat);
    // triangle index -> face id lookup (face_ranges are contiguous & sorted)
    const ranges = mesh.face_ranges;
    partMesh.userData.faceLookup = (tri: number) => {
      const idx = tri * 3;
      let lo = 0;
      let hi = ranges.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const fr = ranges[mid];
        if (idx < fr.index_start) hi = mid - 1;
        else if (idx >= fr.index_start + fr.index_count) lo = mid + 1;
        else return fr.face_id;
      }
      return -1;
    };
    r.modelGroup.add(partMesh);
    r.partMesh = partMesh;

    const edgeMat = new THREE.LineBasicMaterial({ transparent: true });
    r.edgeMat = edgeMat;
    for (const e of mesh.edges) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(e.points, 3));
      const line = new THREE.Line(g, edgeMat);
      r.modelGroup.add(line);
      r.edgeLines.push({ line, edgeId: e.edge_id });
    }
    // scale the edge-picking hit radius, and the vertex marker size, to the model's size (world units)
    const bboxDiagonal = new THREE.Vector3(...model.bbox.max).sub(new THREE.Vector3(...model.bbox.min)).length() || 1;
    r.raycaster.params.Line = { threshold: bboxDiagonal / 250 };
    const vertexRadius = Math.max(bboxDiagonal / 200, 0.05);
    const vertexGeom = new THREE.SphereGeometry(vertexRadius);
    const vertexMat = new THREE.MeshBasicMaterial({ color: VERTEX_COLOR, transparent: true, opacity: 0.85 });
    for (const v of mesh.vertices) {
      const vm = new THREE.Mesh(vertexGeom, vertexMat);
      vm.position.set(...v.point);
      vm.renderOrder = 9;
      // markers are for picking vertices; off otherwise to keep the part clean
      vm.visible = !!pickModeRef.current && (pickTargetRef.current === "auto" || pickTargetRef.current === "vertex");
      r.modelGroup.add(vm);
      r.vertexPoints.push({ mesh: vm, vertexId: v.vertex_id });
    }

    const makeLeader = (a: [number, number, number], b: [number, number, number], color: number) => {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color, depthTest: false }));
      line.renderOrder = 10;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(model.bbox ? Math.max(new THREE.Vector3(...model.bbox.max).sub(new THREE.Vector3(...model.bbox.min)).length() / 220, 0.05) : 0.5),
        new THREE.MeshBasicMaterial({ color, depthTest: false }),
      );
      dot.position.set(...a);
      dot.renderOrder = 11;
      r.pmiGroup.add(line, dot);
      return line;
    };

    for (const c of model.characteristics as Characteristic[]) {
      if (!c.anchor || !c.label_pos) continue;
      const wrap = document.createElement("div");
      wrap.className = "balloon-wrap";
      const el = document.createElement("div");
      el.className = "balloon";
      el.textContent = String(c.index);
      el.title = `${c.id} · ${c.feature_name}`;
      const tip = document.createElement("div");
      tip.className = "balloon-tip";
      tip.textContent = `${c.id} ${c.requirement}${c.feature_name ? " — " + c.feature_name : ""}`;
      wrap.append(el, tip);
      wrap.style.pointerEvents = "auto";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(c.id);
      });
      const obj = new CSS2DObject(wrap);
      obj.position.set(...c.label_pos);
      r.pmiGroup.add(obj);
      const leader = makeLeader(c.anchor, c.label_pos, 0x475569);
      r.balloons.set(c.id, { obj, el, leader });
    }
    for (const d of model.datums as Datum[]) {
      if (!d.anchor || !d.label_pos) continue;
      const el = document.createElement("div");
      el.className = "datum-flag";
      el.textContent = d.label;
      el.title = `Datum ${d.label}`;
      const obj = new CSS2DObject(el);
      obj.position.set(...d.label_pos);
      r.pmiGroup.add(obj);
      makeLeader(d.anchor, d.label_pos, 0xb45309);
    }
    fitCamera(r, model.bbox);
    onViewChangeRef.current?.("iso");
    r.wcs.scale.setScalar(bboxDiagonal * 0.12);

    // size/position the ground grid to comfortably frame the model, sitting just below it
    const gmin = new THREE.Vector3(...model.bbox.min);
    const gmax = new THREE.Vector3(...model.bbox.max);
    const gcenter = gmin.clone().add(gmax).multiplyScalar(0.5);
    const span = Math.max(gmax.x - gmin.x, gmax.y - gmin.y) || 1;
    const gridSize = Math.pow(10, Math.ceil(Math.log10(span * 2.5)));
    const divisions = Math.max(10, Math.round(gridSize / Math.pow(10, Math.floor(Math.log10(gridSize / 20)))));
    r.scene.remove(r.grid);
    r.grid.geometry.dispose();
    (r.grid.material as THREE.Material).dispose();
    r.grid = new THREE.GridHelper(gridSize, divisions, GRID_COLOR_MAJOR, GRID_COLOR_MINOR);
    r.grid.rotation.x = Math.PI / 2;
    (r.grid.material as THREE.Material).transparent = true;
    (r.grid.material as THREE.Material).opacity = 0.6;
    r.grid.position.set(gcenter.x, gcenter.y, gmin.z - span * 0.02);
    r.scene.add(r.grid);
    applyTheme(r, themeRef.current);
  }, [model, mesh]);

  // ---- theme switch on an already-loaded scene
  useEffect(() => {
    if (refs.current) applyTheme(refs.current, theme);
  }, [theme]);

  // ---- clear the hover preview as soon as pick mode is turned off
  useEffect(() => {
    if (pickMode) return;
    const r = refs.current;
    if (r?.hoverHighlight) {
      r.pmiGroup.remove(r.hoverHighlight);
      r.hoverHighlight = null;
    }
  }, [pickMode]);

  // ---- status colours
  useEffect(() => {
    const r = refs.current;
    if (!r) return;
    for (const [id, b] of r.balloons) {
      b.el.classList.remove("pass", "fail");
      const cls = statusClass(statuses[id]);
      if (cls) b.el.classList.add(cls);
      const color = cls === "pass" ? 0x16a34a : cls === "fail" ? 0xdc2626 : 0x475569;
      (b.leader.material as THREE.LineBasicMaterial).color.setHex(color);
    }
  }, [statuses, model]);

  // ---- selection highlight
  useEffect(() => {
    const r = refs.current;
    if (!r) return;
    r.highlightGroup.clear();
    for (const [id, b] of r.balloons) {
      b.el.classList.toggle("selected", id === selectedId);
      (b.obj.element as HTMLElement).classList.toggle("selected", id === selectedId);
    }
    if (!model || !mesh || !r.partMesh) return;
    let faces: number[];
    let color = PALETTES[theme].select;
    if (highlightFaces) {
      faces = highlightFaces;
    } else {
      const c = selectedId ? model.characteristics.find((x) => x.id === selectedId) : undefined;
      if (!c || !selectedId) return;
      const status = statuses[selectedId];
      if (status === "PASS") color = 0x22c55e;
      else if (status === "FAIL") color = 0xef4444;
      faces = c.face_ids;
    }
    const posAttr = r.partMesh.geometry.getAttribute("position");
    const nrmAttr = r.partMesh.geometry.getAttribute("normal");
    for (const fid of faces) {
      const fr = mesh.face_ranges.find((x) => x.face_id === fid);
      if (!fr || !fr.index_count) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", posAttr);
      g.setAttribute("normal", nrmAttr);
      g.setIndex(new THREE.Uint32BufferAttribute(mesh.indices.slice(fr.index_start, fr.index_start + fr.index_count), 1));
      const m = new THREE.Mesh(
        g,
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, depthWrite: false }),
      );
      r.highlightGroup.add(m);
      if (highlightFaces) {
        // x-ray: the part of the feature hidden behind other faces still shows, faintly
        const ghost = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthTest: false, depthWrite: false }));
        ghost.renderOrder = 12;
        r.highlightGroup.add(ghost);
      }
    }
  }, [selectedId, model, mesh, statuses, theme, highlightFaces]);

  useEffect(() => {
    if (refs.current) refs.current.pmiGroup.visible = !hidePmi;
  }, [hidePmi, model, mesh]);

  useEffect(() => {
    const show = !!pickMode && (pickTarget === undefined || pickTarget === "auto" || pickTarget === "vertex");
    for (const v of refs.current?.vertexPoints ?? []) v.mesh.visible = show;
  }, [pickMode, pickTarget, mesh]);

  // ---- fly to the focused faces, from the direction where the least of them is hidden behind the part
  const focusKey = focusFaces?.join(",") ?? "";
  useEffect(() => {
    const r = refs.current;
    if (!r || !mesh || !focusKey || !r.partMesh) return;
    const box = new THREE.Box3();
    const samples: { p: THREE.Vector3; n: THREE.Vector3 }[] = [];
    const tris: number[] = [];
    for (const fid of focusKey.split(",").map(Number)) {
      const fr = mesh.face_ranges.find((x) => x.face_id === fid);
      if (!fr) continue;
      for (let i = fr.index_start; i + 2 < fr.index_start + fr.index_count; i += 3) tris.push(i);
    }
    if (!tris.length) return;
    const vtx = (i: number) => {
      const k = mesh.indices[i] * 3;
      return new THREE.Vector3(mesh.positions[k], mesh.positions[k + 1], mesh.positions[k + 2]);
    };
    for (const t of tris) for (let j = 0; j < 3; j++) box.expandByPoint(vtx(t + j));
    // up to 8 triangle centres spread over the feature, each with its outward normal
    const step = Math.max(1, Math.floor(tris.length / 8));
    for (let s = 0; s < tris.length && samples.length < 8; s += step) {
      const t = tris[s];
      const a = vtx(t), b = vtx(t + 1), c = vtx(t + 2);
      const n = b.clone().sub(a).cross(c.clone().sub(a));
      if (n.lengthSq() < 1e-18) continue;
      samples.push({ p: a.add(b).add(c).divideScalar(3), n: n.normalize() });
    }
    const m = model;
    const diag = m ? new THREE.Vector3(...m.bbox.max).sub(new THREE.Vector3(...m.bbox.min)).length() : 1;
    const cur = r.camera.position.clone().sub(r.controls.target).normalize();
    const dirs = [cur];
    for (const a of [-1, 0, 1]) for (const b of [-1, 0, 1]) for (const c of [-1, 0, 1]) if ((a || b || c) && Math.abs(a) + Math.abs(b) + Math.abs(c) !== 2) dirs.push(new THREE.Vector3(a, b, c).normalize());
    const rc = new THREE.Raycaster();
    rc.far = diag * 3;
    let best = cur;
    let bestScore = -1;
    for (const d of dirs) {
      let seen = 0;
      for (const sm of samples) {
        if (d.dot(sm.n) < -0.05) continue; // a face cannot be seen from behind
        rc.set(sm.p.clone().addScaledVector(sm.n, diag * 0.002), d);
        if (!rc.intersectObject(r.partMesh, false).length) seen++;
      }
      // most of the feature in view; then the smallest swing from where the camera is; slightly prefer above
      const score = seen * 10 + d.dot(cur) * 2 + d.z * 0.5;
      if (score > bestScore) {
        bestScore = score;
        best = d;
      }
    }
    r.focus(box, best.clone().add(new THREE.Vector3(0, 0, 0.15)).normalize());
  }, [focusKey, mesh, model]);

  // ---- vertex/edge/face-picking highlight (add-PMI mode)
  useEffect(() => {
    const r = refs.current;
    if (!r || !r.partMesh || !mesh || !pickedRefs?.length) return;
    const posAttr = r.partMesh.geometry.getAttribute("position");
    const nrmAttr = r.partMesh.geometry.getAttribute("normal");
    const added: THREE.Object3D[] = [];
    for (const ref of pickedRefs) {
      if (ref.kind === "vertex") {
        const v = mesh.vertices.find((x) => x.vertex_id === ref.ref_id);
        if (!v) continue;
        const src = r.vertexPoints.find((x) => x.vertexId === ref.ref_id)?.mesh;
        const radius = (src?.geometry as THREE.SphereGeometry | undefined)?.parameters.radius ?? 0.5;
        const m = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.6), new THREE.MeshBasicMaterial({ color: PICKED_COLOR, depthTest: false }));
        m.position.set(...v.point);
        m.renderOrder = 12;
        r.pmiGroup.add(m);
        added.push(m);
      } else if (ref.kind === "face") {
        const fr = mesh.face_ranges.find((x) => x.face_id === ref.ref_id);
        if (!fr || !fr.index_count) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", posAttr);
        g.setAttribute("normal", nrmAttr);
        g.setIndex(new THREE.Uint32BufferAttribute(mesh.indices.slice(fr.index_start, fr.index_start + fr.index_count), 1));
        const m = new THREE.Mesh(
          g,
          new THREE.MeshBasicMaterial({ color: PICKED_COLOR, transparent: true, opacity: 0.6, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, depthWrite: false }),
        );
        r.pmiGroup.add(m);
        added.push(m);
      } else {
        const e = mesh.edges.find((x) => x.edge_id === ref.ref_id);
        if (!e) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(e.points, 3));
        const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: PICKED_COLOR, depthTest: false, linewidth: 3 }));
        line.renderOrder = 12;
        r.pmiGroup.add(line);
        added.push(line);
      }
    }
    return () => {
      for (const o of added) r.pmiGroup.remove(o);
    };
  }, [pickedRefs, mesh]);

  const views: { view: ViewName; label: string }[] = [
    { view: "iso", label: "Iso" },
    { view: "front", label: "Front" },
    { view: "back", label: "Back" },
    { view: "top", label: "Top" },
    { view: "bottom", label: "Bottom" },
    { view: "left", label: "Left" },
    { view: "right", label: "Right" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className={`absolute inset-0 ${theme === "cam" ? "cam-viewport" : ""} ${pickMode ? "cursor-crosshair" : ""}`} />
      {model && (
        <div className="cam-viewbar pointer-events-auto absolute right-3 top-3 flex gap-0.5 rounded bg-slate-900/85 p-1 text-xs shadow-lg ring-1 ring-slate-700">
          {views.map((v) => (
            <button
              key={v.view}
              onClick={() => refs.current?.setView(v.view)}
              title={v.view === "iso" ? "Reset to angled view" : `Look straight along ${v.label} (edges lie flat on screen - easier to pick)`}
              className="rounded px-1.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
      {!model && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <div className="text-5xl">⬡</div>
            <p className="mt-2 text-sm">Upload a STEP AP242 file or load a sample to begin</p>
          </div>
        </div>
      )}
    </div>
  );
}
