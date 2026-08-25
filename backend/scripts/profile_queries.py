import asyncio
import sys
import os
from sqlalchemy import text

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.db.session import AsyncSessionLocal

async def profile():
    print("🔍 Profiling PostgreSQL Query Execution Plans...\n")
    
    queries = [
        ("Leaderboard Query (Type + Rating)", 
         "EXPLAIN ANALYZE SELECT * FROM contents WHERE content_type = 'movie' ORDER BY imdb_rating DESC NULLS LAST LIMIT 20;"),
        ("Upcoming Calendar Query (Release Date)", 
         "EXPLAIN ANALYZE SELECT * FROM contents WHERE release_date >= CURRENT_DATE ORDER BY release_date ASC LIMIT 20;")
    ]

    async with AsyncSessionLocal() as session:
        for name, sql in queries:
            print(f"==================================================")
            print(f"📊 Test: {name}")
            print(f"==================================================")
            result = await session.execute(text(sql))
            plan_lines = result.scalars().all()
            for line in plan_lines:
                print(f"  {line}")
            print()

if __name__ == "__main__":
    asyncio.run(profile())