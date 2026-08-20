import pytest
import numpy as np
from app.pipeline.embeddings import embed


def test_embed_shape_and_type():
    text = "Asynchronous REST API engineering in Python using FastAPI."
    vec = embed(text)
    assert isinstance(vec, np.ndarray)
    assert vec.shape == (384,)
    assert vec.dtype == np.float32


def test_embed_empty_text():
    vec = embed("")
    assert isinstance(vec, np.ndarray)
    assert vec.shape == (384,)
    assert np.all(vec == 0.0)


def test_embed_normalization():
    text = "Machine learning model evaluation with precision and recall metrics."
    vec = embed(text)
    norm = np.linalg.norm(vec)
    if norm > 0:
        assert pytest.approx(norm, abs=1e-4) == 1.0


def test_embed_reproducibility():
    text = "Cloud architecture deployment using Terraform on AWS."
    vec1 = embed(text)
    vec2 = embed(text)
    np.testing.assert_array_almost_equal(vec1, vec2)
