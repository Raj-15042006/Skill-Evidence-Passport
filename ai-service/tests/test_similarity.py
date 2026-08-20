import pytest
import numpy as np
from app.pipeline.similarity import check_similarity, exemplar_store
from app.pipeline.embeddings import embed


@pytest.fixture(autouse=True)
def clean_exemplar_store():
    exemplar_store.clear()
    yield
    exemplar_store.clear()


def test_similarity_no_exemplars():
    text = "Building docker microservices."
    emb = embed(text)
    res = check_similarity(emb, skill_id="cloud-architecture")
    assert res.is_similar is False
    assert res.max_similarity_score == 0.0


def test_similarity_matching():
    text1 = "Architected AWS infrastructure with VPC, ALB, and terraform scripts."
    text2 = "Architected AWS infrastructure with VPC, ALB, and terraform scripts."
    
    emb1 = embed(text1)
    emb2 = embed(text2)

    skill = "cloud-architecture"
    exemplar_store.add_exemplar(skill, evidence_id="ex_001", embedding=emb1)

    res = check_similarity(emb2, skill_id=skill, threshold=0.85)
    assert res.is_similar is True
    assert res.max_similarity_score >= 0.85
    assert res.matched_evidence_id == "ex_001"


def test_similarity_scoped_per_skill():
    # Adding exemplar under python-programming skill
    emb = embed("Python pytest testing script")
    exemplar_store.add_exemplar("python-programming", evidence_id="py_01", embedding=emb)

    # Checking under devops-ci-cd skill should return no matches (scoped per skill)
    res = check_similarity(emb, skill_id="devops-ci-cd")
    assert res.is_similar is False
    assert res.max_similarity_score == 0.0
