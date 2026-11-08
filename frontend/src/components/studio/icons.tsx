/** Line icons for the studio shell: lucide glyphs plus hand-drawn view cubes, all drawn in currentColor so
 * they follow the text colour of the button they sit in. Status icons (ok / warn / lock) carry their own
 * semantic colour. */
import {
  Anvil,
  ArrowDownToLine,
  Axis3d,
  Box,
  Calculator,
  ChartLine,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleDashed,
  CircleX,
  CirclePlus,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Crosshair,
  Download,
  Drill,
  Eye,
  FileCheck2,
  FileCog,
  FilePlus2,
  Folder,
  FolderOpen,
  Flag,
  Gauge,
  Grid2x2,
  Hand,
  Layers,
  ListChecks,
  LocateFixed,
  Lock,
  MousePointer2,
  Package,
  Palette,
  Pause,
  PencilLine,
  Play,
  Repeat,
  Rotate3d,
  RotateCcw,
  Route,
  Ruler,
  Scan,
  Shapes,
  ShieldCheck,
  Sigma,
  Spline,
  PencilRuler,
  SkipBack,
  SkipForward,
  Slash,
  Square,
  Target,
  Triangle,
  TriangleAlert,
  Undo2,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ViewName } from "../Viewer3D";

export type IconName =
  | "open"
  | "new"
  | "sample"
  | "save"
  | "props"
  | "addGdt"
  | "edit"
  | "fit"
  | "theme"
  | "selAuto"
  | "selVertex"
  | "selEdge"
  | "selFace"
  | "part"
  | "folder"
  | "datum"
  | "dim"
  | "tol"
  | "ok"
  | "warn"
  | "lock"
  | "close"
  | "play"
  | "pause"
  | "stepFwd"
  | "stepBack"
  | "restart"
  | "mill3"
  | "mill5"
  | "vise"
  | "stock"
  | "toolpath"
  | "tool"
  | "speed"
  | "follow"
  | "machine"
  | "eye"
  | "review"
  | "accept"
  | "acceptAll"
  | "reject"
  | "undo"
  | "pending"
  | "rejected"
  | "manual"
  | "flag"
  | "next"
  | "prev"
  | "label"
  | "inspect"
  | "probe"
  | "placement"
  | "derived"
  | "implied"
  | "covered"
  | "process"
  | "pattern"
  | "guard"
  | "capability"
  | "clock"
  | "brep"
  | "drawing"
  | "features"
  | `view-${ViewName}`;

const LUCIDE: Partial<Record<IconName, LucideIcon>> = {
  open: FolderOpen,
  new: FilePlus2,
  sample: Shapes,
  save: Download,
  props: FileCog,
  addGdt: CirclePlus,
  edit: PencilLine,
  fit: Scan,
  theme: Palette,
  selAuto: MousePointer2,
  selVertex: CircleDot,
  selEdge: Slash,
  selFace: Square,
  part: Box,
  folder: Folder,
  datum: Triangle,
  dim: Ruler,
  tol: Target,
  ok: CircleCheck,
  warn: TriangleAlert,
  lock: Lock,
  close: X,
  play: Play,
  pause: Pause,
  stepFwd: SkipForward,
  stepBack: SkipBack,
  restart: RotateCcw,
  mill3: Axis3d,
  mill5: Rotate3d,
  vise: Anvil,
  stock: Package,
  toolpath: Route,
  tool: Drill,
  speed: Gauge,
  follow: LocateFixed,
  machine: Layers,
  eye: Eye,
  review: ListChecks,
  accept: Check,
  acceptAll: CheckCheck,
  reject: X,
  undo: Undo2,
  pending: CircleDashed,
  rejected: CircleX,
  manual: Hand,
  flag: Flag,
  next: ChevronDown,
  prev: ChevronUp,
  label: FileCheck2,
  inspect: ClipboardCheck,
  probe: Crosshair,
  placement: ArrowDownToLine,
  derived: Calculator,
  implied: Sigma,
  covered: ShieldCheck,
  process: Repeat,
  pattern: Grid2x2,
  guard: ShieldCheck,
  capability: ChartLine,
  clock: Clock3,
  brep: Spline,
  drawing: PencilRuler,
  features: ListChecks,
};

const STATUS_CLASS: Partial<Record<IconName, string>> = {
  ok: "st-ic-ok",
  warn: "st-ic-warn",
  lock: "st-ic-muted",
  pending: "st-ic-muted",
  rejected: "st-ic-bad",
  flag: "st-ic-warn",
};

// Iso cube corners on a 24-unit artboard: a = back-top, b = right-top, c = front-top, d = left-top, primes are
// bottom corners.
const P = { a: "12,3", b: "20.5,7", c: "12,11", d: "3.5,7", a_: "12,13", b_: "20.5,17", c_: "12,21", d_: "3.5,17" };
const face = (...k: (keyof typeof P)[]) => k.map((x) => P[x]).join(" ");
const FACES: Partial<Record<ViewName, string>> = {
  top: face("a", "b", "c", "d"),
  front: face("d", "c", "c_", "d_"),
  right: face("c", "b", "b_", "c_"),
  back: face("a", "b", "b_", "a_"),
  left: face("d", "a", "a_", "d_"),
  bottom: face("d_", "c_", "b_", "a_"),
};

function ViewCube({ view, size }: { view: ViewName; size: number }) {
  const hidden = view === "back" || view === "left" || view === "bottom";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden>
      {view !== "iso" && FACES[view] && <polygon points={FACES[view]} fill="var(--st-accent)" fillOpacity={hidden ? 0.35 : 0.85} stroke="none" />}
      <polygon points={face("a", "b", "b_", "c_", "d_", "d")} />
      <polyline points={face("d", "c", "b")} />
      <line x1={12} y1={11} x2={12} y2={21} />
      {hidden && <path d="M12 13V3M12 13l8.5 4M12 13l-8.5 4" strokeDasharray="1.6 1.6" strokeOpacity={0.6} />}
    </svg>
  );
}

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  if (name.startsWith("view-")) return <ViewCube view={name.slice(5) as ViewName} size={size} />;
  const C = LUCIDE[name] ?? Crosshair;
  return <C size={size} strokeWidth={1.75} className={[STATUS_CLASS[name], className].filter(Boolean).join(" ") || undefined} aria-hidden />;
}
