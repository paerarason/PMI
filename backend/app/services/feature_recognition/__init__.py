"""Deterministic, geometry-based manufacturing-feature recognition on an OCC B-Rep.

The feature is the central object of the quality platform (STEP → features → PMI → characteristics →
FAI). This package turns a `TopoDS_Shape` into a list of `FeatureCandidate`s (holes, shafts/bosses,
planes, chamfers, countersinks, fillets, …), each with confidence and human-readable evidence, keeping
references back to the canonical face/edge ids (`tessellator.iter_faces` / `iter_edges`) so a feature
stays linked to the actual CAD geometry.

Truth is geometric (surface type, radius, axis, adjacency), never guessed — see the recognizers.
"""
from __future__ import annotations

from app.services.feature_recognition.engine import recognize_features
from app.services.feature_recognition.types import FeatureCandidate, FeatureState, FeatureType

__all__ = ["recognize_features", "FeatureCandidate", "FeatureState", "FeatureType"]
