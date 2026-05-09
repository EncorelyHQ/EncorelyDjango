"""
Music — Algoritmo de compatibilidad
====================================
VibeCalculator: similitud del coseno entre vectores de audio features (Patrón Strategy).

Umbral del producto: score > 0.70 = compatibilidad certificada.
"""

from __future__ import annotations

import math
from typing import Any

import numpy as np

# Campos usados en la similitud (alineados con MusicVibeVector.to_dict())
VIBE_KEYS = ('energy', 'danceability', 'valence', 'tempo')

CERTIFIED_COMPATIBILITY_THRESHOLD = 0.70


class VibeCalculator:
    """
    Calcula la similitud entre dos vectores de vibe (0.0 a 1.0).

    Patrón Strategy: la lógica de scoring está encapsulada y puede evolucionar
    (ej. pesos por género) sin tocar los ViewSets.
    """

    @staticmethod
    def normalize(vector: dict[str, Any]) -> dict[str, float]:
        """Escala valores al rango [0, 1] por dimensión (min-max del par no disponible → clip)."""
        out: dict[str, float] = {}
        for k in VIBE_KEYS:
            v = float(vector.get(k, 0.0))
            out[k] = max(0.0, min(1.0, v))
        return out

    @staticmethod
    def calculate(vector_a: dict[str, Any], vector_b: dict[str, Any]) -> float:
        """Similitud del coseno entre dos dicts de features (4 dimensiones)."""
        a = VibeCalculator.normalize(vector_a)
        b = VibeCalculator.normalize(vector_b)
        va = np.array([a[k] for k in VIBE_KEYS], dtype=np.float64)
        vb = np.array([b[k] for k in VIBE_KEYS], dtype=np.float64)
        na = np.linalg.norm(va)
        nb = np.linalg.norm(vb)
        if na == 0 or nb == 0:
            return 0.0
        cos = float(np.dot(va, vb) / (na * nb))
        # Manejo numérico de ruido
        if not math.isfinite(cos):
            return 0.0
        return max(0.0, min(1.0, cos))
