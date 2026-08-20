import os
import pytest
from app.pipeline.rubric_model import (
    RulesBasedRubricModel,
    MLRubricModel,
    get_rubric_model,
    BaseRubricModel
)
from app.models.schemas import RubricSuggestion


def test_rules_based_rubric_model_interface():
    model = RulesBasedRubricModel()
    assert isinstance(model, BaseRubricModel)

    text = "Implemented asynchronous REST endpoints in Python using FastAPI, Pydantic, and pytest."
    suggestions = model.predict(text, skill_id="python-programming")
    
    assert isinstance(suggestions, list)
    assert len(suggestions) >= 3
    assert all(isinstance(s, RubricSuggestion) for s in suggestions)
    
    conf = model.predict_confidence(text, skill_id="python-programming")
    assert 0.0 <= conf <= 1.0


def test_rubric_model_factory_fallback():
    # Calling get_rubric_model with non-existent path must gracefully return RulesBasedRubricModel
    model = get_rubric_model(model_path="non_existent_model_file.joblib")
    assert isinstance(model, RulesBasedRubricModel)


def test_model_interface_interchangeability(tmp_path):
    # Test that trained MLRubricModel implements exact same interface as RulesBasedRubricModel
    import joblib
    from sklearn.ensemble import GradientBoostingClassifier
    import numpy as np

    # Train dummy clf for testing interface contract
    X = np.random.rand(10, 5).astype(np.float32)
    y = np.array([0, 1, 2, 0, 1, 2, 0, 1, 2, 0])
    clf = GradientBoostingClassifier(n_estimators=5, random_state=42)
    clf.fit(X, y)

    dummy_model_path = os.path.join(tmp_path, "dummy_model.joblib")
    joblib.dump({"model": clf, "model_version": "v1.0.0-test"}, dummy_model_path)

    ml_model = get_rubric_model(model_path=dummy_model_path)
    rules_model = RulesBasedRubricModel()

    sample_text = "Building docker containers and terraform scripts on AWS cloud."
    skill = "cloud-architecture"

    # Both models must accept exact same input parameters
    ml_suggestions = ml_model.predict(sample_text, skill)
    rules_suggestions = rules_model.predict(sample_text, skill)

    ml_conf = ml_model.predict_confidence(sample_text, skill)
    rules_conf = rules_model.predict_confidence(sample_text, skill)

    assert len(ml_suggestions) == len(rules_suggestions)
    assert isinstance(ml_conf, float)
    assert isinstance(rules_conf, float)
