from app.llm import get_agent_llm
from app.tools import web_search


async def run_research_agent(goal: str):
    # Fetch live web research
    search_result = await web_search(goal)
    print(f"[WEB SEARCH] {search_result}")
    web_data = search_result.get("result", "")

    if web_data and web_data != "No results found.":
        web_section = f"""Live Web Research (use this as the primary source of truth):
{web_data}"""
    else:
        web_section = "Note: No live web data was found. Use your existing knowledge."

    prompt = f"""You are a business research analyst.

Business Goal: {goal}

{web_section}

Based on the goal and research above, provide:
1. Key opportunities
2. Current market trends
3. Actionable recommendations
4. Potential risks

Be concise and specific."""

    try:
        print(f"[Research] Invoking LLM for goal: {goal}")
        response = await get_agent_llm(prompt)
        print("[Research] Response received.")
        return {
            "agent": "research",
            "goal": goal,
            "web_research": search_result,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Research] LLM call failed: {e}")
        return {
            "agent": "research",
            "goal": goal,
            "web_research": search_result,
            "error": str(e),
        }
