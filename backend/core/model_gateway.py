"""
Resilient LLM gateway for Football-GPT.

Strategy:
1. Prefer a local Ollama model when OLLAMA_BASE_URL is configured.
2. Otherwise use the configured primary external provider.
3. Retry transient failures with exponential backoff + jitter.
4. Fall back to the secondary provider.
5. Return a deterministic degraded response rather than crashing the API.

This module is intentionally independent from agent_service.py so the existing
LangChain agent can be migrated incrementally.
"""

from __future__ import annotations

import asyncio
import logging
import os
import random
from dataclasses import dataclass
from typing import Any, Optional

from langchain_core.messages import BaseMessage
from langchain_core.language_models import BaseChatModel
from langchain_openai import ChatOpenAI

try:
    from langchain_ollama import ChatOllama
except ImportError:  # optional dependency
    ChatOllama = None

logger = logging.getLogger(__name__)


@dataclass
class ProviderResult:
    provider: str
    response: Any
    degraded: bool = False


class ModelGateway:
    """Provider-aware gateway with retries, fallback and graceful degradation."""

    def __init__(self) -> None:
        self.primary = os.getenv("PRIMARY_LLM", "ollama").lower()
        self.secondary = os.getenv("SECONDARY_LLM", "openrouter").lower()
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        self.openrouter_model = os.getenv(
            "OPENROUTER_MODEL", "openai/gpt-4o-mini"
        )
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.max_retries = int(os.getenv("LLM_MAX_RETRIES", "2"))
        self.timeout = float(os.getenv("LLM_TIMEOUT_SECONDS", "30"))

    def _build(self, provider: str) -> Optional[BaseChatModel]:
        if provider == "ollama":
            if ChatOllama is None:
                logger.warning("langchain-ollama is not installed")
                return None
            return ChatOllama(
                model=self.ollama_model,
                base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
                temperature=0.2,
            )

        if provider == "openrouter":
            key = os.getenv("OPENROUTER_API_KEY")
            if not key:
                return None
            return ChatOpenAI(
                model=self.openrouter_model,
                api_key=key,
                base_url="https://openrouter.ai/api/v1",
                temperature=0.2,
                timeout=self.timeout,
                max_retries=0,
            )

        if provider == "openai":
            key = os.getenv("OPENAI_API_KEY")
            if not key:
                return None
            return ChatOpenAI(
                model=self.openai_model,
                api_key=key,
                temperature=0.2,
                timeout=self.timeout,
                max_retries=0,
            )

        return None

    async def ainvoke(
        self,
        messages: list[BaseMessage],
        *,
        fallback_text: str = (
            "The AI service is temporarily unavailable. "
            "Football data endpoints are still available."
        ),
    ) -> ProviderResult:
        providers = [self.primary, self.secondary]
        if self.primary != "ollama" and "ollama" not in providers:
            # Local fallback is useful when Ollama is available.
            providers.append("ollama")

        for provider in providers:
            model = self._build(provider)
            if model is None:
                continue

            for attempt in range(self.max_retries + 1):
                try:
                    response = await model.ainvoke(messages)
                    return ProviderResult(provider=provider, response=response)
                except Exception as exc:
                    logger.warning(
                        "LLM provider=%s attempt=%s failed: %s",
                        provider,
                        attempt + 1,
                        exc,
                    )
                    if attempt < self.max_retries:
                        # Exponential backoff + jitter.
                        delay = (2 ** attempt) + random.uniform(0, 0.4)
                        await asyncio.sleep(delay)

        return ProviderResult(
            provider="degraded",
            response=fallback_text,
            degraded=True,
        )


gateway = ModelGateway()
