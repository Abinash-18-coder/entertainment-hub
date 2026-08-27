import asyncio
import sys
import os
from datetime import datetime, date
from typing import Dict, Any, Optional

# Add parent directory to path so script can access app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.content import Content
from app.models.genre import Genre
from app.models.person import Person
from app.models.cast_credit import CastCredit
from app.services.tmdb import tmdb_service
from app.services.omdb import omdb_service
from sqlalchemy import select
from sqlalchemy.orm import selectinload

# TMDb rate-limiting control: limit concurrent network calls to 5
SEMAPHORE = asyncio.Semaphore(5)

def parse_date(date_string: Optional[str]) -> Optional[date]:
    """Safely converts YYYY-MM-DD string to Python date object, avoiding timezone bugs."""
    if not date_string:
        return None
    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None

def extract_watch_providers(providers_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extracts streaming providers (Netflix, Prime, Hotstar/Disney+) with direct links."""
    results = providers_data.get("results", {})
    # Prioritize IN (India) or US (United States) provider lists
    region_data = results.get("IN") or results.get("US") or {}
    
    link = region_data.get("link", "")
    flatrate = region_data.get("flatrate", [])  # Subscription streaming platforms
    
    providers_list = []
    for provider in flatrate:
        providers_list.append({
            "provider_id": provider.get("provider_id"),
            "name": provider.get("provider_name"),
            "logo_path": f"https://image.tmdb.org/t/p/original{provider.get('logo_path')}" if provider.get("logo_path") else None
        })
        
    return {
        "watch_link": link,
        "providers": providers_list
    }

async def sync_genres():
    """Fetches and caches all movie and TV genres from TMDb to ensure zero duplicates."""
    print("🔄 Syncing genres from TMDb...")
    movie_genres = await tmdb_service.get_genres("movie")
    tv_genres = await tmdb_service.get_genres("tv")
    
    all_genres = {g["id"]: g["name"] for g in (movie_genres + tv_genres)}
    
    async with AsyncSessionLocal() as session:
        for tmdb_id, name in all_genres.items():
            stmt = select(Genre).where(Genre.tmdb_id == tmdb_id)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if not existing:
                genre = Genre(tmdb_id=tmdb_id, name=name)
                session.add(genre)
        await session.commit()
    print(f"✅ Genres synced successfully ({len(all_genres)} unique genres mapped).")

async def process_and_save_item(item_summary: Dict[str, Any], content_type: str):
    """Fetches details, credits, ratings, and saves a single movie or series to PostgreSQL."""
    tmdb_id = item_summary["id"]
    
    # 1. Filter out obscure / low-profile titles and missing posters
    popularity = item_summary.get("popularity", 0)
    has_poster = bool(item_summary.get("poster_path"))
    
    if content_type == "movie" and (popularity < 15.0 or not has_poster):
        return

    async with SEMAPHORE:
        # Rate-limiting micro-delay (prevents hitting the 40 requests/10-sec limit)
        await asyncio.sleep(0.25)
        details = await tmdb_service.get_details(content_type, tmdb_id)
        if not details:
            return

    # Extract clean attributes
    title = details.get("title") if content_type == "movie" else details.get("name")
    overview = details.get("overview")
    raw_date = details.get("release_date") if content_type == "movie" else details.get("first_air_date")
    release_date = parse_date(raw_date)
    
    poster_path = f"https://image.tmdb.org/t/p/w500{details['poster_path']}" if details.get("poster_path") else None
    backdrop_path = f"https://image.tmdb.org/t/p/original{details['backdrop_path']}" if details.get("backdrop_path") else None
    
    # Extract IMDb ID
    external_ids = details.get("external_ids", {})
    imdb_id = external_ids.get("imdb_id")
    
    # 2. Fetch accurate IMDb rating from OMDb with minimum vote protection
    imdb_rating = None
    if imdb_id:
        imdb_rating = await omdb_service.get_imdb_rating(imdb_id)
    
    if imdb_rating is None:
        # Fallback to TMDb only if it has a statistically significant vote count (>= 200 votes)
        raw_vote = details.get("vote_average")
        vote_count = details.get("vote_count", 0)
        
        # Guard against 1-vote "10.0" ratings on obscure/upcoming titles
        if raw_vote and vote_count >= 200:
            imdb_rating = round(raw_vote, 1)
        else:
            imdb_rating = None  # Stored as unrated (NR / TBA)

    # Extract Streaming Providers & Direct Links
    watch_providers = extract_watch_providers(details.get("watch/providers", {}))

    async with AsyncSessionLocal() as session:
        # Check if content already exists
        stmt = (
            select(Content)
            .options(selectinload(Content.genres))
            .where(Content.tmdb_id == tmdb_id)
        )
        res = await session.execute(stmt)
        content = res.scalar_one_or_none()

        if not content:
            content = Content(
                tmdb_id=tmdb_id,
                imdb_id=imdb_id,
                title=title,
                overview=overview,
                content_type=content_type,
                release_date=release_date,
                poster_path=poster_path,
                backdrop_path=backdrop_path,
                imdb_rating=imdb_rating,
                watch_providers=watch_providers
            )
            session.add(content)
            await session.flush()
        else:
            # Update existing record
            content.title = title
            content.overview = overview
            content.release_date = release_date
            content.poster_path = poster_path
            content.backdrop_path = backdrop_path
            content.imdb_rating = imdb_rating
            content.watch_providers = watch_providers

        # Map Genres
        item_genres = details.get("genres", [])
        await session.refresh(content, attribute_names=["genres"])
        for g_data in item_genres:
            g_stmt = select(Genre).where(Genre.tmdb_id == g_data["id"])
            g_res = await session.execute(g_stmt)
            genre_obj = g_res.scalar_one_or_none()

            if genre_obj and genre_obj not in content.genres:
                content.genres.append(genre_obj)

        # Map Top 5 Cast Members
        cast_list = details.get("credits", {}).get("cast", [])[:5]
        for index, actor_data in enumerate(cast_list):
            actor_tmdb_id = actor_data.get("id")
            actor_name = actor_data.get("name")
            actor_profile = f"https://image.tmdb.org/t/p/w185{actor_data['profile_path']}" if actor_data.get("profile_path") else None
            character_name = actor_data.get("character")

            # Check if actor person already exists
            p_stmt = select(Person).where(Person.tmdb_id == actor_tmdb_id)
            p_res = await session.execute(p_stmt)
            person = p_res.scalar_one_or_none()

            if not person:
                person = Person(
                    tmdb_id=actor_tmdb_id,
                    name=actor_name,
                    profile_path=actor_profile
                )
                session.add(person)
                await session.flush()

            # Check if credit relationship already exists
            c_stmt = select(CastCredit).where(
                CastCredit.content_id == content.id,
                CastCredit.person_id == person.id
            )
            c_res = await session.execute(c_stmt)
            if not c_res.scalar_one_or_none():
                credit = CastCredit(
                    content_id=content.id,
                    person_id=person.id,
                    character_name=character_name,
                    order=index
                )
                session.add(credit)

        await session.commit()
        print(f"  🍿 Processed: {title} ({content_type}) | Release: {release_date} | IMDb: {imdb_rating or 'NR'} ⭐")

async def run_ingestion():
    print("=====================================================")
    print("🎬 STARTING SEED DATA INGESTION (TMDB + OMDB)")
    print("=====================================================")
    
    # Step 1: Sync Genres
    await sync_genres()
    
    # Step 2: Ingest Upcoming Movies (Pages 1 to 6 ~ 120 high-profile future titles)
    print("\n📅 Ingesting Top Anticipated Upcoming Movies (Next 6 Months)...")
    for page in range(1, 7):
        items = await tmdb_service.get_upcoming_movies(page=page)
        for item in items:
            await process_and_save_item(item, "movie")
            
    # Step 3: Ingest Popular Movies (Pages 1 to 4 ~ 80 titles)
    print("\n🎥 Ingesting Popular Movies...")
    for page in range(1, 5):
        items = await tmdb_service.get_popular_movies(page=page)
        for item in items:
            await process_and_save_item(item, "movie")

    # Step 4: Ingest TV Series (Pages 1 to 4 ~ 80 titles)
    print("\n📺 Ingesting Popular TV Series...")
    for page in range(1, 5):
        items = await tmdb_service.get_popular_series(page=page)
        for item in items:
            await process_and_save_item(item, "series")

    # Step 5: Ingest Sitcoms (TV Comedy) (Pages 1 to 3 ~ 60 titles)
    print("\n😂 Ingesting Popular Sitcoms...")
    for page in range(1, 4):
        items = await tmdb_service.get_popular_sitcoms(page=page)
        for item in items:
            await process_and_save_item(item, "series")

    print("\n=====================================================")
    print("🎉 DATA INGESTION COMPLETED SUCCESSFULLY!")
    print("=====================================================")

if __name__ == "__main__":
    asyncio.run(run_ingestion())