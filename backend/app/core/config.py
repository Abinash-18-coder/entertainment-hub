from typing import List, Union
from pydantic import field_validator
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

    # CORS Origins: Accepts comma-separated string or list
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cineverse-hub.vercel.app"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
