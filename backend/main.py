"""
The FastAPI app itself. Deliberately thin: this file only defines routes
and wires them to agent_service.py. No LangChain code lives here.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.agent_service import analyze_players
from backend.models import AnalyzeRequest, AnalyzeResponse


app = FastAPI(title="Football GPT API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    try:
        result = analyze_players(body.players)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Upstream error: {exc}") from exc
    return AnalyzeResponse(analysis=result)