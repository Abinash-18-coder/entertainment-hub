import httpx
from typing import Dict, Any, List, Optional

from app.core.config import settings


class TMDBService:
    def __init__(self):
        self.base_url = settings.TMDB_BASE_URL

        self.headers = {
            "Authorization": f"Bearer {settings.TMDB_READ_ACCESS_TOKEN}",
            "Accept": "application/json"
        }

        # Fallback if bearer token is empty but API key is present
        self.params = {}

        if (
            not settings.TMDB_READ_ACCESS_TOKEN
            and settings.TMDB_API_KEY
        ):
            self.params["api_key"] = settings.TMDB_API_KEY

    async def get_genres(
        self,
        content_type: str = "movie"
    ) -> List[Dict[str, Any]]:
        """Fetch official genres list for movies or TV shows from TMDb."""

        url = f"{self.base_url}/genre/{content_type}/list"

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=self.params
            )

            if response.status_code == 200:
                return response.json().get("genres", [])

            return []

    async def get_upcoming_movies(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch movies scheduled to be released soon or in future dates."""

        url = f"{self.base_url}/movie/upcoming"

        params = {
            **self.params,
            "page": page
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            return []

    async def get_popular_movies(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch currently popular movies."""

        url = f"{self.base_url}/movie/popular"

        params = {
            **self.params,
            "page": page
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            return []

    async def get_popular_series(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch currently popular TV series."""

        url = f"{self.base_url}/tv/popular"

        params = {
            **self.params,
            "page": page
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            return []

    async def get_popular_sitcoms(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch TV shows categorized under the Comedy genre (Sitcoms)."""

        url = f"{self.base_url}/discover/tv"

        # 35 is TMDb's genre ID for Comedy
        params = {
            **self.params,
            "with_genres": "35",
            "sort_by": "vote_average.desc",
            "vote_count.gte": "200",
            "page": page
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            return []

    async def get_details(
        self,
        content_type: str,
        tmdb_id: int
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch in-depth metadata, including:
        - External IMDb IDs
        - Cast credits
        - Watch providers
        """

        # Our database/application uses:
        # "movie" for movies
        # "series" for TV series
        #
        # TMDb uses:
        # "movie" for movies
        # "tv" for TV series

        endpoint_type = (
            "movie"
            if content_type == "movie"
            else "tv"
        )

        url = f"{self.base_url}/{endpoint_type}/{tmdb_id}"

        params = {
            **self.params,
            "append_to_response": "external_ids,credits,watch/providers"
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json()

            print(
                f"❌ TMDb details request failed: "
                f"{response.status_code} | {url}"
            )

            return None


# IMPORTANT:
# Create the service object so other files can import it using:
# from app.services.tmdb import tmdb_service

tmdb_service = TMDBService()



