from typing import List
from pydantic import BaseModel
from app.schemas.content import ContentListItem

class LibraryStatusResponse(BaseModel):
    is_bookmarked: bool
    is_watched: bool

class LibraryListResponse(BaseModel):
    items: List[ContentListItem]
    total_count: int