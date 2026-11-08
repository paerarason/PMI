# MFCAD++ feature-recognition accuracy (val split)

_Per-face agreement with the labels of MFCAD++ (Colligan et al. 2022, doi:10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823, CC BY), a third party's synthetic prismatic parts. Independent of our own generators; real parts still need reviewed labels._

**8950 parts, 269407 faces** (0 unreadable).

- process level (right kind of feature): **95.5 %** (proven ≥ 95.4 % at 95 %)
- exact class (25 classes): **88.6 %** (proven ≥ 88.5 % at 95 %)
- parts with every face right (process level): 5827 of 8950

## Process level, per class

| class | faces | recall | precision | most often read as |
|---|---|---|---|---|
| pocket | 68915 | 97.4 % | 96.7 % | pocket 67115, slot 768, step 503, stock 258 |
| stock | 60177 | 99.8 % | 95.9 % | stock 60038, chamfer 131, step 3, boss 3 |
| passage | 48959 | 95.4 % | 96.8 % | passage 46713, step 617, pocket 542, slot 540 |
| step | 48522 | 96.1 % | 95.5 % | step 46629, slot 780, stock 488, pocket 323 |
| slot | 17082 | 80.6 % | 85.7 % | slot 13768, passage 1050, pocket 980, stock 766 |
| hole | 10695 | 96.5 % | 96.3 % | hole 10319, slot 192, step 103, stock 44 |
| groove | 10133 | 92.5 % | 100.0 % | groove 9375, hole 350, step 171, stock 93 |
| chamfer | 3759 | 62.5 % | 90.2 % | chamfer 2350, stock 443, step 328, pocket 326 |
| round | 1165 | 86.1 % | 91.1 % | round 1003, pocket 87, step 37, stock 26 |

## Exact class, per class

| class | faces | recall | precision | most often read as |
|---|---|---|---|---|
| stock | 60177 | 99.8 % | 95.9 % | stock 60038, chamfer 131, other:boss 3, slanted_through_step 2 |
| 6sides_pocket | 23250 | 91.3 % | 99.6 % | 6sides_pocket 21235, rectangular_pocket 1727, triangular_pocket 200, 2sides_through_step 29 |
| 6sides_passage | 22642 | 90.0 % | 99.6 % | 6sides_passage 20382, rectangular_passage 1251, rectangular_pocket 463, stock 206 |
| rectangular_pocket | 16945 | 94.9 % | 78.5 % | rectangular_pocket 16085, rectangular_blind_slot 447, rectangular_blind_step 290, rectangular_passage 32 |
| circular_end_pocket | 15815 | 93.8 % | 98.1 % | circular_end_pocket 14826, stock 211, rectangular_pocket 189, rectangular_passage 141 |
| rectangular_passage | 15176 | 93.1 % | 84.0 % | rectangular_passage 14135, rectangular_through_slot 499, stock 240, triangular_passage 140 |
| triangular_pocket | 12905 | 92.5 % | 95.6 % | triangular_pocket 11939, rectangular_pocket 890, rectangular_blind_step 33, 2sides_through_step 18 |
| triangular_passage | 11141 | 92.5 % | 94.2 % | triangular_passage 10310, rectangular_passage 380, 2sides_through_step 183, rectangular_through_step 102 |
| 2sides_through_step | 10291 | 86.0 % | 84.9 % | 2sides_through_step 8852, rectangular_blind_step 759, rectangular_through_step 183, slanted_through_step 136 |
| rectangular_blind_step | 10239 | 91.8 % | 86.2 % | rectangular_blind_step 9400, rectangular_blind_slot 536, rectangular_through_step 80, rectangular_through_slot 74 |
| Oring | 10133 | 92.5 % | 100.0 % | Oring 9375, blind_hole 327, circular_blind_step 171, stock 93 |
| rectangular_through_step | 7173 | 75.2 % | 36.1 % | rectangular_through_step 5393, slanted_through_step 1397, rectangular_blind_step 145, stock 86 |
| slanted_through_step | 7088 | 38.9 % | 49.6 % | rectangular_through_step 3461, slanted_through_step 2755, 2sides_through_step 566, rectangular_blind_step 110 |
| triangular_blind_step | 6973 | 7.4 % | 98.1 % | rectangular_through_step 5029, slanted_through_step 940, triangular_blind_step 515, 2sides_through_step 323 |
| blind_hole | 6856 | 97.3 % | 94.6 % | blind_hole 6673, circular_blind_step 97, through_hole 29, stock 26 |
| circular_blind_step | 6758 | 90.1 % | 94.0 % | circular_blind_step 6089, rectangular_through_step 342, stock 194, slanted_through_step 67 |
| rectangular_through_slot | 4331 | 82.5 % | 81.5 % | rectangular_through_slot 3575, rectangular_passage 505, triangular_passage 85, rectangular_through_step 43 |
| through_hole | 3839 | 93.1 % | 97.5 % | through_hole 3574, circular_through_slot 189, blind_hole 43, stock 18 |
| chamfer | 3759 | 62.5 % | 90.2 % | chamfer 2350, stock 443, rectangular_pocket 308, 2sides_through_step 181 |
| rectangular_blind_slot | 3402 | 85.4 % | 74.1 % | rectangular_blind_slot 2905, rectangular_pocket 458, rectangular_through_slot 18, other:boss 8 |
| v_circular_end_blind_slot | 2945 | 80.3 % | 97.4 % | v_circular_end_blind_slot 2364, circular_end_pocket 266, triangular_pocket 151, stock 60 |
| triangular_through_slot | 2559 | 52.7 % | 97.3 % | triangular_through_slot 1348, stock 543, triangular_passage 304, slanted_through_step 139 |
| h_circular_end_blind_slot | 2457 | 92.0 % | 96.7 % | h_circular_end_blind_slot 2261, rectangular_pocket 76, rectangular_through_step 35, round 26 |
| circular_through_slot | 1388 | 91.3 % | 79.0 % | circular_through_slot 1268, stock 114, rectangular_through_step 2, circular_blind_step 2 |
| round | 1165 | 86.1 % | 91.1 % | round 1003, rectangular_pocket 37, 6sides_pocket 35, stock 26 |

## Worst parts (process level)

- 23138.step: 0 %
- 21805.step: 17 %
- 41518.step: 33 %
- 54347.step: 37 %
- 8611.step: 42 %
- 59564.step: 42 %
- 23811.step: 42 %
- 22095.step: 42 %
- 56882.step: 42 %
- 3388.step: 43 %
- 10352.step: 43 %
- 29603.step: 47 %
- 40074.step: 48 %
- 20864.step: 48 %
- 47111.step: 48 %
