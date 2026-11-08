import { useEffect, useState } from "react";
import { drawingUrl } from "../../api";
import { Icon } from "../studio/icons";

/** The 2D sheet the backend draws from the B-rep (exact hidden-line views, balloons, PMI table), shown as an SVG
 * you can zoom. The model id is in the URL, so a PMI write (a new id) always shows its own drawing. */
export default function DrawingView({ modelId }: { modelId: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setUrl(null);
    setError(null);
    setZoom(1);
    if (!modelId) return;
    let stale = false;
    let made: string | null = null;
    setLoading(true);
    fetch(drawingUrl(modelId))
      .then(async (r) => {
        if (!r.ok) {
          let d = r.statusText;
          try {
            d = (await r.json()).detail ?? d;
          } catch {
            /* not JSON */
          }
          throw new Error(typeof d === "string" ? d : JSON.stringify(d));
        }
        return r.blob();
      })
      .then((b) => {
        if (stale) return;
        made = URL.createObjectURL(b);
        setUrl(made);
      })
      .catch((e) => !stale && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => !stale && setLoading(false));
    return () => {
      stale = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [modelId]);

  const bump = (f: number) => setZoom((z) => Math.min(8, Math.max(0.4, z * f)));

  return (
    <div className="dw-wrap">
      {!modelId && <div className="dw-empty">Open a part to draw it.</div>}
      {modelId && loading && <div className="dw-empty">Drawing the views…</div>}
      {error && <div className="dw-empty error">Could not draw this part: {error}</div>}
      {url && (
        <>
          <div className="dw-zoom st-glass">
            <button className="st-btn icon" title="Zoom out" onClick={() => bump(1 / 1.25)}>
              −
            </button>
            <button className="st-btn" title="Fit the sheet to the window" onClick={() => setZoom(1)}>
              <Icon name="fit" size={14} /> Fit
            </button>
            <button className="st-btn icon" title="Zoom in" onClick={() => bump(1.25)}>
              +
            </button>
          </div>
          <div className="dw-scroll">
            <img src={url} alt="2D drawing of the part" style={{ width: `${zoom * 100}%` }} draggable={false} />
          </div>
        </>
      )}
    </div>
  );
}
