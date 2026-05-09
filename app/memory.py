import uuid
from sqlalchemy import select, delete
from app.db import AsyncSessionLocal
from app.models import UserMemory, BusinessMemory


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


# ── Business Memory ──────────────────────────────────────────────

async def save_business_context(user_id: str, context: dict):
    """Upsert business context keys. context = {"niche": "...", "audience": "..."}"""
    async with AsyncSessionLocal() as session:
        for key, value in context.items():
            if not value:
                continue
            # Check if key already exists for this user
            stmt = select(BusinessMemory).where(
                BusinessMemory.user_id == user_id,
                BusinessMemory.key == key,
            )
            result = await session.execute(stmt)
            existing = result.scalars().first()

            if existing:
                existing.value = str(value)
            else:
                session.add(BusinessMemory(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    key=key,
                    value=str(value),
                ))
        await session.commit()
    print(f"[Memory] Saved business context for user {user_id}: {list(context.keys())}")


async def get_business_context(user_id: str) -> dict:
    """Returns {"niche": "...", "audience": "...", ...}"""
    async with AsyncSessionLocal() as session:
        stmt = select(BusinessMemory).where(BusinessMemory.user_id == user_id)
        result = await session.execute(stmt)
        rows = result.scalars().all()
        ctx = {r.key: r.value for r in rows}
        if ctx:
            print(f"[Memory] Loaded business context for user {user_id}: {list(ctx.keys())}")
        return ctx
