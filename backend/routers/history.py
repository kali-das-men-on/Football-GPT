from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/history", tags=["History"])

_HISTORY: list[dict] = []


class HistoryItem(BaseModel):
    query: str = Field(min_length=1, max_length=200)
    response: str = Field(default="", max_length=10000)


@router.get("")
async def history(limit: int = 20):
    return {"items": _HISTORY[-limit:]}


@router.post("")
async def add_history(item: HistoryItem):
    record = {
        "query": item.query,
        "response": item.response,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _HISTORY.append(record)
    return record


@router.delete("")
async def clear_history():
    _HISTORY.clear()
    return {"cleared": True}
