import logging
from datetime import date
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.content import Content
from app.services.tmdb import tmdb_service
from app.services.omdb import omdb_service

# Setup structured logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cineverse.scheduler")

async def refresh_upcoming_releases_job():
    """
    Scheduled Background Job: Fetches newly scheduled upcoming releases from TMDb 
    and updates existing release dates in PostgreSQL.
    """
    logger.info("⏰ [APScheduler] Starting upcoming releases sync job...")
    try:
        items = await tmdb_service.get_upcoming_movies(page=1)
        updated_count = 0

        async with AsyncSessionLocal() as session:
            for item in items:
                tmdb_id = item.get("id")
                raw_date = item.get("release_date")
                if not tmdb_id or not raw_date:
                    continue

                stmt = select(Content).where(Content.tmdb_id == tmdb_id)
                res = await session.execute(stmt)
                content = res.scalar_one_or_none()

                if content:
                    try:
                        parsed_date = date.fromisoformat(raw_date)
                        if content.release_date != parsed_date:
                            content.release_date = parsed_date
                            updated_count += 1
                    except ValueError:
                        continue

            await session.commit()
        logger.info(f"✅ [APScheduler] Upcoming releases synced successfully! ({updated_count} dates updated).")
    except Exception as e:
        logger.error(f"❌ [APScheduler] Upcoming releases job failed: {str(e)}", exc_info=True)

async def refresh_imdb_ratings_job():
    """
    Scheduled Background Job: Scans database for titles missing IMDb ratings or 
    requiring periodic score updates via OMDb.
    """
    logger.info("⏰ [APScheduler] Starting IMDb ratings refresh job...")
    try:
        updated_count = 0
        async with AsyncSessionLocal() as session:
            # Look for 20 titles with valid IMDb IDs to update
            stmt = select(Content).where(Content.imdb_id.isnot(None)).limit(20)
            res = await session.execute(stmt)
            titles = res.scalars().all()

            for content in titles:
                new_rating = await omdb_service.get_imdb_rating(content.imdb_id)
                if new_rating and new_rating != content.imdb_rating:
                    content.imdb_rating = new_rating
                    updated_count += 1

            await session.commit()
        logger.info(f"✅ [APScheduler] IMDb ratings refreshed successfully! ({updated_count} ratings updated).")
    except Exception as e:
        logger.error(f"❌ [APScheduler] Ratings refresh job failed: {str(e)}", exc_info=True)