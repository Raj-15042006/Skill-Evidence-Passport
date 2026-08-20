import os
import re
import logging
import joblib
import numpy as np
import pandas as pd
from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any, Tuple

from app.models.schemas import RubricSuggestion
from app.config import settings

logger = logging.getLogger(__name__)

# Standard skill taxonomies for keyword matching & rule-based heuristic fallback
SKILL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "python-programming": {
        "keywords": ["python", "def", "class", "async", "pytest", "fastapi", "pip", "exception", "dict", "list", "return", "type", "import", "module", "pydantic", "sqlalchemy", "numpy", "pandas", "requests"],
        "description": "Python software development, async execution, testing, and API engineering."
    },
    "data-analysis": {
        "keywords": ["data", "pandas", "numpy", "visualization", "chart", "regression", "clustering", "cleaning", "csv", "dataframe", "sql", "analysis", "statistics", "scipy", "seaborn", "scikit-learn", "matplotlib", "tableau"],
        "description": "Data manipulation, exploratory analysis, statistical modeling, and data visualization."
    },
    "cloud-architecture": {
        "keywords": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "iam", "s3", "microservices", "cloud", "vpc", "deployment", "serverless", "fargate", "helm", "ecs", "alb", "load balancer", "topology"],
        "description": "Cloud infrastructure, container orchestration, IAM, and infrastructure as code."
    },
    "ui-ux-design": {
        "keywords": ["figma", "wireframe", "prototype", "user testing", "accessibility", "ui", "ux", "design system", "component", "layout", "interaction", "usability", "wcag", "heatmap", "persona"],
        "description": "User interface design, prototyping, usability testing, and design systems."
    },
    "devops-ci-cd": {
        "keywords": ["jenkins", "github actions", "pipeline", "docker", "container", "yaml", "bash", "deployment", "build", "ci/cd", "monitoring", "git", "release", "trivy", "argocd", "helm", "sonarqube"],
        "description": "Continuous integration, automated deployment pipelines, and environment management."
    },
    "cybersecurity-defense": {
        "keywords": ["cybersecurity", "penetration", "owasp", "vulnerability", "siem", "firewall", "encryption", "wireshark", "nmap", "auth", "zero-trust", "audit", "soc2", "mitre", "xss"],
        "description": "Network security auditing, SIEM log analysis, penetration testing, zero-trust architecture, and vulnerability remediation."
    },
    "ai-ml-engineering": {
        "keywords": ["llm", "rag", "langchain", "vector", "embeddings", "pgvector", "openai", "transformers", "fine-tuning", "prompt", "huggingface", "pytorch", "tensorflow", "quantization"],
        "description": "Generative AI applications, RAG vector search pipelines, LLM fine-tuning, and model deployment."
    },
    "product-management": {
        "keywords": ["prd", "agile", "scrum", "roadmap", "user stories", "kpi", "okr", "jira", "wireframe", "sprint", "analytics", "persona", "prioritization", "backlog"],
        "description": "Product requirement documentation, user story mapping, Agile sprint metrics, and OKR tracking."
    },
    "database-engineering": {
        "keywords": ["sql", "postgresql", "redis", "database", "schema", "indexing", "migration", "query", "acid", "sharding", "orm", "nosql", "mongodb", "transaction", "explain"],
        "description": "Relational schema design, query optimization, distributed caching, and database migration engineering."
    },
    "mobile-development": {
        "keywords": ["flutter", "react native", "swift", "kotlin", "mobile", "ios", "android", "sqlite", "apk", "testflight", "device", "xcode", "gradle", "dart"],
        "description": "Cross-platform mobile application development, offline data synchronization, and mobile CI/CD release engineering."
    }
}


