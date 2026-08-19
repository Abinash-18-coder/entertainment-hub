from fastapi import APIRouter
from app.api.v1.endpoints import contents, genres

api_router = APIRouter()
api_router.include_router(contents.router, prefix="/contents", tags=["Contents"])
api_router.include_router(genres.router, prefix="/genres", tags=["Genres"])