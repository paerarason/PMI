# MFCAD++ accuracy benchmark

Feature-recognition accuracy measured against a third party's labelled parts, not our own generators.

**Dataset.** MFCAD++: A. R. Colligan, T. T. Robinson, D. C. Nolan, Y. Hua, W. Cao, "Hierarchical CADNet:
Learning from B-Reps for Machining Feature Recognition", *Computer-Aided Design* 147 (2022) 103226.
Data: Queen's University Belfast, doi:[10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823](https://doi.org/10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823),
licence **CC BY** (stated on the dataset record). We use it only to score our recognizer; nothing is trained on
it, and the files are not redistributed: they stay in the git-ignored cache.

**Get it.** The server refuses scripted downloads, so download `MFCAD_dataset.zip` (1.5 GB) in a browser from the
dataset page and unzip it into `backend/benchmark/data/mfcadpp/`.

**Run it.**

```bash
cd backend
.venv/bin/python scripts/mfcadpp_benchmark.py --split val --sample 2000   # develop against val
.venv/bin/python scripts/mfcadpp_benchmark.py --split test                # report on test
```

Each run writes `<split>.md` and `<split>.json` here: face accuracy at the process level (the right kind of
feature) and for the 25 exact classes, per-class precision and recall, what each class is mistaken for, and the
worst parts. How our features map to the dataset's classes: `app/services/benchmark/mfcadpp.py`.

**Limits.** The parts are synthetic and prismatic (a stock block with 3–10 features, no turning or free-form),
labelled by the dataset's own generator. A high score here says the recognizer reads these feature shapes
right; accuracy on customers' parts still needs reviewed labels.
