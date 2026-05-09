import asyncio
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pathlib import Path
import os

# Explicitly load .env from the project root (ai-os/.env)
load_dotenv(Path(__file__).parent.parent / ".env")

api_key = os.getenv("GROQ_API_KEY")

CEO_MODEL = "llama-3.3-70b-versatile"
AGENT_MODEL = "llama-3.1-8b-instant"

print("GROQ KEY FOUND:", bool(api_key))
print(f"CEO MODEL:   {CEO_MODEL}")
print(f"AGENT MODEL: {AGENT_MODEL}")


def get_llm(model: str):
    return ChatGroq(
        model=model,
        api_key=api_key,
    )


def _is_rate_limit(e: Exception) -> bool:
    return "429" in str(e) or "rate_limit_exceeded" in str(e).lower()


async def _try_invoke(model: str, prompt: str) -> object | None:
    """Attempt a single LLM invoke. Returns response or None on failure."""
    try:
        print(f"\n[LLM] Trying model: {model}")
        llm = get_llm(model)
        response = await llm.ainvoke(prompt)
        print(f"[LLM] Success with: {model}")
        return response
    except Exception as e:
        print(f"[LLM] Failed model: {model}")
        print(f"[LLM] Error type: {type(e).__name__}")
        print(f"[LLM] Raw error: {e}")
        print(f"[LLM] {'─' * 50}")

        if _is_rate_limit(e):
            print("[LLM] Rate limited. Waiting before retry...")
            await asyncio.sleep(2)

        return None


async def _invoke_with_fallback(prompt: str, primary: str, fallback: str):
    """
    Try primary model once.
    On failure (including rate limit + sleep), retry primary once.
    If still failing, try fallback model once.
    Raises RuntimeError only if all attempts fail.
    """
    for model in [primary, primary, fallback]:
        response = await _try_invoke(model, prompt)
        if response is not None:
            return response

    raise RuntimeError(f"All LLM attempts failed for models: [{primary}, {primary}, {fallback}]")


async def get_ceo_llm(prompt: str):
    return await _invoke_with_fallback(prompt, CEO_MODEL, AGENT_MODEL)


async def get_agent_llm(prompt: str):
    return await _invoke_with_fallback(prompt, AGENT_MODEL, AGENT_MODEL)
