import asyncio
from app.task_queue import pop_task
from app.marketing_agent import run_marketing_agent
from app.research_agent import run_research_agent
from app.content_agent import run_content_agent
from app.sales_agent import run_sales_agent


async def run_worker():
    """Continuously poll the queue and execute tasks."""
    print("[WORKER] Started background worker.")
    
    while True:
        task = pop_task()
        
        if not task:
            # print("[WORKER] Waiting for tasks...") # Optional: commented out to prevent log spam
            await asyncio.sleep(5)
            continue
            
        task_id = task.get("id")
        dept = task.get("department", "").lower()
        desc = task.get("task", "")
        
        print(f"\n[WORKER] Executing task {task_id[:8]} ({dept}): {desc[:60]}...")
        
        try:
            content_keywords = ["content", "reels", "instagram", "social media", "youtube", "viral"]
            is_content_task = any(kw in dept for kw in content_keywords) or any(kw in desc.lower() for kw in content_keywords)

            sales_keywords = ["sales", "outreach", "leads", "monetization", "partnerships", "revenue", "affiliate"]
            is_sales_task = any(kw in dept for kw in sales_keywords) or any(kw in desc.lower() for kw in sales_keywords)

            if is_sales_task:
                print(f"[WORKER] Sales task detected")
                result = await run_sales_agent(desc)
                print(f"[WORKER] Completed {task_id[:8]}: {result.get('output', '')[:100]}...")
            elif is_content_task:
                print(f"[WORKER] Content task detected")
                result = await run_content_agent(desc)
                print(f"[WORKER] Completed {task_id[:8]}: {result.get('output', '')[:100]}...")
            elif "marketing" in dept:
                result = await run_marketing_agent(desc)
                print(f"[WORKER] Completed {task_id[:8]}: {result.get('output', '')[:100]}...")
            elif "research" in dept:
                result = await run_research_agent(desc)
                print(f"[WORKER] Completed {task_id[:8]}: {result.get('output', '')[:100]}...")
            else:
                print(f"[WORKER] Completed {task_id[:8]}: No agent configured for '{dept}' department.")
        except Exception as e:
            print(f"[WORKER] Error executing {task_id[:8]}: {e}")
            
