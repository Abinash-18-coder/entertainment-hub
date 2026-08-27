import asyncio
import sys
import os
from datetime import date
from sqlalchemy import delete

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.content import Content

async def purge_old_upcoming():
    today = date.today()
    print(f"🧹 Purging old upcoming entries releasing on or after {today}...")
    
    async with AsyncSessionLocal() as session:
        # Delete future-dated movies to allow a clean fresh ingestion
        stmt = delete(Content).where(Content.release_date >= today)
        result = await session.execute(stmt)
        await session.commit()
        print(f"✅ Removed {result.rowcount} obsolete upcoming records from PostgreSQL.")

if __name__ == "__main__":
    asyncio.run(purge_old_upcoming())