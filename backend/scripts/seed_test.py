import asyncio
import sys
import os
from datetime import date

# Add parent directory to path so script can find 'app'
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.content import Content
from app.models.genre import Genre
from app.models.person import Person
from app.models.cast_credit import CastCredit
from app.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def run_seed_and_test():
    print("🚀 Starting Database Test Script...")
    
    async with AsyncSessionLocal() as session:
        # 1. Create a Genre
        sci_fi = Genre(tmdb_id=878, name="Science Fiction")
        session.add(sci_fi)
        
        # 2. Create Content (Movie)
        interstellar = Content(
            tmdb_id=157336,
            imdb_id="tt0816692",
            title="Interstellar",
            overview="A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            content_type="movie",
            release_date=date(2014, 11, 7),
            imdb_rating=8.7
        )
        # Connect Genre to Content
        interstellar.genres.append(sci_fi)
        session.add(interstellar)
        
        # 3. Create Person & Cast Credit
        matthew = Person(tmdb_id=10297, name="Matthew McConaughey")
        session.add(matthew)
        await session.flush() # Flushes to generate IDs
        
        credit = CastCredit(
            content=interstellar,
            person=matthew,
            character_name="Cooper",
            order=0
        )
        session.add(credit)
        
        # 4. Create User
        test_user = User(
            email="developer@cineverse.com",
            hashed_password="fakehashedpassword123"
        )
        session.add(test_user)
        
        # Commit everything to PostgreSQL
        await session.commit()
        print("✅ Data successfully inserted into PostgreSQL!")

        # 5. Query and verify the data
        print("\n🔍 Querying Database to Verify...")
        stmt = (
            select(Content)
            .options(selectinload(Content.genres), selectinload(Content.cast_credits).selectinload(CastCredit.person))
            .where(Content.title == "Interstellar")
        )
        result = await session.execute(stmt)
        movie = result.scalar_one()

        print(f"🎬 Movie Found: {movie.title} ({movie.release_date.year}) - IMDb: {movie.imdb_rating}/10")
        print(f"🏷️  Genre: {movie.genres[0].name}")
        print(f"🎭 Star: {movie.cast_credits[0].person.name} as '{movie.cast_credits[0].character_name}'")

if __name__ == "__main__":
    asyncio.run(run_seed_and_test())