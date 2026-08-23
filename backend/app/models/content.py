from sqlalchemy import String, Integer, Text, Date, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date
from typing import Optional, List, Any
from app.db.base import Base
from app.models.associations import content_genres, user_bookmarks, user_watched

class Content(Base):
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tmdb_id: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    imdb_id: Mapped[Optional[str]] = mapped_column(String(20), index=True, nullable=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    overview: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_type: Mapped[str] = mapped_column(String(20), nullable=False)
    
    release_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    poster_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    backdrop_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    imdb_rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True, index=True)
    watch_providers: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)

    # Relationships
    genres = relationship("Genre", secondary=content_genres, back_populates="contents")
    cast_credits = relationship("CastCredit", back_populates="content", cascade="all, delete-orphan")
    
    bookmarked_by_users = relationship("User", secondary=user_bookmarks, back_populates="bookmarked_contents")
    watched_by_users = relationship("User", secondary=user_watched, back_populates="watched_contents")