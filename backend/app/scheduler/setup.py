import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.scheduler.jobs import refresh_upcoming_releases_job, refresh_imdb_ratings_job

logger = logging.getLogger("cineverse.scheduler")
scheduler = AsyncIOScheduler()

def start_scheduler():
    """Configures and starts the background job scheduler."""
    # 1. Schedule Upcoming Releases Refresh every 12 hours
    scheduler.add_job(
        refresh_upcoming_releases_job,
        trigger=IntervalTrigger(hours=12),
        id="refresh_upcoming_releases",
        name="Refresh Upcoming Releases from TMDb",
        replace_existing=True,
    )

    # 2. Schedule IMDb Ratings Refresh every 6 hours
    scheduler.add_job(
        refresh_imdb_ratings_job,
        trigger=IntervalTrigger(hours=6),
        id="refresh_imdb_ratings",
        name="Refresh IMDb Scores from OMDb",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("🚀 [APScheduler] Background task scheduler initialized and active.")

def shutdown_scheduler():
    """Gracefully shuts down the background job scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("🛑 [APScheduler] Background task scheduler shutdown cleanly.")