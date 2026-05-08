from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pathlib import Path
import os

# Explicitly load .env from the project root (ai-os/.env)
load_dotenv(Path(__file__).parent.parent / ".env")

api_key = os.getenv("GROQ_API_KEY")

PRIMARY_MODEL = "llama-3.3-70b-versatile"
BACKUP_MODEL = "llama3-8b-8192"

print("GROQ KEY FOUND:", bool(api_key))
print(f"PRIMARY MODEL: {PRIMARY_MODEL}")
print(f"BACKUP MODEL:  {BACKUP_MODEL}")


def get_llm(model: str = PRIMARY_MODEL):
    return ChatGroq(
        model=model,
        api_key=api_key,
    )


async def get_llm_with_fallback(prompt: str):
    """Try primary model, fall back to backup if it fails."""
    errors = []
    for model in [PRIMARY_MODEL, BACKUP_MODEL]:
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
