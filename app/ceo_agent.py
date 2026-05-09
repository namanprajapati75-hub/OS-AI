import json
import re
import time

from app.llm import get_ceo_llm
from app.task_queue import add_task


# Keywords for detecting business context in user messages
BUSINESS_KEYWORDS = {
    "niche": ["niche", "industry", "sector", "space", "field"],
    "audience": ["audience", "target market", "demographic", "customers", "age group"],
    "platforms": ["instagram", "youtube", "tiktok", "twitter", "linkedin", "facebook", "platform"],
    "monetization": ["monetize", "monetization", "revenue model", "income", "affiliate", "sponsorship", "ads"],
    "goals": ["goal", "objective", "vision", "mission", "aim", "target revenue"],
}


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


def _detect_business_updates(user_message: str) -> dict:
    """Detect strategic business info from user message using keyword matching."""
    updates = {}
    msg_lower = user_message.lower()

    for key, keywords in BUSINESS_KEYWORDS.items():
        for kw in keywords:
            if kw in msg_lower:
                # Extract a relevant snippet around the keyword (the full message for now, truncated)
                updates[key] = user_message[:500]
                break

    if updates:
        print(f"[CEO] Detected business context updates: {list(updates.keys())}")
    return updates


async def run_ceo_agent(goal: str, memory: list | None = None, business_context: dict | None = None):
    start_time = time.time()
    if memory is None:
        memory = []
    if business_context is None:
        business_context = {}

    # Build conversation history text
    memory_text = ""
    if memory:
        lines = []
        for msg in memory:
            role = msg.get("role", "").upper()
            content = msg.get("content", "")
            lines.append(f"{role}: {content}")
        memory_text = "\n".join(lines)
    print(f"[CEO MEMORY] {memory_text[:200] or '(empty)'}")

    # Build business profile section
    biz_section = ""
    if business_context:
        biz_lines = [f"  {k}: {v}" for k, v in business_context.items()]
        biz_section = "Business Profile:\n" + "\n".join(biz_lines) + "\n\n"
        print(f"[CEO] Injecting business context: {list(business_context.keys())}")

    prompt = f"""You are a CEO of a company.

Given the business goal below, respond with ONLY a JSON object — no markdown, no explanation.

Create an execution plan with STAGES. Each stage runs in order. Later stages can use results from earlier stages.

Stage 1 should always be Research. Then Marketing, Content, Sales in later stages.

{biz_section}{("Previous conversation:" + chr(10) + memory_text + chr(10) + chr(10)) if memory_text else ""}Current Goal: {goal}

JSON format:
{{
  "departments": ["Research", "Marketing", "Content", "Sales"],
  "stages": [
    {{
      "stage": 1,
      "tasks": [
        {{"department": "Research", "task": "task description", "priority": "high"}}
      ]
    }},
    {{
      "stage": 2,
      "depends_on": [1],
      "tasks": [
        {{"department": "Marketing", "task": "task description", "priority": "high"}}
      ]
    }},
    {{
      "stage": 3,
      "depends_on": [1, 2],
      "tasks": [
        {{"department": "Content", "task": "task description", "priority": "medium"}}
      ]
    }},
    {{
      "stage": 4,
      "depends_on": [2, 3],
      "tasks": [
        {{"department": "Sales", "task": "task description", "priority": "medium"}}
      ]
    }}
  ]
}}

Tasks can optionally include scheduling:
  "execution_type": "immediate" or "scheduled" or "recurring"
  "scheduled_for": "YYYY-MM-DD" (only for scheduled)
  "recurring_interval": "daily" or "weekly" or "monthly" (only for recurring)

Default execution_type is "immediate" if not specified."""

    try:
        print(f"[CEO] Sending goal to LLM: {goal}")
        response = await get_ceo_llm(prompt)
        raw = response.content
        print(f"[CEO] Raw LLM response:\n{raw}")
    except Exception as e:
        print(f"[CEO] Failed after {time.time() - start_time:.2f}s: {e}")
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

    # Normalize stages
    stages = parsed.get("stages", [])

    # If CEO returned flat tasks instead of stages, wrap them
    if not stages and parsed.get("tasks"):
        print("[CEO] No stages found — wrapping flat tasks into single stage")
        stages = [{"stage": 1, "tasks": parsed["tasks"]}]

    # Ensure research exists in stage 1
    if stages:
        stage1_tasks = stages[0].get("tasks", [])
        has_research = any("research" in t.get("department", "").lower() for t in stage1_tasks)
        if not has_research:
            print("[CEO] No research task in stage 1 — auto-appending one.")
            stage1_tasks.append({
                "department": "Research",
                "task": "Research latest market trends, competitors, and opportunities related to the business goal",
                "priority": "high",
            })
            stages[0]["tasks"] = stage1_tasks

    departments = parsed.get("departments", [])
    if "Research" not in departments:
        departments.append("Research")

    # Flatten all tasks for queue persistence
    all_tasks = []
    for stage in stages:
        for t in stage.get("tasks", []):
            queued = await add_task(t)
            all_tasks.append(t)
            print(f"[QUEUE] Added task (stage {stage.get('stage', '?')}): {queued}")

    # Detect business updates from the user goal
    business_updates = _detect_business_updates(goal)

    print(f"[CEO] Completed in {time.time() - start_time:.2f}s — {len(stages)} stages, {len(all_tasks)} tasks")
    return {
        "status": "success",
        "goal": goal,
        "departments": departments,
        "stages": stages,
        "tasks": all_tasks,
        "business_updates": business_updates,
    }
