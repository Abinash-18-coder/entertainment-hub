import httpx
from typing import Optional
from app.core.config import settings

class OMDBService:
    def __init__(self):
        self.base_url = settings.OMDB_BASE_URL
        self.api_key = settings.OMDB_API_KEY

    async def get_imdb_rating(self, imdb_id: str) -> Optional[float]:
        """Fetch official IMDb rating using the content's unique IMDb ID."""
        if not self.api_key or not imdb_id:
            return None

        params = {
            "apikey": self.api_key,
            "i": imdb_id
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(self.base_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    rating_str = data.get("imdbRating")
                    if rating_str and rating_str != "N/A":
                        return float(rating_str)
            except Exception as e:
                print(f"⚠️ OMDb lookup failed for {imdb_id}: {e}")
        return None

omdb_service = OMDBService()