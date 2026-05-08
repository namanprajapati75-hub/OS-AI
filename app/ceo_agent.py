import json
import re

from app.llm import get_ceo_llm
from app.research_agent import run_research_agent
from app.marketing_agent import run_marketing_agent
from app.content_agent import run_content_agent
from app.sales_agent import run_sales_agent
from app.task_queue import add_task


def _extract_json(text: str) -> dict:
    """Extract JSON from plain text or markdown code blocks."""
    # Strip markdown code fences if present
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        text = match.group(1)
    # Fallback: find first {...} block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        text = match.group(0)
    return json.loads(text)


async def run_ceo_agent(goal: str, memory: list = []):
    # Build conversation history text
    memory_text = ""
    if memory:
        lines = []
        for msg in memory:
            role = msg.get("role", "").upper()
            content = msg.get("content", "")
            lines.append(f"{role}: {content}")
        memory_text = "\n".join(lines)
    print(f"[CEO MEMORY] {memory_text or '(empty)'}")

    prompt = f"""You are a CEO of a company.

Given the business goal below, respond with ONLY a JSON object — no markdown, no explanation.

You MUST always include a "Research" department with tasks for:
- Market research
- Trend analysis
- Competitor analysis

{"Previous conversation:" + chr(10) + memory_text + chr(10) if memory_text else ""}Current Goal: {goal}

JSON format:
{{
  "departments": ["Research", "Dept2"],
  "tasks": [
    {{"department": "Research", "task": "Research market trends and competitors", "priority": "high"}},
    {{"department": "Dept2", "task": "Task description", "priority": "medium"}}
  ]
}}"""

    try:
        print(f"[CEO] Sending goal to LLM: {goal}")
        response = await get_ceo_llm(prompt)
        raw = response.content
        print(f"[CEO] Raw LLM response:\n{raw}")
    except Exception as e:
        print(f"[CEO] LLM call failed: {e}")
        return {"status": "error", "message": f"LLM call failed: {str(e)}"}

    try:
        parsed = _extract_json(raw)
    except Exception as e:
        print(f"[CEO] JSON parse failed: {e}\nRaw content: {raw}")
        return {
            "status": "error",
            "message": "LLM returned non-JSON response",
            "raw": raw,
        }

    # Ensure research task exists
    agent_results = []
    tasks = parsed.get("tasks", [])
    has_research = any("research" in t.get("department", "").lower() for t in tasks)
    if not has_research:
        print("[CEO] No research task found — auto-appending one.")
        tasks.append({
            "department": "Research",
            "task": "Research latest market trends, competitors, and opportunities related to the business goal",
            "priority": "high",
        })

    departments = parsed.get("departments", [])
    if "Research" not in departments:
        departments.append("Research")

    queued_tasks = []
    for t in tasks:
        queued = await add_task(t)
        queued_tasks.append(queued)
        print(f"[QUEUE] Added task: {queued}")

        dept = t.get("department", "").lower()
        task_desc = t.get("task", "")
        print(f"[CEO] Routing: {dept} → {task_desc[:60]}")

        try:
            # Check for content keywords in both dept and task_desc
            content_keywords = ["content", "reels", "instagram", "social media", "youtube", "viral"]
            is_content_task = any(kw in dept for kw in content_keywords) or any(kw in task_desc.lower() for kw in content_keywords)

            # Check for sales keywords in both dept and task_desc
            sales_keywords = ["sales", "outreach", "leads", "monetization", "partnerships", "revenue", "clients", "affiliate"]
            is_sales_task = any(kw in dept for kw in sales_keywords) or any(kw in task_desc.lower() for kw in sales_keywords)

            if is_sales_task:
                result = await run_sales_agent(task_desc)
                agent_results.append(result)
            elif is_content_task:
                result = await run_content_agent(task_desc)
                agent_results.append(result)
            elif "marketing" in dept:
                result = await run_marketing_agent(task_desc)
                agent_results.append(result)
            elif "research" in dept:
                result = await run_research_agent(task_desc)
                agent_results.append(result)
        except Exception as e:
            print(f"[CEO] Agent failed for {dept}: {e}")
            agent_results.append({"agent": dept, "error": str(e)})

    return {
        "status": "success",
        "goal": goal,
        "departments": departments,
        "tasks": tasks,
        "queued_tasks": queued_tasks,
        "agent_results": agent_results,
    }
