import logging
from typing import Dict, List, Tuple, Optional
import numpy as np
from app.models.schemas import SimilarityResult
from app.config import settings

logger = logging.getLogger(__name__)


class ExemplarStore:
    """
    In-memory registry of prior approved submission embeddings, partitioned by skill_id.
    Prevents full-corpus scan and keeps similarity matching performant per skill.
    """
    def __init__(self):
        # Map: skill_id -> List[Tuple[evidence_id, embedding_vector]]
        self._store: Dict[str, List[Tuple[str, np.ndarray]]] = {}

    def add_exemplar(self, skill_id: str, evidence_id: str, embedding: np.ndarray):
        if skill_id not in self._store:
            self._store[skill_id] = []
        norm = np.linalg.norm(embedding)
        normalized_emb = (embedding / norm) if norm > 0 else embedding
        self._store[skill_id].append((evidence_id, normalized_emb.astype(np.float32)))

    def get_exemplars(self, skill_id: str) -> List[Tuple[str, np.ndarray]]:
        return self._store.get(skill_id, [])

    def clear(self):
        self._store.clear()


# Singleton instance of exemplar store
exemplar_store = ExemplarStore()


def check_similarity(
    embedding: np.ndarray,
    skill_id: str,
    threshold: Optional[float] = None
) -> SimilarityResult:
    """
    Compares embedding against prior approved submissions for the specified skill_id using cosine similarity.
    Returns SimilarityResult with boolean flag (True if similarity >= threshold) and top score.
    """
    if threshold is None:
        threshold = settings.SIMILARITY_THRESHOLD

    if embedding is None or len(embedding) == 0:
        return SimilarityResult(is_similar=False, max_similarity_score=0.0)

    norm = np.linalg.norm(embedding)
    query_emb = (embedding / norm) if norm > 0 else embedding

    exemplars = exemplar_store.get_exemplars(skill_id)
    if not exemplars:
        return SimilarityResult(is_similar=False, max_similarity_score=0.0)

    max_sim = 0.0
    matched_id = None

    for eid, ex_emb in exemplars:
        sim = float(np.dot(query_emb, ex_emb))
        if sim > max_sim:
            max_sim = sim
            matched_id = eid

    is_dup = max_sim >= threshold
    return SimilarityResult(
        is_similar=is_dup,
        max_similarity_score=round(max_sim, 4),
        matched_evidence_id=matched_id
    )
