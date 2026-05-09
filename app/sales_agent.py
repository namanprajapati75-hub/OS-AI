import time
from app.llm import get_agent_llm


async def run_sales_agent(task: str, context: str = ""):
    start_time = time.time()

    context_section = ""
    if context:
        context_section = f"""Prior insights from other departments:
{context}

Use the above insights to make your sales strategy more targeted and effective.

"""

    prompt = f"""You are an elite sales strategist and lead generation expert.

Given the following task, provide a highly actionable sales and lead generation strategy:

Task: {task}

{context_section}Provide (use bullet points, keep each section short):
1. Lead generation ideas
2. Outreach strategy
3. Cold DM scripts
4. Cold email ideas
5. Partnership strategies
6. Monetization tactics

Keep responses concise, actionable, and under 300 words."""

    try:
        print(f"[Sales] Invoking LLM for task: {task}")
        if context:
            print(f"[Sales] With upstream context ({len(context)} chars)")
        response = await get_agent_llm(prompt)
        print(f"[Sales] Completed in {time.time() - start_time:.2f}s")
        return {
            "agent": "sales",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Sales] Failed after {time.time() - start_time:.2f}s: {e}")
        return {
            "agent": "sales",
            "task": task,
            "error": str(e),
        }
