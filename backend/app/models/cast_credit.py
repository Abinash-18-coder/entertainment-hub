from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from app.db.base import Base

class CastCredit(Base):
    __tablename__ = "cast_credits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content_id: Mapped[int] = mapped_column(Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    person_id: Mapped[int] = mapped_column(Integer, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    
    character_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0) # Billing order on posters

    # Relationships
    content = relationship("Content", back_populates="cast_credits")
    person = relationship("Person", back_populates="cast_credits")