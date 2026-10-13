from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


class Feedback(BaseModel):
    request_id: str = Field(min_length=1, max_length=100)
    rating: int = Field(ge=1, le=5)
    comment: str = Field(default="", max_length=2000)


@router.post("")
async def submit_feedback(feedback: Feedback):
    # Replace with DB persistence when you introduce PostgreSQL/SQLite.
    return {"accepted": True, "feedback": feedback.model_dump()}
