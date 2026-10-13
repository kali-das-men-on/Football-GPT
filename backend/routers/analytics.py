from time import perf_counter
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


class AnalysisRequest(BaseModel):
    subject: str = Field(min_length=2, max_length=100)
    context: str = Field(default="", max_length=4000)


@router.post("/analyze")
async def analyze(payload: AnalysisRequest):
    """
    Stable application-level contract for tactical/football analysis.

    Wire this into agent_service.py. Keeping it behind a route gives the
    frontend a predictable API and lets you add caching/observability later.
    """
    started = perf_counter()

    return {
        "subject": payload.subject,
        "analysis": None,
        "status": "pending_agent_integration",
        "latency_ms": round((perf_counter() - started) * 1000, 2),
    }


@router.get("/overview")
async def overview():
    return {
        "metrics": {
            "requests": 0,
            "successful_requests": 0,
            "degraded_requests": 0,
        }
    }
