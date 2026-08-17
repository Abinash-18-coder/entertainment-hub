from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Entertainment Hub"
    
    # PostgreSQL Connection Strings
    DATABASE_URL: str = "postgresql+asyncpg://cineverse_user:cineverse_password@localhost:5432/cineverse_db"
    SYNC_DATABASE_URL: str = "postgresql://cineverse_user:cineverse_password@localhost:5432/cineverse_db"
    
    # External API Keys
    TMDB_API_KEY: str = ""
    TMDB_READ_ACCESS_TOKEN: str = ""
    OMDB_API_KEY: str = ""
    
    # Base URLs
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE_URL: str = "https://image.tmdb.org/t/p/w500"
    OMDB_BASE_URL: str = "https://www.omdbapi.com/"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()