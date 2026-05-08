from app.llm import get_agent_llm


async def run_sales_agent(task: str):
    prompt = f"""You are an elite sales strategist and lead generation expert.

Given the following task, provide a highly actionable sales and lead generation strategy:

Task: {task}

Provide:
1. Lead generation ideas
2. Outreach strategy
3. Cold DM scripts
4. Cold email ideas
5. Partnership strategies
6. Monetization tactics

Be highly actionable and specific."""

    try:
        print(f"[Sales] Invoking LLM for task: {task}")
        response = await get_agent_llm(prompt)
        print("[Sales] Response received.")
        return {
            "agent": "sales",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Sales] LLM call failed: {e}")
        return {
            "agent": "sales",
            "task": task,
            "error": str(e),
        }
