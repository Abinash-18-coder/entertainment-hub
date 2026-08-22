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

    # JWT Authentication Settings
    JWT_SECRET_KEY: str = "default_insecure_jwt_secret_change_me_in_env"
    JWT_REFRESH_SECRET_KEY: str = "default_insecure_refresh_secret_change_me_in_env"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()