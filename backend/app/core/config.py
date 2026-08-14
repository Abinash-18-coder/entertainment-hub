from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Entertainment Hub"
    
    # PostgreSQL Connection String
    # Format: postgresql+asyncpg://user:password@host:port/dbname
    DATABASE_URL: str = "postgresql+asyncpg://cineverse_user:cineverse_password@localhost:5432/cineverse_db"
    
    # Sync connection string needed specifically by Alembic migrations
    SYNC_DATABASE_URL: str = "postgresql://cineverse_user:cineverse_password@localhost:5432/cineverse_db"

    class Config:
        case_sensitive = True

settings = Settings()