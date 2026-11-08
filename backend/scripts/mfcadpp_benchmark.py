"""Score feature recognition against MFCAD++ (app/services/benchmark/mfcadpp.py).

    .venv/bin/python scripts/mfcadpp_benchmark.py                      # the test split, every part
    .venv/bin/python scripts/mfcadpp_benchmark.py --split val --sample 2000   # quick, reproducible sample
    .venv/bin/python scripts/mfcadpp_benchmark.py --root /path/to/unzipped/dataset

Develop against `val` (or `train`) and report `test`, so the figure is not tuned to the parts it is quoted on.
Writes benchmark/mfcadpp/<split>.md and .json.
"""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
import time
from multiprocessing import Pool
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.benchmark.mfcadpp import DATA_DIR, evaluate_file, load_classes, report_markdown, score, split_files  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "benchmark" / "mfcadpp"


def _work(args):
    path, classes = args
    return evaluate_file(str(path), classes)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", type=Path, default=DATA_DIR, help="the unzipped dataset (default: the benchmark cache)")
    ap.add_argument("--split", default="test", choices=("train", "val", "test", "all"))
    ap.add_argument("--sample", type=int, default=None, help="score this many parts, picked with a fixed seed")
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) - 1))
    a = ap.parse_args()
    if not a.root.exists() or not any(a.root.rglob("*.st*p")):
        print(f"No MFCAD++ STEP files under {a.root}. Download MFCAD_dataset.zip from "
              "https://doi.org/10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823 and unzip it there.")
        return 2
    classes = load_classes(a.root)
    files = split_files(a.root, a.split) if a.split != "all" else sorted(p for p in a.root.rglob("*.st*p"))
    if a.sample and a.sample < len(files):
        files = sorted(random.Random(7).sample(files, a.sample))
    print(f"{len(files)} parts, {len(classes)} classes, {a.workers} workers")
    t0, results = time.time(), []
    with Pool(a.workers) as pool:
        for i, r in enumerate(pool.imap_unordered(_work, [(f, classes) for f in files], chunksize=8), 1):
            results.append(r)
            if i % 500 == 0:
                print(f"  {i}/{len(files)}  {time.time() - t0:.0f}s")
    s = score(results)
    s["seconds"] = round(time.time() - t0, 1)
    OUT.mkdir(parents=True, exist_ok=True)
    name = a.split + (f"-sample{a.sample}" if a.sample else "")
    (OUT / f"{name}.json").write_text(json.dumps(s, indent=1) + "\n")
    (OUT / f"{name}.md").write_text(report_markdown(s, a.split, a.sample))
    print(f"process {100 * (s['process_accuracy'] or 0):.2f} %  exact {100 * (s['exact_accuracy'] or 0):.2f} %  "
          f"({s['parts']} parts, {s['faces']} faces, {s['errors']} errors, {s['seconds']} s) → {OUT / name}.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
