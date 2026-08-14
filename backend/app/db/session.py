from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Create Async Engine for high-performance database communication
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Logs generated SQL queries in terminal (great for debugging)
    future=True
)

# Factory for creating async database sessions
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Dependency to get DB session in FastAPI endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()