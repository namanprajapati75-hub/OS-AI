import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.graph import graph
from app.schemas import AgentRequest
from app.worker import run_worker
from app.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables (non-fatal if DB is temporarily unreachable)
    try:
        await init_db()
        print("[SYSTEM] Database tables initialized")
    except Exception as e:
        print(f"[SYSTEM] WARNING: DB init failed (will retry on next request): {e}")

    # Startup: launch background worker
    # asyncio.create_task(run_worker())
    print("[SYSTEM] Worker temporarily disabled")
    yield
    # Shutdown (no special cleanup needed)


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"status": "running"}


@app.post("/run")
async def run(request: AgentRequest):
    try:
        result = await graph.ainvoke({
            "goal": request.goal,
            "memory": request.memory or [],
            "business_context": request.business_context or {},
            "tasks": [],
            "departments": [],
            "stages": [],
            "agent_results": [],
            "stage_results": {},
            "business_updates": {},
        })
        
        # graph.ainvoke returns the final state dict.
        # We also manually add "status": "success" to keep frontend compatibility.
        result["status"] = "success"
        return result
    except Exception as e:
        print(f"[API] Unhandled error in /run: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)},
        )
