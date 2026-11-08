import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt } from "../../format";
import type { Characteristic, ModelSummary } from "../../types";
import { Icon, type IconName } from "./icons";

interface Props {
  model: ModelSummary | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onEdit: (c: Characteristic) => void;
  /** false while a model is missing or the add/edit function panel is already open. */
  canWrite: boolean;
}

type Tab = "pmi" | "model";

/** Left-docked "operations manager" in the style of a CAM package's toolpath tree: part → datum
 * reference frame → characteristics, with a property grid for the selection underneath. */
export default function PmiManager({ model, selectedId, onSelect, onAdd, onEdit, canWrite }: Props) {
  const [tab, setTab] = useState<Tab>("pmi");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const chars = model?.characteristics ?? [];
  const selected = chars.find((c) => c.id === selectedId) ?? null;
  const canEdit = (c: Characteristic | null): c is Characteristic => !!c && canWrite && c.xcaf_index !== null;

  useEffect(() => {
    if (selectedId) rowRefs.current[selectedId]?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const toggle = (key: string) =>
    setCollapsed((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  return (
    <div className="cam-manager flex h-full min-h-0 flex-col">
      <div className="cam-panel-title">PMI Manager</div>
      <div className="cam-mini-toolbar">
        <MiniButton icon="addGdt" title="Add GD&T characteristic" onClick={onAdd} disabled={!canWrite} />
        <MiniButton icon="edit" title="Edit selected characteristic" onClick={() => canEdit(selected) && onEdit(selected)} disabled={!canEdit(selected)} />
        <span className="cam-sep" />
        <MiniButton icon="folder" title="Expand all" onClick={() => setCollapsed(new Set())} disabled={!model} label="+" />
        <MiniButton icon="folder" title="Collapse all" onClick={() => setCollapsed(new Set(["dat", "chr"]))} disabled={!model} label="−" />
      </div>

      {tab === "pmi" ? (
        <>
          <div className="cam-tree min-h-0 flex-1 overflow-auto" onClick={() => onSelect(null)}>
            {!model ? (
              <div className="cam-empty">No part loaded.</div>
            ) : (
              <>
                <TreeRow depth={0} icon="part" label={<b>{model.part_name || model.file_name}</b>} muted={model.file_name} />
                <TreeRow
                  depth={1}
                  icon="folder"
                  label={`Datum Reference Frame (${model.datums.length})`}
                  open={!collapsed.has("dat")}
                  onToggle={() => toggle("dat")}
                />
                {!collapsed.has("dat") &&
                  model.datums.map((d) => (
                    <TreeRow
                      key={d.label}
                      depth={2}
                      icon="datum"
                      label={`Datum ${d.label}`}
                      muted={d.face_ids.length ? `face ${d.face_ids.join(", ")}` : "unlinked"}
                    />
                  ))}
                <TreeRow
                  depth={1}
                  icon="folder"
                  label={`Characteristics (${chars.length})`}
                  open={!collapsed.has("chr")}
                  onToggle={() => toggle("chr")}
                />
                {!collapsed.has("chr") &&
                  chars.map((c) => (
                    <TreeRow
                      key={c.id}
                      rowRef={(el) => {
                        rowRefs.current[c.id] = el;
                      }}
                      depth={2}
                      status={c.xcaf_index === null ? "lock" : c.face_ids.length ? "ok" : "warn"}
                      statusTitle={
                        c.xcaf_index === null
                          ? "Read from STEP text - not editable in place"
                          : c.face_ids.length
                            ? "Linked to geometry"
                            : "Not linked to geometry"
                      }
                      icon={c.kind === "dimension" ? "dim" : "tol"}
                      label={
                        <>
                          <span className="cam-tree-num">{c.index}</span> - {c.type_label} <span className="cam-mono">{c.requirement}</span>
                        </>
                      }
                      muted={c.feature_name}
                      selected={c.id === selectedId}
                      onClick={() => onSelect(c.id)}
                      onDoubleClick={() => canEdit(c) && onEdit(c)}
                    />
                  ))}
                {!chars.length && <div className="cam-empty">No characteristics - use Add GD&amp;T.</div>}
              </>
            )}
          </div>
          <PropertyGrid title={selected ? `Properties - ${selected.id}` : "Properties"} rows={selected ? charRows(selected) : []} />
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <PropertyGrid title="Part" rows={model ? modelRows(model) : []} fill />
        </div>
      )}

      <div className="cam-bottom-tabs">
        <button className={tab === "pmi" ? "active" : ""} onClick={() => setTab("pmi")}>
          PMI
        </button>
        <button className={tab === "model" ? "active" : ""} onClick={() => setTab("model")}>
          Part
        </button>
      </div>
    </div>
  );
}

export function MiniButton({ icon, title, onClick, disabled, label }: { icon: IconName; title: string; onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button className="cam-mini-btn" title={title} onClick={onClick} disabled={disabled}>
      <Icon name={icon} size={16} />
      {label && <span className="cam-mini-badge">{label}</span>}
    </button>
  );
}

export function TreeRow({
  depth,
  icon,
  label,
  muted,
  open,
  onToggle,
  selected,
  onClick,
  onDoubleClick,
  status,
  statusTitle,
  rowRef,
}: {
  depth: number;
  icon: IconName;
  label: ReactNode;
  muted?: string;
  open?: boolean;
  onToggle?: () => void;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  status?: IconName;
  statusTitle?: string;
  rowRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={rowRef}
      className={`cam-tree-row ${selected ? "selected" : ""}`}
      style={{ paddingLeft: 4 + depth * 16 }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
        else onToggle?.();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
    >
      <span
        className="cam-twisty"
        onClick={(e) => {
          if (!onToggle) return;
          e.stopPropagation();
          onToggle();
        }}
      >
        {onToggle ? (open ? "▾" : "▸") : ""}
      </span>
      {status && (
        <span title={statusTitle} className="flex">
          <Icon name={status} size={13} />
        </span>
      )}
      <Icon name={icon} size={16} />
      <span className="truncate">{label}</span>
      {muted && <span className="cam-tree-muted truncate">{muted}</span>}
    </div>
  );
}

export type Row = [string, ReactNode] | { section: string };

export function PropertyGrid({ title, rows, fill }: { title: string; rows: Row[]; fill?: boolean }) {
  return (
    <div className={`cam-props ${fill ? "fill" : ""}`}>
      <div className="cam-panel-title">{title}</div>
      <div className="cam-props-body">
        {!rows.length && <div className="cam-empty">Nothing selected.</div>}
        <table>
          <tbody>
            {rows.map((r, i) =>
              "section" in r ? (
                <tr key={i} className="section">
                  <td colSpan={2}>{r.section}</td>
                </tr>
              ) : (
                <tr key={i}>
                  <th>{r[0]}</th>
                  <td>{r[1]}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const dash = <span className="cam-tree-muted">—</span>;

function charRows(c: Characteristic): Row[] {
  return [
    { section: "General" },
    ["ID", c.id],
    ["Balloon", c.index],
    ["Kind", c.kind === "dimension" ? "Dimension" : "Geometric tolerance"],
    ["Type", `${c.symbol ? c.symbol + " " : ""}${c.type_label}`],
    ["Feature", c.feature_name || dash],
    { section: "Tolerance" },
    ["Requirement", <span className="cam-mono">{c.requirement}</span>],
    ["Nominal", `${fmt(c.nominal)} ${c.unit}`],
    ["Upper limit", c.usl === null ? dash : fmt(c.usl)],
    ["Lower limit", c.lsl === null ? dash : fmt(c.lsl)],
    ["Datums", c.datum_refs.length ? c.datum_refs.join(" | ") : dash],
    ["Modifiers", c.modifiers.length ? c.modifiers.join(", ") : dash],
    { section: "Geometry" },
    ["Faces", c.face_ids.length ? c.face_ids.join(", ") : <span className="cam-warn-text">unlinked</span>],
    ["Feature type", c.feature_type ?? dash],
    ["Material side", c.material_side ?? dash],
    { section: "Source" },
    ["Reader", c.source],
    ["XCAF index", c.xcaf_index ?? <span className="cam-tree-muted">none (not editable)</span>],
  ];
}

function modelRows(m: ModelSummary): Row[] {
  const size = m.bbox.max.map((v, i) => fmt(v - m.bbox.min[i], 3));
  return [
    { section: "File" },
    ["Name", m.file_name],
    ["Part", m.part_name || dash],
    ["Schema", m.schema || dash],
    { section: "Geometry" },
    ["Faces", m.face_count],
    ["Size X × Y × Z", size.join(" × ")],
    ["Min", m.bbox.min.map((v) => fmt(v, 3)).join(", ")],
    ["Max", m.bbox.max.map((v) => fmt(v, 3)).join(", ")],
    { section: "PMI" },
    ["Source", m.pmi_source],
    ["Characteristics", m.characteristics.length],
    ["Datums", m.datums.map((d) => d.label).join(", ") || dash],
    ...(m.warnings.length ? [{ section: `Warnings (${m.warnings.length})` } as Row, ...m.warnings.map((w, i): Row => [`#${i + 1}`, <span className="cam-warn-text">{w}</span>])] : []),
  ];
}
