import asyncio
import sys
import os
from sqlalchemy import select

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.content import Content
from app.services.omdb import omdb_service

async def fix_invalid_ratings():
    print("🔍 Scanning database for unverified 10.0 ratings...")
    
    async with AsyncSessionLocal() as session:
        # Find all titles sitting at exactly 10.0
        stmt = select(Content).where(Content.imdb_rating >= 9.9)
        result = await session.execute(stmt)
        titles = result.scalars().all()
        
        fixed_count = 0
        for item in titles:
            # Check if OMDb actually gives it a 10.0
            actual_imdb = None
            if item.imdb_id:
                actual_imdb = await omdb_service.get_imdb_rating(item.imdb_id)
            
            # If OMDb has no rating or doesn't confirm 10.0, reset to None
            if actual_imdb is None or actual_imdb < 9.8:
                print(f"  🔻 Fixing '{item.title}' (was {item.imdb_rating} -> now {actual_imdb or 'NR'})")
                item.imdb_rating = actual_imdb
                fixed_count += 1
                
        await session.commit()
        print(f"\n✅ Cleaned {fixed_count} artificial rating scores in PostgreSQL.")

if __name__ == "__main__":
    asyncio.run(fix_invalid_ratings())