from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter(prefix="/api/health", tags=["Health"])


@router.get("")
async def health():
    return {
        "status": "ok",
        "service": "football-gpt-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/readiness")
async def readiness():
    # Keep this deterministic: application readiness should not depend on an LLM.
    return {"ready": True, "dependencies": {"api": True}}
