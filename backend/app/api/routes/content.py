from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.content import Content
from app.models.cast_credit import CastCredit


router = APIRouter(
    prefix="/api/v1",
    tags=["Entertainment"]
)


@router.get("/movies")
async def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Return a paginated list of movies."""

    offset = (page - 1) * limit

    stmt = (
        select(Content)
        .options(
            selectinload(Content.genres),
            selectinload(Content.cast_credits)
            .selectinload(CastCredit.person)
        )
        .where(Content.content_type == "movie")
        .order_by(Content.release_date.desc().nullslast())
        .offset(offset)
        .limit(limit)
    )

    result = await db.execute(stmt)
    movies = result.scalars().unique().all()

    return {
        "status": "success",
        "page": page,
        "limit": limit,
        "count": len(movies),
        "data": movies
    }


@router.get("/series")
async def get_series(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Return a paginated list of TV series."""

    offset = (page - 1) * limit

    stmt = (
        select(Content)
        .options(
            selectinload(Content.genres),
            selectinload(Content.cast_credits)
            .selectinload(CastCredit.person)
        )
        .where(Content.content_type == "series")
        .order_by(Content.release_date.desc().nullslast())
        .offset(offset)
        .limit(limit)
    )

    result = await db.execute(stmt)
    series = result.scalars().unique().all()

    return {
        "status": "success",
        "page": page,
        "limit": limit,
        "count": len(series),
        "data": series
    }


@router.get("/movies/{tmdb_id}")
async def get_movie(
    tmdb_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Return detailed information about one movie."""

    stmt = (
        select(Content)
        .options(
            selectinload(Content.genres),
            selectinload(Content.cast_credits)
            .selectinload(CastCredit.person)
        )
        .where(
            Content.tmdb_id == tmdb_id,
            Content.content_type == "movie"
        )
    )

    result = await db.execute(stmt)
    movie = result.scalar_one_or_none()

    if movie is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {
        "status": "success",
        "data": movie
    }


@router.get("/series/{tmdb_id}")
async def get_series_details(
    tmdb_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Return detailed information about one TV series."""

    stmt = (
        select(Content)
        .options(
            selectinload(Content.genres),
            selectinload(Content.cast_credits)
            .selectinload(CastCredit.person)
        )
        .where(
            Content.tmdb_id == tmdb_id,
            Content.content_type == "series"
        )
    )

    result = await db.execute(stmt)
    series = result.scalar_one_or_none()

    if series is None:
        raise HTTPException(
            status_code=404,
            detail="TV series not found"
        )

    return {
        "status": "success",
        "data": series
    }