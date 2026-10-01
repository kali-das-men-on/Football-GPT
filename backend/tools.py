"""
Tools the agent can call, and the shape of its final answer.

Keeping these in their own file (separate from the agent wiring in
agent_service.py) means you can test get_football_data() by itself,
with no LLM involved, just by importing this module.
"""

from typing import List

import requests
from langchain.tools import tool
from pydantic import BaseModel

class PlayerScore(BaseModel):
    name: str
    summary: str
    score: float


class AnalysisResult(BaseModel):
    players: List[PlayerScore]
    overall_summary: str



@tool(
    "get_football_data",
    description="Look up raw statistics and bio info for a single footballer by name.",
)
def get_football_data(name: str) -> dict:
    """Call TheSportsDB's free player-search endpoint for one player."""
    response = requests.get(
        "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php",
        params={"p": name},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()