import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_score_contract_schema():
    payload = {
        "evidence_id": "ev_contract_001",
        "skill_id": "python-programming",
        "raw_text": "Developed REST API endpoints using FastAPI and Pytest. Written comprehensive documentation and unit test suites."
    }
    response = client.post("/score", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    # Contract validation
    assert "confidence" in data
    assert "rubric_suggestions" in data
    assert "similarity_flag" in data
    assert "model_version" in data
    assert data["evidence_id"] == "ev_contract_001"
    
    # HARD CONSTRAINT VALIDATION: Advisory only, no auto-approval decision fields present!
    assert "approved" not in data
    assert "rejected" not in data
    assert "auto_approve" not in data
    assert "final_decision" not in data

    assert isinstance(data["confidence"], float)
    assert isinstance(data["rubric_suggestions"], list)
    assert isinstance(data["similarity_flag"], bool)


def test_score_graceful_degradation_empty_input():
    # Empty input should return 200 with confidence 0.0 and error_reason, NOT 500
    payload = {
        "evidence_id": "ev_empty_001",
        "skill_id": "python-programming",
        "raw_text": ""
    }
    response = client.post("/score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["confidence"] == 0.0
    assert data["error_reason"] is not None
    assert "empty" in data["error_reason"].lower() or "no valid" in data["error_reason"].lower()


def test_model_info_endpoint():
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "model_version" in data
    assert "is_trained_ml_model" in data
    assert data["status"] == "ready"


def test_model_eval_endpoint():
    response = client.get("/model/eval")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "accuracy" in data["metrics"]
    assert "comparison_vs_baseline" in data

