import uuid
from datetime import datetime
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
            status="pending",
            execution_type=task_data.get("execution_type", "immediate"),
            scheduled_for=_parse_datetime(task_data.get("scheduled_for")),
            recurring_interval=task_data.get("recurring_interval"),
        )
        session.add(new_task)
        await session.commit()
        
        return {
            "id": new_task.id,
            "department": new_task.department,
            "task": new_task.task,
            "priority": new_task.priority,
            "status": new_task.status,
            "execution_type": new_task.execution_type,
            "scheduled_for": str(new_task.scheduled_for) if new_task.scheduled_for else None,
            "recurring_interval": new_task.recurring_interval,
        }


def _parse_datetime(value) -> datetime | None:
    """Parse a datetime string safely. Returns None if invalid."""
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(str(value))
    except (ValueError, TypeError):
        try:
            return datetime.strptime(str(value), "%Y-%m-%d")
        except (ValueError, TypeError):
            print(f"[Queue] Could not parse datetime: {value}")
            return None


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
                "execution_type": t.execution_type,
                "scheduled_for": str(t.scheduled_for) if t.scheduled_for else None,
                "recurring_interval": t.recurring_interval,
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
    """Return the oldest pending task that is ready to execute."""
    now = datetime.utcnow()
    async with AsyncSessionLocal() as session:
        stmt = (
            select(TaskQueue)
            .where(TaskQueue.status == "pending")
            .order_by(TaskQueue.created_at.asc())
        )
        result = await session.execute(stmt)
        tasks = result.scalars().all()
        
        for task in tasks:
            # Skip future-scheduled tasks
            if task.scheduled_for and task.scheduled_for > now:
                continue

            task.status = "processing"
            await session.commit()
            
            return {
                "id": task.id,
                "department": task.department,
                "task": task.task,
                "priority": task.priority,
                "status": task.status,
                "execution_type": task.execution_type,
                "scheduled_for": str(task.scheduled_for) if task.scheduled_for else None,
                "recurring_interval": task.recurring_interval,
            }
        
        return None


async def reschedule_recurring(task_data: dict):
    """Clone a recurring task with a new scheduled_for based on its interval."""
    from datetime import timedelta

    interval = task_data.get("recurring_interval", "daily")
    delta_map = {
        "daily": timedelta(days=1),
        "weekly": timedelta(weeks=1),
        "monthly": timedelta(days=30),
    }
    delta = delta_map.get(interval, timedelta(days=1))

    # Schedule from now + interval
    next_run = datetime.utcnow() + delta

    new_task = {
        "department": task_data["department"],
        "task": task_data["task"],
        "priority": task_data.get("priority", "medium"),
        "execution_type": "recurring",
        "scheduled_for": next_run.isoformat(),
        "recurring_interval": interval,
    }

    queued = await add_task(new_task)
    print(f"[Queue] Rescheduled recurring task → next run: {next_run.isoformat()}")
    return queued
