from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.base import Base

# Junction table mapping Movies/Series to multiple Genres
content_genres = Table(
    "content_genres",
    Base.metadata,
    Column("content_id", Integer, ForeignKey("contents.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True)
)