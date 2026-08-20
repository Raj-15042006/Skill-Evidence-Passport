import pytest
from app.api.routes.score import score_evidence
from app.models.schemas import ScoreRequest

# Golden dataset regression test cases with expected score ranges
GOLDEN_DATASET = [
    {
        "id": "gold_python_high",
        "skill_id": "python-programming",
        "raw_text": "Implemented an asynchronous REST API using FastAPI and Pydantic. Added comprehensive unit tests using Pytest with 95% line coverage. Handled exceptions gracefully and integrated a Postgres database connection pool.",
        "min_confidence": 0.55,
        "max_confidence": 1.00,
        "min_rubric_avg": 0.60,
        "max_rubric_avg": 1.00
    },
    {
        "id": "gold_python_brief",
        "skill_id": "python-programming",
        "raw_text": "Wrote a small python script to scrape data.",
        "min_confidence": 0.35,
        "max_confidence": 1.00,
        "min_rubric_avg": 0.00,
        "max_rubric_avg": 0.70
    },
    {
        "id": "gold_cloud_high",
        "skill_id": "cloud-architecture",
        "raw_text": "Architected a multi-region AWS cloud infrastructure using Terraform. Configured VPC peering, ALB load balancers, ECS cluster with auto-scaling, and IAM least-privilege policies. Documented topology with architecture diagrams.",
        "min_confidence": 0.55,
        "max_confidence": 1.00,
        "min_rubric_avg": 0.60,
        "max_rubric_avg": 1.00
    },
    {
        "id": "gold_junk_spam",
        "skill_id": "data-analysis",
        "raw_text": "qwerty 12345 asdfgh zxcvbnm test test",
        "min_confidence": 0.10,
        "max_confidence": 0.55,
        "min_rubric_avg": 0.00,
        "max_rubric_avg": 0.45
    }
]


@pytest.mark.parametrize("item", GOLDEN_DATASET)
def test_golden_dataset_regression(item):
    req = ScoreRequest(
        evidence_id=item["id"],
        skill_id=item["skill_id"],
        raw_text=item["raw_text"]
    )
    res = score_evidence(req)

    # 1. Assert confidence falls within documented range
    assert item["min_confidence"] <= res.confidence <= item["max_confidence"], (
        f"Golden regression failure for {item['id']}: confidence {res.confidence} "
        f"outside range [{item['min_confidence']}, {item['max_confidence']}]"
    )

    # 2. Assert average rubric score falls within documented range
    if res.rubric_suggestions:
        rubric_avg = sum(s.suggested_score for s in res.rubric_suggestions) / len(res.rubric_suggestions)
        assert item["min_rubric_avg"] <= rubric_avg <= item["max_rubric_avg"], (
            f"Golden regression failure for {item['id']}: rubric average {rubric_avg:.2f} "
            f"outside range [{item['min_rubric_avg']}, {item['max_rubric_avg']}]"
        )
