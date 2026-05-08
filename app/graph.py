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
    tasks: list
    departments: list
    # Annotated with operator.add tells LangGraph to append to this list instead of overwriting it
    agent_results: Annotated[list, operator.add]


async def ceo_node(state: AgentState):
    """CEO analyzes the goal and generates tasks."""
    print("[Graph] CEO Node executing...")
    response = await run_ceo_agent(state["goal"], state.get("memory", []))
    return {
        "tasks": response.get("tasks", []),
        "departments": response.get("departments", []),
    }


async def marketing_node(state: AgentState):
    """Execute all marketing tasks."""
    print("[Graph] Marketing Node executing...")
    results = []
    for t in state.get("tasks", []):
        dept = t.get("department", "").lower()
        if "marketing" in dept:
            task_desc = t.get("task", "")
            res = await run_marketing_agent(task_desc)
            results.append(res)
    return {"agent_results": results}


async def research_node(state: AgentState):
    """Execute all research tasks."""
    print("[Graph] Research Node executing...")
    results = []
    for t in state.get("tasks", []):
        dept = t.get("department", "").lower()
        if "research" in dept:
            task_desc = t.get("task", "")
            res = await run_research_agent(task_desc)
            results.append(res)
    return {"agent_results": results}


async def content_node(state: AgentState):
    """Execute all content-related tasks."""
    print("[Graph] Content Node executing...")
    results = []
    content_keywords = ["content", "reels", "instagram", "social media", "youtube", "viral"]
    for t in state.get("tasks", []):
        dept = t.get("department", "").lower()
        task_desc = t.get("task", "")
        
        is_content_task = any(kw in dept for kw in content_keywords) or any(kw in task_desc.lower() for kw in content_keywords)
        if is_content_task:
            res = await run_content_agent(task_desc)
            results.append(res)
    return {"agent_results": results}


async def sales_node(state: AgentState):
    """Execute all sales-related tasks."""
    print("[Graph] Sales Node executing...")
    results = []
    sales_keywords = ["sales", "outreach", "leads", "monetization", "partnerships", "revenue", "affiliate"]
    for t in state.get("tasks", []):
        dept = t.get("department", "").lower()
        task_desc = t.get("task", "")
        
        is_sales_task = any(kw in dept for kw in sales_keywords) or any(kw in task_desc.lower() for kw in sales_keywords)
        if is_sales_task:
            res = await run_sales_agent(task_desc)
            results.append(res)
    return {"agent_results": results}


# Define the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("ceo", ceo_node)
workflow.add_node("marketing", marketing_node)
workflow.add_node("research", research_node)
workflow.add_node("content", content_node)
workflow.add_node("sales", sales_node)

# Add edges (Linear flow: START -> CEO -> Marketing -> Research -> Content -> Sales -> END)
workflow.add_edge(START, "ceo")
workflow.add_edge("ceo", "marketing")
workflow.add_edge("marketing", "research")
workflow.add_edge("research", "content")
workflow.add_edge("content", "sales")
workflow.add_edge("sales", END)

# Compile
graph = workflow.compile()
