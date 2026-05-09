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
    execution_type = Column(String, default="immediate")  # immediate | scheduled | recurring
    scheduled_for = Column(DateTime, nullable=True)        # when to execute (for scheduled)
    recurring_interval = Column(String, nullable=True)     # daily | weekly | monthly
    created_at = Column(DateTime, default=datetime.utcnow)

class BusinessMemory(Base):
    __tablename__ = "business_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    key = Column(String, nullable=False)       # e.g. "niche", "audience", "platforms"
    value = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
