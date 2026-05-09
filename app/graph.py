import operator
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END

from app.ceo_agent import run_ceo_agent
from app.marketing_agent import run_marketing_agent
from app.research_agent import run_research_agent
from app.content_agent import run_content_agent
from app.sales_agent import run_sales_agent


class AgentState(TypedDict):
    goal: str
    memory: list
    business_context: dict
    tasks: list
    departments: list
    stages: list
    # Annotated with operator.add tells LangGraph to append to this list instead of overwriting it
    agent_results: Annotated[list, operator.add]
    stage_results: dict  # {stage_number: [results]} — accumulated context for downstream agents
    business_updates: dict


def _build_context_from_stages(stage_results: dict, current_stage: int) -> str:
    """Build a compact context string from all completed stages for downstream agents."""
    lines = []
    for stage_num in sorted(stage_results.keys()):
        if stage_num >= current_stage:
            continue
        for result in stage_results[stage_num]:
            agent = result.get("agent", "unknown").upper()
            output = result.get("output", result.get("error", ""))
            # Truncate each result to avoid prompt blowup
            if len(output) > 200:
                output = output[:200] + "..."
            lines.append(f"[{agent}] {output}")
    return "\n".join(lines)


async def ceo_node(state: AgentState):
    """CEO analyzes the goal and generates staged execution plan."""
    print("[Graph] CEO Node executing...")
    response = await run_ceo_agent(
        state["goal"],
        state.get("memory", []),
        state.get("business_context", {}),
    )

    if response.get("status") == "error":
        print(f"[Graph] CEO returned error: {response.get('message')}")
        return {
            "tasks": [],
            "departments": [],
            "stages": [],
            "agent_results": [{"agent": "ceo", "error": response.get("message")}],
            "business_updates": {},
        }

    return {
        "tasks": response.get("tasks", []),
        "departments": response.get("departments", []),
        "stages": response.get("stages", []),
        "business_updates": response.get("business_updates", {}),
    }


async def execute_stages_node(state: AgentState):
    """Execute all stages in order, passing context from completed stages to downstream agents."""
    stages = state.get("stages", [])
    if not stages:
        print("[Graph] No stages to execute")
        return {"agent_results": [], "stage_results": {}}

    # Sort stages by stage number
    stages_sorted = sorted(stages, key=lambda s: s.get("stage", 0))
    stage_results = {}
    all_results = []

    for stage in stages_sorted:
        stage_num = stage.get("stage", 0)
        tasks = stage.get("tasks", [])
        print(f"\n[Graph] ═══ STAGE {stage_num} ═══ ({len(tasks)} tasks)")

        # Build context from all prior stages
        context = _build_context_from_stages(stage_results, stage_num)
        if context:
            print(f"[Graph] Injecting context from prior stages ({len(context)} chars)")

        stage_results[stage_num] = []

        for t in tasks:
            dept = t.get("department", "").lower()
            task_desc = t.get("task", "")
            print(f"[Graph] Running: {dept} → {task_desc[:60]}...")

            try:
                result = await _run_agent_for_dept(dept, task_desc, context)
                stage_results[stage_num].append(result)
                all_results.append(result)
            except Exception as e:
                print(f"[Graph] Agent failed for {dept}: {e}")
                error_result = {"agent": dept, "task": task_desc, "error": str(e)}
                stage_results[stage_num].append(error_result)
                all_results.append(error_result)

        print(f"[Graph] Stage {stage_num} complete — {len(stage_results[stage_num])} results")

    return {"agent_results": all_results, "stage_results": stage_results}


async def _run_agent_for_dept(dept: str, task_desc: str, context: str = ""):
    """Route a task to the right agent based on department keywords."""
    content_keywords = ["content", "reels", "instagram", "social media", "youtube", "viral"]
    sales_keywords = ["sales", "outreach", "leads", "monetization", "partnerships", "revenue", "affiliate"]

    is_content = any(kw in dept for kw in content_keywords) or any(kw in task_desc.lower() for kw in content_keywords)
    is_sales = any(kw in dept for kw in sales_keywords) or any(kw in task_desc.lower() for kw in sales_keywords)

    if is_sales:
        return await run_sales_agent(task_desc, context)
    elif is_content:
        return await run_content_agent(task_desc, context)
    elif "marketing" in dept:
        return await run_marketing_agent(task_desc, context)
    elif "research" in dept:
        return await run_research_agent(task_desc)
    else:
        # Default to research for unknown departments
        print(f"[Graph] Unknown dept '{dept}' — defaulting to research agent")
        return await run_research_agent(task_desc)


# ── Build the graph ──────────────────────────────────────────────

workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("ceo", ceo_node)
workflow.add_node("execute_stages", execute_stages_node)

# Flow: START → CEO → Execute Stages → END
workflow.add_edge(START, "ceo")
workflow.add_edge("ceo", "execute_stages")
workflow.add_edge("execute_stages", END)

# Compile
graph = workflow.compile()
