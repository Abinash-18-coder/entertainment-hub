from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.scheduler.setup import start_scheduler, shutdown_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # App Startup
    start_scheduler()
    yield
    # App Shutdown
    shutdown_scheduler()

app = FastAPI(
    title="Entertainment Hub API",
    description="Production API for movies, series, sitcoms, ratings, and streaming redirects.",
    version="1.0.0",
    lifespan=lifespan
)

# Bind dynamic production and local CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Entertainment Hub API is running in production"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "success", "data": "Backend-Frontend communication active"}