class BaseRubricModel(ABC):
    """Abstract Base Class for Rubric Suggestion Models."""
    
    @abstractmethod
    def predict(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> List[RubricSuggestion]:
        """Returns advisory rubric suggestions breakdown."""
        pass

    @abstractmethod
    def predict_confidence(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> float:
        """Returns model prediction confidence (0.0 to 1.0)."""
        pass


class RulesBasedRubricModel(BaseRubricModel):
    """
    Layer 1: Rules-based fallback rubric model.
    Evaluates keyword overlap with skill taxonomy + text length heuristics.
    Operates with ZERO trained model dependency.
    """

    def _get_matched_keywords(self, text: str, skill_id: str) -> List[str]:
        text_lower = (text or "").lower()
        taxonomy = SKILL_TAXONOMY.get(skill_id, SKILL_TAXONOMY.get("python-programming"))
        kw_list = taxonomy["keywords"]
        matched = [kw for kw in kw_list if re.search(r'\b' + re.escape(kw) + r'\b', text_lower)]
        return matched

    def predict(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> List[RubricSuggestion]:
        matched_kw = self._get_matched_keywords(text, skill_id)
        words = (text or "").strip().split()
        word_count = len(words)

        # 1. Demonstrated Relevance
        rel_ratio = min(1.0, len(matched_kw) / 5.0)
        rel_score = round(max(0.2, rel_ratio), 2)
        rel_rationale = (
            f"Matched {len(matched_kw)} domain keyword(s): {', '.join(matched_kw[:5])}"
            if matched_kw else "Low domain keyword alignment detected in submission text."
        )

        # 2. Evidence Completeness
        if word_count > 150:
            comp_score = 0.90
            comp_rationale = f"Comprehensive written evidence provided ({word_count} words)."
        elif word_count > 50:
            comp_score = 0.65
            comp_rationale = f"Moderate evidence length provided ({word_count} words)."
        else:
            comp_score = 0.35
            comp_rationale = f"Brief submission ({word_count} words), additional context recommended."

        # 3. Technical Depth
        depth_score = round(min(1.0, (rel_score * 0.6) + (comp_score * 0.4)), 2)
        depth_rationale = f"Advisory technical depth derived from heuristic text analysis."

        return [
            RubricSuggestion(
                dimension="demonstrated_relevance",
                suggested_score=rel_score,
                rationale=rel_rationale,
                matched_keywords=matched_kw
            ),
            RubricSuggestion(
                dimension="evidence_completeness",
                suggested_score=comp_score,
                rationale=comp_rationale,
                matched_keywords=matched_kw
            ),
            RubricSuggestion(
                dimension="technical_depth",
                suggested_score=depth_score,
                rationale=depth_rationale,
                matched_keywords=matched_kw
            ),
        ]

    def predict_confidence(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> float:
        # Rules-based fallback outputs low-to-medium confidence (0.40 - 0.60)
        words = (text or "").strip().split()
        matched = self._get_matched_keywords(text, skill_id)
        if len(words) > 50 and len(matched) >= 2:
            return 0.60
        elif len(words) > 20:
            return 0.50
        return 0.40


class MLRubricModel(BaseRubricModel):
    """
    Layer 2: Upgraded Trained scikit-learn Pipeline wrapper.
    Uses TF-IDF + Calibrated GradientBoostingClassifier model pipeline to generate advisory scores and confidence.
    """

    def __init__(self, model_path: str):
        logger.info(f"Loading trained ML model from: {model_path}")
        loaded = joblib.load(model_path)
        if isinstance(loaded, dict):
            self.model = loaded.get("pipeline") or loaded.get("model")
            self.model_version = loaded.get("model_version", "v2.0.0-ml-gbt")
            self.metrics = loaded.get("metrics", {})
        else:
            self.model = loaded
            self.model_version = "v2.0.0-ml-gbt"
            self.metrics = {}

    def _prepare_input_df(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> Tuple[pd.DataFrame, List[str]]:
        from app.pipeline.feature_extractor import extract_features_dict
        f_dict = extract_features_dict(text, skill_id, extra_features)
        matched_kws = f_dict.pop("matched_keywords", [])
        
        # Build single row DataFrame matching pipeline features
        df = pd.DataFrame([f_dict])
        return df, matched_kws

    def predict(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> List[RubricSuggestion]:
        try:
            input_df, matched_kw = self._prepare_input_df(text, skill_id, extra_features)

            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(input_df)[0]
                classes = list(getattr(self.model, "classes_", [0, 1, 2]))
                
                approved_idx = classes.index(2) if 2 in classes else -1
                approved_p = float(probs[approved_idx]) if approved_idx != -1 else float(probs[-1])
                needs_info_p = float(probs[classes.index(0)]) if 0 in classes else 0.2
            else:
                pred = self.model.predict(input_df)[0]
                approved_p = 0.85 if pred in (2, "approved") else 0.30
                needs_info_p = 0.2

            rel_score = round(min(1.0, approved_p * 1.05), 2)
            comp_score = round(min(1.0, max(0.2, (1.0 - needs_info_p) * 0.9 + (approved_p * 0.1))), 2)
            depth_score = round(float(approved_p), 2)

            rel_rationale = f"ML TF-IDF & Gradient Boosting predicted high taxonomy relevance ({approved_p*100:.1f}% confidence)."
            comp_rationale = f"ML Pipeline evaluated evidence completeness and structural metrics."
            depth_rationale = f"Calibrated ML model predicted overall competency level: {approved_p:.2f}."

            return [
                RubricSuggestion(
                    dimension="demonstrated_relevance",
                    suggested_score=rel_score,
                    rationale=rel_rationale,
                    matched_keywords=matched_kw
                ),
                RubricSuggestion(
                    dimension="evidence_completeness",
                    suggested_score=comp_score,
                    rationale=comp_rationale,
                    matched_keywords=matched_kw
                ),
                RubricSuggestion(
                    dimension="technical_depth",
                    suggested_score=depth_score,
                    rationale=depth_rationale,
                    matched_keywords=matched_kw
                )
            ]

        except Exception as e:
            logger.error(f"Fallback to feature matrix scoring due to: {e}")
            # Robust legacy fallback if pipeline shape differs
            words = (text or "").strip().split()
            word_count = len(words)
            taxonomy = SKILL_TAXONOMY.get(skill_id, SKILL_TAXONOMY.get("python-programming"))
            matched_kw = [kw for kw in taxonomy["keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', (text or "").lower())]
            score_val = round(min(0.95, max(0.35, len(matched_kw) * 0.25 + (word_count / 200.0))), 2)
            return [
                RubricSuggestion(
                    dimension="demonstrated_relevance",
                    suggested_score=score_val,
                    rationale=f"ML Heuristic fallback domain scoring.",
                    matched_keywords=matched_kw
                ),
                RubricSuggestion(
                    dimension="evidence_completeness",
                    suggested_score=score_val,
                    rationale=f"ML Heuristic fallback completeness scoring.",
                    matched_keywords=matched_kw
                ),
                RubricSuggestion(
                    dimension="technical_depth",
                    suggested_score=score_val,
                    rationale=f"ML Heuristic fallback technical scoring.",
                    matched_keywords=matched_kw
                )
            ]

    def predict_confidence(self, text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> float:
        try:
            input_df, matched_kw = self._prepare_input_df(text, skill_id, extra_features)
            words = (text or "").strip().split()
            word_count = len(words)

            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(input_df)[0]
                max_p = float(np.max(probs))
                
                # If no domain keywords matched at all, treat as low-confidence/spam
                if not matched_kw:
                    return round(min(0.45, max_p * 0.50), 2)

                # Dynamic ML confidence for genuine technical evidence
                base_conf = max_p * 0.95
                if matched_kw:
                    base_conf += min(0.12, len(matched_kw) * 0.04)
                if word_count > 15:
                    base_conf += min(0.08, (word_count - 15) * 0.002)

                return round(max(0.65, min(0.98, base_conf)), 2)

            return 0.85
        except Exception:
            return 0.78


def get_rubric_model(model_path: Optional[str] = None) -> BaseRubricModel:
    """
    Factory function for obtaining the rubric model.
    Swaps in MLRubricModel if model file exists, otherwise falls back seamlessly to RulesBasedRubricModel.
    """
    target_path = model_path or settings.MODEL_PATH
    if target_path and os.path.exists(target_path):
        try:
            return MLRubricModel(target_path)
        except Exception as e:
            logger.warning(f"Failed to load trained model at {target_path}: {e}. Falling back to RulesBasedRubricModel.")
    
    logger.info("Using RulesBasedRubricModel fallback.")
    return RulesBasedRubricModel()
