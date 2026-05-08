from app.llm import get_agent_llm


async def run_content_agent(task: str):
    prompt = f"""You are an elite viral content strategist.

Given the following task, provide highly engaging and social-media optimized content ideas:

Task: {task}

Provide:
1. Viral hooks
2. Reel ideas
3. Captions
4. CTA (Call to Action) ideas
5. Carousel concepts

Be creative, actionable, and focus on maximizing engagement."""

    try:
        print(f"[Content] Invoking LLM for task: {task}")
        response = await get_agent_llm(prompt)
        print("[Content] Response received.")
        return {
            "agent": "content",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Content] LLM call failed: {e}")
        return {
            "agent": "content",
            "task": task,
            "error": str(e),
        }
