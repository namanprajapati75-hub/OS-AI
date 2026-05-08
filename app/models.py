from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.db import Base

class UserMemory(Base):
    __tablename__ = "user_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskQueue(Base):
    __tablename__ = "task_queue"

    id = Column(String, primary_key=True, index=True)
    department = Column(String, nullable=False)
    task = Column(Text, nullable=False)
    priority = Column(String, default="medium")
    status = Column(String, default="pending", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
