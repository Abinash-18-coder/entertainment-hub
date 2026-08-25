from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.genre import Genre
from app.schemas.genre import GenreResponse
from app.core.cache import memory_cache

router = APIRouter()

@router.get("/", response_model=List[GenreResponse])
async def get_all_genres(db: AsyncSession = Depends(get_db)):
    """Retrieve all available genres sorted alphabetically with in-memory caching."""
    cache_key = "all_genres_list"
    cached = memory_cache.get(cache_key)
    if cached is not None:
        return cached

    stmt = select(Genre).order_by(Genre.name.asc())
    result = await db.execute(stmt)
    genres = result.scalars().all()

    # Convert to Pydantic models for safe serialization before caching
    pydantic_genres = [GenreResponse.model_validate(g) for g in genres]
    memory_cache.set(cache_key, pydantic_genres, ttl_seconds=600)  # Cache for 10 minutes

    return pydantic_genres