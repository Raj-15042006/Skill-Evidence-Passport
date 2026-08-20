import logging
from fastapi import FastAPI
from app.config import settings
from app.api.routes.score import router as score_router

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI/ML Advisory Service for Skill Evidence Passport. Provides advisory confidence, rubric suggestions, and similarity flags.",
    version="1.0.0",
)

app.include_router(score_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "app_name": settings.APP_NAME}
