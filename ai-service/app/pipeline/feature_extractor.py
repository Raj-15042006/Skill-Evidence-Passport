import re
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from app.pipeline.rubric_model import SKILL_TAXONOMY

ACTION_VERBS = [
    "implemented", "developed", "built", "architected", "designed",
    "configured", "deployed", "analyzed", "engineered", "created",
    "constructed", "executed", "integrated", "benchmarked", "automated",
    "conducted", "optimized", "published", "tested", "evaluated", "trained",
    "audited", "modeled", "simulated", "synthesized", "verified"
]


def resolve_dynamic_keywords(skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> List[str]:
    """
    Dynamically extracts target keywords for ANY skill_id (including 800+ multi-domain dataset skills).
    """
    if skill_id in SKILL_TAXONOMY:
        return SKILL_TAXONOMY[skill_id]["keywords"]

    # If skill_id has extra_features with skill_name / description, use them
    if extra_features:
        name = str(extra_features.get("skill_name", "")).lower()
        desc = str(extra_features.get("skill_description", "")).lower()
        cat = str(extra_features.get("skill_category", "")).lower()
        tokens = re.findall(r'\b[a-[a-z0-9+#]{2,}\b', f"{name} {desc} {cat}")
        if tokens:
            return list(set(tokens))

    # Derive keywords from skill_id slug
    slug_parts = re.split(r'[-_]', str(skill_id).lower())
    base_keywords = [p for p in slug_parts if len(p) > 2]
    
    # Add common domain variations
    expanded = set(base_keywords)
    for p in base_keywords:
        if p == "python": expanded.update(["def", "class", "async", "pytest", "fastapi", "pip"])
        elif p == "react": expanded.update(["jsx", "tsx", "hooks", "component", "state", "virtualization"])
        elif p == "quantum": expanded.update(["qubit", "qiskit", "circuit", "gate", "superposition", "shor"])
        elif p == "cybersecurity": expanded.update(["owasp", "siem", "firewall", "vulnerability", "encryption"])
        elif p == "robotics": expanded.update(["ros2", "gazebo", "kinematics", "slam", "lidar", "autonomous"])
        elif p == "cad": expanded.update(["solidworks", "fea", "ansys", "parametric", "3d", "drawing"])
        elif p == "bioinformatics": expanded.update(["ngs", "pymol", "blast", "biopython", "dna", "sequence"])
        elif p == "finance": expanded.update(["dcf", "valuation", "excel", "accounting", "model", "forecasting"])

    return list(expanded)


def extract_features_dict(text: str, skill_id: str, extra_features: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Unified NLP & tabular feature extractor used by ML model training and FastAPI inference.
    Supports ALL 800+ multi-domain skills dynamically.
    """
    text_clean = str(text or "").strip()
    text_lower = text_clean.lower()
    words = text_clean.split()
    word_count = len(words)
    char_count = len(text_clean)

    # 1. Target taxonomy keyword matching (Dynamic for all 800+ skills)
    target_kws = resolve_dynamic_keywords(skill_id, extra_features)
    matched_kws = [kw for kw in target_kws if re.search(r'\b' + re.escape(kw) + r'\b', text_lower)]
    kw_count = len(matched_kws)
    kw_ratio = kw_count / max(1, len(target_kws))

    # 2. Off-target taxonomy keyword matching (domain specificity check)
    off_target_kws = []
    for other_skill_id, other_tax in SKILL_TAXONOMY.items():
        if other_skill_id != skill_id:
            for kw in other_tax["keywords"]:
                if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                    off_target_kws.append(kw)
    off_target_count = len(off_target_kws)

    # 3. Technical Action Verbs
    verb_count = sum(1 for verb in ACTION_VERBS if re.search(r'\b' + re.escape(verb) + r'\b', text_lower))

    # 4. Syntactic Markers (Repo URLs, metrics/numbers, code markers)
    has_repo_url = 1.0 if re.search(r'https?://|github\.com|gitlab\.com|\brepo\b', text_lower) else 0.0
    has_metrics = 1.0 if re.search(r'\d+%\b|\b\d+k\b|\b\d+\.\d+\b|\b\d+ms\b|\buptime\b|\bauc\b|\bwcag\b|\b9\d%\b', text_lower) else 0.0
    has_code_markers = 1.0 if re.search(r'```|\bdef\b|\bclass\b|\bfunction\b|\bimport\b|\bselect\b|\bfrom\b|\bconst\b|\bstruct\b', text_lower) else 0.0

    # 5. External similarity score
    sim_score = 0.0
    if extra_features and "similarity_score" in extra_features:
        sim_score = float(extra_features["similarity_score"])

    # 6. Type Token Ratio (Vocabulary Diversity)
    unique_words = len(set(w.lower() for w in words)) if words else 0
    type_token_ratio = unique_words / max(1, word_count)

    return {
        "evidence_text": text_clean,
        "word_count": float(word_count),
        "char_count": float(char_count),
        "kw_count": float(kw_count),
        "kw_ratio": float(kw_ratio),
        "off_target_count": float(off_target_count),
        "verb_count": float(verb_count),
        "has_repo_url": float(has_repo_url),
        "has_metrics": float(has_metrics),
        "has_code_markers": float(has_code_markers),
        "sim_score": float(sim_score),
        "type_token_ratio": float(type_token_ratio),
        "matched_keywords": matched_kws,
    }
