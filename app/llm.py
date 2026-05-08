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


async def _invoke_with_fallback(prompt: str, target_model: str):
    """Invoke the target model, falling back to itself as a retry mechanism."""
    errors = []
    # Try the same model twice in case of ephemeral network/rate-limit issues
    for model in [target_model, target_model]:
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
            errors.append({"model": model, "type": type(e).__name__, "error": str(e)})

    print(f"\n[LLM] ❌ ALL MODELS FAILED")
    for err in errors:
        print(f"[LLM]   • {err['model']} → {err['type']}: {err['error'][:200]}")

    raise RuntimeError(
        f"All models failed. Errors: {errors}"
    )


async def get_ceo_llm(prompt: str):
    return await _invoke_with_fallback(prompt, CEO_MODEL)


async def get_agent_llm(prompt: str):
    return await _invoke_with_fallback(prompt, AGENT_MODEL)
