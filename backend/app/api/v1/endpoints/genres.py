from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.genre import Genre
from app.schemas.genre import GenreResponse

router = APIRouter()

@router.get("/", response_model=List[GenreResponse])
async def get_all_genres(db: AsyncSession = Depends(get_db)):
    """Retrieve all available genres sorted alphabetically."""
    stmt = select(Genre).order_by(Genre.name.asc())
    result = await db.execute(stmt)
    return result.scalars().all()