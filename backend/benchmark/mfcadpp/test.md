# MFCAD++ feature-recognition accuracy (test split)

_Per-face agreement with the labels of MFCAD++ (Colligan et al. 2022, doi:10.17034/d1fec5a0-8c10-4630-b02e-b92dc81df823, CC BY), a third party's synthetic prismatic parts. Independent of our own generators; real parts still need reviewed labels._

**8949 parts, 268982 faces** (0 unreadable).

- process level (right kind of feature): **95.5 %** (proven ≥ 95.4 % at 95 %)
- exact class (25 classes): **88.6 %** (proven ≥ 88.5 % at 95 %)
- parts with every face right (process level): 5896 of 8949

## Process level, per class

| class | faces | recall | precision | most often read as |
|---|---|---|---|---|
| pocket | 68452 | 97.4 % | 96.7 % | pocket 66650, slot 813, step 487, stock 242 |
| stock | 60147 | 99.8 % | 95.7 % | stock 60015, chamfer 124, pocket 6, slot 1 |
| passage | 49471 | 95.7 % | 96.9 % | passage 47320, step 618, pocket 533, slot 490 |
| step | 48283 | 96.1 % | 95.7 % | step 46399, slot 788, stock 543, pocket 275 |
| slot | 16727 | 80.2 % | 85.3 % | slot 13412, passage 1054, pocket 1010, stock 786 |
| hole | 10661 | 96.0 % | 95.4 % | hole 10239, slot 200, step 103, stock 63 |
| groove | 10328 | 92.2 % | 100.0 % | groove 9525, hole 448, step 138, shaft 92 |
| chamfer | 3704 | 61.6 % | 91.0 % | chamfer 2282, stock 494, step 310, pocket 306 |
| round | 1209 | 84.7 % | 91.7 % | round 1024, pocket 77, stock 62, step 29 |

## Exact class, per class

| class | faces | recall | precision | most often read as |
|---|---|---|---|---|
| stock | 60147 | 99.8 % | 95.7 % | stock 60015, chamfer 124, rectangular_pocket 4, 6sides_pocket 2 |
| 6sides_passage | 22763 | 89.8 % | 99.5 % | 6sides_passage 20451, rectangular_passage 1356, rectangular_pocket 433, stock 248 |
| 6sides_pocket | 22101 | 90.7 % | 99.5 % | 6sides_pocket 20050, rectangular_pocket 1813, triangular_pocket 184, rectangular_passage 19 |
| rectangular_pocket | 16971 | 94.6 % | 78.0 % | rectangular_pocket 16050, rectangular_blind_slot 490, rectangular_blind_step 296, rectangular_passage 40 |
| circular_end_pocket | 15954 | 93.8 % | 97.9 % | circular_end_pocket 14968, stock 227, rectangular_pocket 198, circular_through_slot 130 |
| rectangular_passage | 15300 | 94.1 % | 83.9 % | rectangular_passage 14404, rectangular_through_slot 459, stock 154, triangular_passage 96 |
| triangular_pocket | 13426 | 92.5 % | 96.2 % | triangular_pocket 12418, rectangular_pocket 949, rectangular_blind_step 36, 2sides_through_step 12 |
| triangular_passage | 11408 | 92.1 % | 94.6 % | triangular_passage 10502, rectangular_passage 381, 2sides_through_step 216, rectangular_through_step 96 |
| rectangular_blind_step | 10516 | 91.9 % | 87.8 % | rectangular_blind_step 9661, rectangular_blind_slot 504, rectangular_through_slot 93, other:boss 78 |
| Oring | 10328 | 92.2 % | 100.0 % | Oring 9525, blind_hole 418, circular_blind_step 138, other:shaft 92 |
| 2sides_through_step | 10214 | 89.5 % | 85.3 % | 2sides_through_step 9138, rectangular_blind_step 591, rectangular_through_step 130, slanted_through_step 91 |
| slanted_through_step | 7039 | 39.9 % | 49.1 % | rectangular_through_step 3383, slanted_through_step 2809, 2sides_through_step 527, rectangular_blind_step 141 |
| rectangular_through_step | 7017 | 73.8 % | 36.2 % | rectangular_through_step 5175, slanted_through_step 1407, rectangular_blind_step 135, stock 98 |
| triangular_blind_step | 6951 | 7.8 % | 98.0 % | rectangular_through_step 4801, slanted_through_step 1085, triangular_blind_step 540, 2sides_through_step 350 |
| blind_hole | 6716 | 96.6 % | 93.2 % | blind_hole 6488, circular_blind_step 103, stock 45, through_hole 33 |
| circular_blind_step | 6546 | 89.2 % | 94.3 % | circular_blind_step 5837, rectangular_through_step 365, stock 227, slanted_through_step 72 |
| rectangular_through_slot | 4097 | 82.0 % | 80.1 % | rectangular_through_slot 3361, rectangular_passage 475, triangular_passage 110, 2sides_through_step 57 |
| through_hole | 3945 | 93.0 % | 97.3 % | through_hole 3667, circular_through_slot 197, blind_hole 51, stock 18 |
| chamfer | 3704 | 61.6 % | 91.0 % | chamfer 2282, stock 494, rectangular_pocket 293, rectangular_passage 185 |
| rectangular_blind_slot | 3603 | 86.4 % | 75.3 % | rectangular_blind_slot 3112, rectangular_pocket 461, rectangular_through_slot 15, other:boss 8 |
| v_circular_end_blind_slot | 2761 | 79.8 % | 96.3 % | v_circular_end_blind_slot 2202, circular_end_pocket 286, triangular_pocket 146, stock 54 |
| triangular_through_slot | 2588 | 53.0 % | 98.0 % | triangular_through_slot 1372, stock 540, triangular_passage 308, slanted_through_step 131 |
| h_circular_end_blind_slot | 2287 | 90.0 % | 97.7 % | h_circular_end_blind_slot 2058, rectangular_pocket 100, round 43, 2sides_through_step 30 |
| circular_through_slot | 1391 | 89.9 % | 77.7 % | circular_through_slot 1250, stock 135, circular_end_pocket 3, blind_hole 1 |
| round | 1209 | 84.7 % | 91.7 % | round 1024, stock 62, 6sides_pocket 31, rectangular_pocket 27 |

## Worst parts (process level)

- 51713.step: 21 %
- 26010.step: 29 %
- 25853.step: 37 %
- 52271.step: 43 %
- 14116.step: 44 %
- 13191.step: 47 %
- 53134.step: 48 %
- 14391.step: 48 %
- 50460.step: 48 %
- 59753.step: 48 %
- 51331.step: 49 %
- 46813.step: 50 %
- 24979.step: 51 %
- 19914.step: 52 %
- 51906.step: 52 %
