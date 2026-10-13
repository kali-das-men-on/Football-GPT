"""
Builds the LangChain agent and exposes one function, analyze_players(),
for the rest of the app to call.

Compared to the original agent.py, three things changed:
1. The agent.invoke(...) call is no longer at module level. Module-level
   code runs the moment anything imports this file -- which would mean
   FastAPI accidentally calling the LLM once on server startup with the
   hardcoded player list. It's wrapped in a function instead.
2. The agent is built once and cached (see get_agent), not rebuilt on
   every request -- rebuilding it would mean recreating the OpenRouter
   client on every single API call.
3. response_format=ToolStrategy(AnalysisResult) is now actually passed
   to create_agent. In the original file, ResponseFormat was defined but
   never wired in, so the agent had no structured output configured.
"""

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.prompt import prompt as system_prompt
from backend.tools import AnalysisResult, get_football_data


load_dotenv()

_agent = None


def _build_agent():
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        raise RuntimeError(
            "OPEN_ROUTER_API_KEY is not set. Add it to backend/.env "
            "(copy backend/.env.example to get started)."
        )
    llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    google_api_key=api_key
    )
    return create_agent(
        model=llm,
        tools=[get_football_data],
        system_prompt=system_prompt,
        response_format=ToolStrategy(AnalysisResult),
    )


def get_agent():
    global _agent
    if _agent is None:
        _agent = _build_agent()
    return _agent


def analyze_players(players: list[str]) -> AnalysisResult:
    agent = get_agent()
    player_list = ", ".join(players)

    response = agent.invoke({"messages": [{"role": "user", "content": player_list}]})

    structured = response.get("structured_response")
    if structured is None:
        raise RuntimeError(
            "The model did not return a structured response. This can happen "
            "with some free-tier models -- see README.md for notes on swapping "
            "the model."
        )
    return structured