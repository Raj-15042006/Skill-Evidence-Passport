import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "AI/ML Skills Evidence Advisory Service")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_TOPIC_SUBMITTED: str = os.getenv("KAFKA_TOPIC_SUBMITTED", "evidence.submitted")
    KAFKA_TOPIC_SCORED: str = os.getenv("KAFKA_TOPIC_SCORED", "evidence.ai_scored")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "app/models/rubric_model.joblib")
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.85"))

settings = Settings()
