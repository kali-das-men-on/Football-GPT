from typing import List

from pydantic import BaseModel, Field

from backend.tools import AnalysisResult


class AnalyzeRequest(BaseModel):
    players: List[str] = Field(
        ...,
        min_length=1,
        max_length=8,
        description="Footballer names to compare, e.g. ['Messi', 'Mbappe']",
    )


class AnalyzeResponse(BaseModel):
    analysis: AnalysisResult