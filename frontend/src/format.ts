/** Number formatting + circled-index helpers shared by the viewer and the PMI list. */
export function fmt(v: number | null | undefined, digits = 4): string {
  if (v === null || v === undefined) return "—";
  const s = v.toFixed(digits).replace(/\.?0+$/, "");
  return s === "-0" || s === "" ? "0" : s;
}

const CIRCLED = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
export function circled(n: number): string {
  return n >= 1 && n <= 20 ? CIRCLED[n - 1] : `(${n})`;
}
