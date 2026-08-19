from datetime import date
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.genre import GenreResponse
from app.schemas.person import CastCreditResponse

class ContentListItem(BaseModel):
    """Lightweight summary schema optimized for fast catalog lists and grids."""
    id: int
    tmdb_id: int
    imdb_id: Optional[str] = None
    title: str
    content_type: str
    release_date: Optional[date] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    imdb_rating: Optional[float] = None
    genres: List[GenreResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ContentDetailResponse(BaseModel):
    """Complete detail schema including full synopsis, cast credits, and streaming links."""
    id: int
    tmdb_id: int
    imdb_id: Optional[str] = None
    title: str
    overview: Optional[str] = None
    content_type: str
    release_date: Optional[date] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    imdb_rating: Optional[float] = None
    watch_providers: Optional[Any] = None
    genres: List[GenreResponse] = []
    cast_credits: List[CastCreditResponse] = []

    model_config = ConfigDict(from_attributes=True)