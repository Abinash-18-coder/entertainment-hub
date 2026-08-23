from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.scheduler.setup import start_scheduler, shutdown_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # App Startup: Start background jobs
    start_scheduler()
    yield
    # App Shutdown: Gracefully stop scheduler
    shutdown_scheduler()

app = FastAPI(
    title="Entertainment Hub API",
    description="Backend API for movies, series, sitcoms, ratings, recommendations and background sync jobs.",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Entertainment Hub API is running"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "success", "data": "Backend-Frontend communication active"}