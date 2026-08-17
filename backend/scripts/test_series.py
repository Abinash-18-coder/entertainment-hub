import asyncio
import os
import sys

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.services.tmdb import tmdb_service
from scripts.ingest_data import process_and_save_item


async def test():
    items = await tmdb_service.get_popular_series(page=1)

    print(f"TV ITEMS FOUND: {len(items)}")

    if not items:
        print("❌ No TV series returned")
        return

    item = items[0]

    print(f"\nTesting: {item.get('name')}")
    print(f"TMDb ID: {item.get('id')}")

    # -----------------------------------------
    # TEST 1: Can we fetch series details?
    # -----------------------------------------
    print("\n🔎 Fetching detailed series information...")

    details = await tmdb_service.get_details(
        "series",
        item["id"]
    )

    if not details:
        print("❌ TMDb returned NO DETAILS for this series.")
        print("This is the actual problem.")
        return

    print("✅ Series details received!")
    print(f"Title: {details.get('name')}")
    print(f"First Air Date: {details.get('first_air_date')}")
    print(f"Genres: {details.get('genres')}")
    print(f"Credits available: {'credits' in details}")
    print(f"External IDs available: {'external_ids' in details}")
    print(f"Watch providers available: {'watch/providers' in details}")

    # -----------------------------------------
    # TEST 2: Save series to database
    # -----------------------------------------
    print("\n💾 Attempting to save series to PostgreSQL...")

    await process_and_save_item(item, "series")

    print("\n✅ Series test completed successfully!")


if __name__ == "__main__":
    asyncio.run(test())