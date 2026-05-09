import time
from app.llm import get_agent_llm


async def run_content_agent(task: str, context: str = ""):
    start_time = time.time()

    context_section = ""
    if context:
        context_section = f"""Prior insights from other departments:
{context}

Use the above insights to make your content more targeted and relevant.

"""

    prompt = f"""You are an elite viral content strategist.

Given the following task, provide highly engaging and social-media optimized content ideas:

Task: {task}

{context_section}Provide (use bullet points, keep each section short):
1. Viral hooks
2. Reel ideas
3. Captions
4. CTA (Call to Action) ideas
5. Carousel concepts

Keep responses concise, actionable, and under 300 words."""

    try:
        print(f"[Content] Invoking LLM for task: {task}")
        if context:
            print(f"[Content] With upstream context ({len(context)} chars)")
        response = await get_agent_llm(prompt)
        print(f"[Content] Completed in {time.time() - start_time:.2f}s")
        return {
            "agent": "content",
            "task": task,
            "output": response.content,
        }
    except Exception as e:
        print(f"[Content] Failed after {time.time() - start_time:.2f}s: {e}")
        return {
            "agent": "content",
            "task": task,
            "error": str(e),
        }
