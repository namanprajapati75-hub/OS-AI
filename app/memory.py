import uuid
from sqlalchemy import select, delete
from app.db import AsyncSessionLocal
from app.models import UserMemory


async def save_message(user_id: str, role: str, content: str):
    async with AsyncSessionLocal() as session:
        new_msg = UserMemory(
            id=str(uuid.uuid4()),
            user_id=user_id,
            role=role,
            content=content,
        )
        session.add(new_msg)
        await session.commit()


async def get_memory(user_id: str) -> list:
    async with AsyncSessionLocal() as session:
        stmt = select(UserMemory).where(UserMemory.user_id == user_id).order_by(UserMemory.created_at.asc())
        result = await session.execute(stmt)
        memories = result.scalars().all()
        return [{"role": m.role, "content": m.content} for m in memories]


async def clear_memory(user_id: str):
    async with AsyncSessionLocal() as session:
        stmt = delete(UserMemory).where(UserMemory.user_id == user_id)
        await session.execute(stmt)
        await session.commit()
