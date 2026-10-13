"""
Deterministic football-data endpoints.

Adapt the bodies of these endpoints to the functions already exposed by
tools.py/api.js. The route contracts can remain stable even when data providers
change.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/football", tags=["Football"])


@router.get("/players")
async def players(search: Optional[str] = Query(default=None, min_length=1)):
    # Replace this placeholder with your existing player-search tool.
    # Keeping the route stable makes the frontend independent of provider details.
    if not search:
        return {"items": [], "query": None}
    return {"items": [], "query": search}


@router.get("/teams")
async def teams(search: Optional[str] = Query(default=None, min_length=1)):
    return {"items": [], "query": search}


@router.get("/matches")
async def matches(
    team: Optional[str] = None,
    limit: int = Query(default=10, ge=1, le=50),
):
    return {"items": [], "team": team, "limit": limit}


@router.get("/stats")
async def stats(team: Optional[str] = None):
    return {"team": team, "stats": {}}


@router.get("/search")
async def universal_search(q: str = Query(min_length=2)):
    return {
        "query": q,
        "players": [],
        "teams": [],
        "matches": [],
    }
