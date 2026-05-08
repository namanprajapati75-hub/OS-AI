from app.llm import get_agent_llm


async def run_marketing_agent(task: str):
    prompt = f"""You are a senior marketing strategist.

Given the following task, provide a highly actionable marketing strategy:

Task: {task}

Provide:
1. Target audience
2. Marketing channels
3. Content strategy
4. Estimated budget allocation
5. KPIs to track"""

    try:
        print(f"[Marketing] Invoking LLM for task: {task}")
        response = await get_agent_llm(prompt)
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
