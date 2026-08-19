import math
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.content import Content
from app.models.genre import Genre
from app.models.cast_credit import CastCredit
from app.schemas.content import ContentListItem, ContentDetailResponse
from app.schemas.common import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[ContentListItem])
async def list_contents(
    content_type: Optional[str] = Query(None, description="Filter by type: 'movie' or 'series'"),
    genre_id: Optional[int] = Query(None, description="Filter by Genre ID"),
    upcoming_only: bool = Query(False, description="Filter only upcoming releases from today onwards"),
    sort_by: str = Query("rating", description="Sort order: 'rating', 'date_asc', or 'date_desc'"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    """
    List contents with optional filtering by type, genre, upcoming release date, and IMDb sorting.
    """
    # 1. Base query with eager loading to prevent N+1 query bottlenecks
    query = select(Content).options(selectinload(Content.genres))
    count_query = select(func.count(func.distinct(Content.id)))

    # 2. Filter: Content Type (movie / series)
    if content_type:
        query = query.where(Content.content_type == content_type.lower())
        count_query = count_query.where(Content.content_type == content_type.lower())

    # 3. Filter: Genre
    if genre_id:
        query = query.join(Content.genres).where(Genre.id == genre_id)
        count_query = count_query.join(Content.genres).where(Genre.id == genre_id)

    # 4. Filter: Upcoming Releases (Release date greater than or equal to today)
    if upcoming_only:
        today = date.today()
        query = query.where(Content.release_date >= today)
        count_query = count_query.where(Content.release_date >= today)

    # 5. Sorting Rules
    if sort_by == "rating":
        # Descending IMDb score, placing null ratings at the bottom
        query = query.order_by(Content.imdb_rating.desc().nullslast(), Content.id.asc())
    elif sort_by == "date_asc":
        query = query.order_by(Content.release_date.asc().nullslast(), Content.id.asc())
    elif sort_by == "date_desc":
        query = query.order_by(Content.release_date.desc().nullslast(), Content.id.asc())

    # 6. Pagination Math
    total_count = await db.scalar(count_query) or 0
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    offset = (page - 1) * page_size

    # 7. Execute paginated query
    paginated_query = query.offset(offset).limit(page_size)
    result = await db.execute(paginated_query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=items,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/search", response_model=PaginatedResponse[ContentListItem])
async def search_contents(
    q: str = Query(..., min_length=1, description="Search query string"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Search movies, series, and sitcoms by title (case-insensitive)."""
    search_pattern = f"%{q.strip()}%"
    
    query = (
        select(Content)
        .options(selectinload(Content.genres))
        .where(Content.title.ilike(search_pattern))
        .order_by(Content.imdb_rating.desc().nullslast(), Content.id.asc())
    )
    count_query = select(func.count(Content.id)).where(Content.title.ilike(search_pattern))

    total_count = await db.scalar(count_query) or 0
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    offset = (page - 1) * page_size

    result = await db.execute(query.offset(offset).limit(page_size))
    items = result.scalars().all()

    return PaginatedResponse(
        items=items,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{content_id}", response_model=ContentDetailResponse)
async def get_content_detail(content_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch complete metadata for a single title, including cast members and watch providers."""
    stmt = (
        select(Content)
        .options(
            selectinload(Content.genres),
            selectinload(Content.cast_credits).selectinload(CastCredit.person)
        )
        .where(Content.id == content_id)
    )
    result = await db.execute(stmt)
    content = result.scalar_one_or_none()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return content