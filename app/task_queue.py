import uuid

tasks_store = []


def add_task(task_data: dict) -> dict:
    """Add a new task to the queue."""
    task = {
        "id": str(uuid.uuid4()),
        "department": task_data.get("department", "general"),
        "task": task_data.get("task", ""),
        "priority": task_data.get("priority", "medium"),
        "status": "pending",
    }
    tasks_store.append(task)
    return task


def get_tasks() -> list:
    """Get all tasks in the queue."""
    return tasks_store


def clear_tasks():
    """Clear all tasks from the queue."""
    tasks_store.clear()


def pop_task() -> dict | None:
    """Return and remove the first pending task from the queue."""
    for i, t in enumerate(tasks_store):
        if t["status"] == "pending":
            return tasks_store.pop(i)
    return None
