import time
from app.llm import get_agent_llm


async def run_marketing_agent(task: str, context: str = ""):
    start_time = time.time()

    context_section = ""
    if context:
        context_section = f"""Prior insights from other departments:
{context}

Use the above insights to make your strategy more targeted and specific.

"""

    prompt = f"""You are a senior marketing strategist.

Given the following task, provide a highly actionable marketing strategy:

Task: {task}

{context_section}Provide (use bullet points, keep each section short):
1. Target audience
2. Marketing channels
3. Content strategy
4. Estimated budget allocation
5. KPIs to track

Keep responses concise, actionable, and under 300 words."""

    try:
        print(f"[Marketing] Invoking LLM for task: {task}")
        if context:
            print(f"[Marketing] With upstream context ({len(context)} chars)")
        response = await get_agent_llm(prompt)
        print(f"[Marketing] Completed in {time.time() - start_time:.2f}s")
        return {
            "agent": "marketing",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Marketing] Failed after {time.time() - start_time:.2f}s: {e}")
        return {
            "agent": "marketing",
            "task": task,
            "error": str(e),
        }
