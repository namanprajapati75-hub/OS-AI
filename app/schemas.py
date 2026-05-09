from pydantic import BaseModel


class AgentRequest(BaseModel):
    goal: str
    memory: list = []
    business_context: dict = {}


class TaskItem(BaseModel):
    department: str
    task: str
    priority: str


class AgentResponse(BaseModel):
    status: str
    goal: str
    departments: list[str]
    tasks: list[TaskItem]
