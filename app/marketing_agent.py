from app.llm import get_llm_with_fallback


async def run_marketing_agent(task: str):
    prompt = f"""You are an elite marketing strategist.

Given the following task, provide a comprehensive but concise marketing plan:

Task: {task}

Provide:
1. Target audience
2. Growth strategy
3. Content ideas
4. Monetization ideas

Be specific and actionable."""

    try:
        print(f"[Marketing] Invoking LLM for task: {task}")
        response = await get_llm_with_fallback(prompt)
        print("[Marketing] Response received.")
        return {
            "agent": "marketing",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Marketing] LLM call failed: {e}")
        return {
            "agent": "marketing",
            "task": task,
            "error": str(e),
        }
