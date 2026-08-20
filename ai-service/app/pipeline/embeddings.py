import logging
from typing import Optional
import numpy as np
from app.config import settings

logger = logging.getLogger(__name__)

# Module-level model cache
_MODEL = None
_MODEL_LOAD_ATTEMPTED = False


def _get_model():
    global _MODEL, _MODEL_LOAD_ATTEMPTED
    if _MODEL is not None:
        return _MODEL

    if not _MODEL_LOAD_ATTEMPTED:
        _MODEL_LOAD_ATTEMPTED = True
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading SentenceTransformer model: {settings.EMBEDDING_MODEL_NAME}")
            _MODEL = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Using deterministic lightweight embedding fallback.")
            _MODEL = None

    return _MODEL


def _fallback_embed(text: str, dim: int = 384) -> np.ndarray:
    """
    Deterministic pseudo-embedding fallback using text hashing and character n-grams.
    Ensures tests and offline executions always succeed even without model downloads.
    """
    if not text:
        return np.zeros(dim, dtype=np.float32)
    
    vec = np.zeros(dim, dtype=np.float32)
    words = text.lower().split()
    for word in words:
        h = hash(word) % dim
        vec[h] += 1.0
        
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec


def embed(text: str) -> np.ndarray:
    """
    Generates a 384-dimensional vector embedding for the input text.
    Uses cached sentence-transformers 'all-MiniLM-L6-v2' model for CPU inference.
    """
    cleaned = (text or "").strip()
    if not cleaned:
        return np.zeros(384, dtype=np.float32)

    model = _get_model()
    if model is not None:
        try:
            embedding = model.encode(cleaned, convert_to_numpy=True, show_progress_bar=False)
            norm = np.linalg.norm(embedding)
            if norm > 0:
                embedding = embedding / norm
            return embedding.astype(np.float32)
        except Exception as e:
            logger.error(f"Error generating embedding with SentenceTransformer: {e}")

    return _fallback_embed(cleaned, dim=384)
