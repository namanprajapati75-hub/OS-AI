import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# Make sure we use the asyncpg driver
raw_url = os.getenv("DATABASE_URL", "")
if raw_url.startswith("postgresql://"):
    raw_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    raw_url,
    echo=False,
    # Optional pool configurations for Neon
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    """Dependency to provide a database session."""
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """Create tables if they don't exist."""
    # We must import models here so SQLAlchemy knows about them before creating tables
    import app.models  # noqa: F401
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
