import asyncio
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.content import Content
from app.models.genre import Genre
from app.models.person import Person
from app.models.cast_credit import CastCredit

from sqlalchemy import select, func


async def verify():
    async with AsyncSessionLocal() as session:

        # Count movies
        movie_count = await session.scalar(
            select(func.count(Content.id))
            .where(Content.content_type == "movie")
        )

        # Count TV series
        series_count = await session.scalar(
            select(func.count(Content.id))
            .where(Content.content_type == "series")
        )

        # Count genres
        genre_count = await session.scalar(
            select(func.count(Genre.id))
        )

        # Count people
        person_count = await session.scalar(
            select(func.count(Person.id))
        )

        # Count cast-credit relationships
        cast_credit_count = await session.scalar(
            select(func.count(CastCredit.id))
        )

        print("\n==============================================")
        print("📊 DATABASE POPULATION SUMMARY")
        print("==============================================")
        print(f"🎬 Movies in DB:              {movie_count}")
        print(f"📺 TV Series in DB:           {series_count}")
        print(f"🏷️ Genres Registered:          {genre_count}")
        print(f"🎭 Cast & Crew Profiles:       {person_count}")
        print(f"🎟️ Cast Credit Relationships: {cast_credit_count}")
        print(f"📦 Total Entertainment:        {movie_count + series_count}")
        print("==============================================\n")


if __name__ == "__main__":
    asyncio.run(verify())