from sqlalchemy import Table, Column, Integer, ForeignKey, DateTime
from datetime import datetime
from app.db.base import Base

# Junction table mapping Movies/Series to multiple Genres
content_genres = Table(
    "content_genres",
    Base.metadata,
    Column("content_id", Integer, ForeignKey("contents.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True)
)

# Junction table: User Bookmarks (Watchlist)
user_bookmarks = Table(
    "user_bookmarks",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("content_id", Integer, ForeignKey("contents.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime, default=datetime.utcnow)
)

# Junction table: User Watched History
user_watched = Table(
    "user_watched",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("content_id", Integer, ForeignKey("contents.id", ondelete="CASCADE"), primary_key=True),
    Column("watched_at", DateTime, default=datetime.utcnow)
)