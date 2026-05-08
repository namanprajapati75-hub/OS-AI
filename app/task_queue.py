import uuid
from sqlalchemy import select, delete
from app.db import AsyncSessionLocal
from app.models import TaskQueue


async def add_task(task_data: dict) -> dict:
    """Add a new task to the database queue."""
    async with AsyncSessionLocal() as session:
        task_id = str(uuid.uuid4())
        new_task = TaskQueue(
            id=task_id,
            department=task_data.get("department", "general"),
            task=task_data.get("task", ""),
            priority=task_data.get("priority", "medium"),
            status="pending"
        )
        session.add(new_task)
        await session.commit()
        
        return {
            "id": new_task.id,
            "department": new_task.department,
            "task": new_task.task,
            "priority": new_task.priority,
            "status": new_task.status,
        }


async def get_tasks() -> list:
    """Get all tasks in the queue, ordered by creation time."""
    async with AsyncSessionLocal() as session:
        stmt = select(TaskQueue).order_by(TaskQueue.created_at.asc())
        result = await session.execute(stmt)
        tasks = result.scalars().all()
        return [
            {
                "id": t.id,
                "department": t.department,
                "task": t.task,
                "priority": t.priority,
                "status": t.status,
            }
            for t in tasks
        ]


async def clear_tasks():
    """Clear all tasks from the database."""
    async with AsyncSessionLocal() as session:
        stmt = delete(TaskQueue)
        await session.execute(stmt)
        await session.commit()


async def pop_task() -> dict | None:
    """Return the oldest pending task from the queue and mark it as processing."""
    async with AsyncSessionLocal() as session:
        stmt = select(TaskQueue).where(TaskQueue.status == "pending").order_by(TaskQueue.created_at.asc()).limit(1)
        result = await session.execute(stmt)
        task = result.scalars().first()
        
        if not task:
            return None
            
        task.status = "processing"
        await session.commit()
        
        return {
            "id": task.id,
            "department": task.department,
            "task": task.task,
            "priority": task.priority,
            "status": task.status,
        }
