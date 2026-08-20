from typing import List, Optional
from pydantic import BaseModel, Field


class ScoreRequest(BaseModel):
    evidence_id: str = Field(..., description="Unique ID of the submitted evidence")
    skill_id: str = Field(..., description="Identifier for the skill being claimed")
    file_url: Optional[str] = Field(None, description="URL or file path of the evidence file")
    content_type: Optional[str] = Field(None, description="Optional MIME type or extension of the file")
    raw_text: Optional[str] = Field(None, description="Direct text input if available")


class RubricSuggestion(BaseModel):
    dimension: str = Field(..., description="Rubric evaluation category, e.g. technical_depth, relevance")
    suggested_score: float = Field(..., description="Advisory score between 0.0 and 1.0")
    rationale: str = Field(..., description="Explanation supporting the advisory rubric score")
    matched_keywords: List[str] = Field(default_factory=list, description="Keywords matched in submission")


class ScoreResponse(BaseModel):
    evidence_id: str = Field(..., description="Unique ID of the submitted evidence")
    confidence: float = Field(..., description="Model confidence score in advisory output (0.0 to 1.0)")
    rubric_suggestions: List[RubricSuggestion] = Field(..., description="Advisory rubric feedback breakdown")
    similarity_flag: bool = Field(..., description="True if submission is highly similar to existing exemplar evidence")
    top_similarity_score: float = Field(0.0, description="Highest cosine similarity score against prior submissions")
    model_version: str = Field("v1.0.0-rules", description="Version of the model used for scoring")
    low_confidence_extraction: bool = Field(False, description="Flagged True if text extraction quality was low")
    error_reason: Optional[str] = Field(None, description="Detailed reason if scoring failed or degraded")


class ExtractionResult(BaseModel):
    text: str
    low_confidence_extraction: bool = False
    extraction_method: str = "plain_text"
    error_message: Optional[str] = None


class SimilarityResult(BaseModel):
    is_similar: bool
    max_similarity_score: float
    matched_evidence_id: Optional[str] = None
