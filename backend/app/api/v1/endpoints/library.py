from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.content import Content
from app.schemas.library import LibraryStatusResponse, LibraryListResponse
from app.services.recommender import recommender
from app.schemas.content import ContentListItem

router = APIRouter()

@router.get("/status/{content_id}", response_model=LibraryStatusResponse)
async def get_library_status(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Check if a specific content item is bookmarked or watched by the logged-in user.
    """
    stmt = (
        select(User)
        .options(
            selectinload(User.bookmarked_contents),
            selectinload(User.watched_contents)
        )
        .where(User.id == current_user.id)
    )
    result = await db.execute(stmt)
    user = result.scalar_one()

    is_bookmarked = any(item.id == content_id for item in user.bookmarked_contents)
    is_watched = any(item.id == content_id for item in user.watched_contents)

    return LibraryStatusResponse(
        is_bookmarked=is_bookmarked,
        is_watched=is_watched
    )

@router.post("/bookmarks/{content_id}", response_model=LibraryStatusResponse)
async def toggle_bookmark(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle bookmark on a title. If already saved, remove it; if not, add it.
    """
    # 1. Fetch Content
    c_stmt = select(Content).where(Content.id == content_id)
    c_res = await db.execute(c_stmt)
    content = c_res.scalar_one_or_none()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # 2. Fetch User with relations
    u_stmt = (
        select(User)
        .options(
            selectinload(User.bookmarked_contents),
            selectinload(User.watched_contents)
        )
        .where(User.id == current_user.id)
    )
    u_res = await db.execute(u_stmt)
    user = u_res.scalar_one()

    # 3. Toggle Bookmark
    is_bookmarked = False
    if content in user.bookmarked_contents:
        user.bookmarked_contents.remove(content)
        is_bookmarked = False
    else:
        user.bookmarked_contents.append(content)
        is_bookmarked = True

    await db.commit()

    is_watched = any(item.id == content_id for item in user.watched_contents)
    return LibraryStatusResponse(
        is_bookmarked=is_bookmarked,
        is_watched=is_watched
    )

@router.post("/watched/{content_id}", response_model=LibraryStatusResponse)
async def toggle_watched(
    content_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle watched status on a title.
    """
    c_stmt = select(Content).where(Content.id == content_id)
    c_res = await db.execute(c_stmt)
    content = c_res.scalar_one_or_none()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    u_stmt = (
        select(User)
        .options(
            selectinload(User.bookmarked_contents),
            selectinload(User.watched_contents)
        )
        .where(User.id == current_user.id)
    )
    u_res = await db.execute(u_stmt)
    user = u_res.scalar_one()

    is_watched = False
    if content in user.watched_contents:
        user.watched_contents.remove(content)
        is_watched = False
    else:
        user.watched_contents.append(content)
        is_watched = True

    await db.commit()

    is_bookmarked = any(item.id == content_id for item in user.bookmarked_contents)
    return LibraryStatusResponse(
        is_bookmarked=is_bookmarked,
        is_watched=is_watched
    )

@router.get("/bookmarks", response_model=LibraryListResponse)
async def get_user_bookmarks(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all bookmarked items for the logged-in user.
    """
    stmt = (
        select(User)
        .options(
            selectinload(User.bookmarked_contents).selectinload(Content.genres)
        )
        .where(User.id == current_user.id)
    )
    result = await db.execute(stmt)
    user = result.scalar_one()

    return LibraryListResponse(
        items=user.bookmarked_contents,
        total_count=len(user.bookmarked_contents)
    )

@router.get("/watched", response_model=LibraryListResponse)
async def get_user_watched(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all watched items for the logged-in user.
    """
    stmt = (
        select(User)
        .options(
            selectinload(User.watched_contents).selectinload(Content.genres)
        )
        .where(User.id == current_user.id)
    )
    result = await db.execute(stmt)
    user = result.scalar_one()

    return LibraryListResponse(
        items=user.watched_contents,
        total_count=len(user.watched_contents)
    )


# Add this endpoint to the bottom of library.py:
@router.get("/recommendations", response_model=LibraryListResponse)
async def get_personalized_recommendations(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve personalized movie and series recommendations for the authenticated user 
    using rule-based genre/actor overlap and diversity filtering.
    """
    recommendations = await recommender.get_user_recommendations(
        user_id=current_user.id,
        db=db,
        limit=15
    )
    return LibraryListResponse(
        items=recommendations,
        total_count=len(recommendations)
    )