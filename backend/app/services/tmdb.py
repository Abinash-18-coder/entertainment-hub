import httpx
from datetime import date, timedelta
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

        # Force IPv4 to prevent IPv6 timeouts in local environments
        self.transport = httpx.AsyncHTTPTransport(
            local_address="0.0.0.0"
        )

    async def get_genres(
        self,
        content_type: str = "movie"
    ) -> List[Dict[str, Any]]:
        """Fetch official genres list for movies or TV shows from TMDb."""

        url = f"{self.base_url}/genre/{content_type}/list"

        async with httpx.AsyncClient(transport=self.transport, timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=self.params
            )

            if response.status_code == 200:
                return response.json().get("genres", [])

            print(
                f"TMDB GENRE REQUEST FAILED: {response.status_code}"
            )

            return []

    async def get_upcoming_movies(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Fetch high-profile upcoming theatrical and streaming movies across the next 6 months.

        Uses TMDb's discover endpoint with primary release filtering:
        - Primary future release dates across a 180-day window
        - Popularity descending sort to prioritize major studio releases
        - Release types: 2 (Theatrical Limited), 3 (Theatrical Wide), 4 (Digital Premiere)
        """

        url = f"{self.base_url}/discover/movie"

        today = date.today()
        future_date = today + timedelta(days=180)  # Extended 6-month window

        params = {
            **self.params,
            "page": page,
            "language": "en-US",
            "include_adult": "false",
            "include_video": "false",

            # Sort by anticipated popularity
            "sort_by": "popularity.desc",

            # Filter by primary original release date to avoid re-releases
            "primary_release_date.gte": today.isoformat(),
            "primary_release_date.lte": future_date.isoformat(),

            # 2 = Theatrical (Limited), 3 = Theatrical (Wide), 4 = Digital Premiere
            "with_release_type": "2|3|4"
        }

        async with httpx.AsyncClient(
            transport=self.transport,
            timeout=15.0
        ) as client:

            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])

                print(f"🎬 [TMDb Upcoming] Page {page} | Found {len(results)} titles | Date Range: {today} to {future_date}")

                for movie in results:
                    print(
                        f"  -> Title: {movie.get('title')} | Release: {movie.get('release_date')} | Popularity: {movie.get('popularity')}"
                    )

                return results

            print(
                "❌ TMDB UPCOMING REQUEST FAILED:",
                response.status_code
            )

            print(
                "TMDB RESPONSE:",
                response.text
            )

            return []

    async def get_popular_movies(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch popular movies with verified audience volume."""

        url = f"{self.base_url}/discover/movie"

        params = {
            **self.params,
            "page": page,
            "language": "en-US",
            "sort_by": "popularity.desc",
            "vote_count.gte": "100"  # Exclude zero/low-review titles
        }

        async with httpx.AsyncClient(transport=self.transport, timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            print(
                f"TMDB POPULAR MOVIES REQUEST FAILED: {response.status_code}"
            )

            return []

    async def get_popular_series(
        self,
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """Fetch popular TV series with verified audience volume."""

        url = f"{self.base_url}/discover/tv"

        params = {
            **self.params,
            "page": page,
            "language": "en-US",
            "sort_by": "popularity.desc",
            "vote_count.gte": "100"  # Exclude zero/low-review shows
        }

        async with httpx.AsyncClient(
            transport=self.transport,
            timeout=15.0
        ) as client:

            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            print(
                f"TMDB POPULAR SERIES REQUEST FAILED: {response.status_code}"
            )

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

        async with httpx.AsyncClient(transport=self.transport, timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json().get("results", [])

            print(
                f"TMDB SITCOM REQUEST FAILED: {response.status_code}"
            )

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

        async with httpx.AsyncClient(transport=self.transport, timeout=15.0) as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params
            )

            if response.status_code == 200:
                return response.json()

            print(
                f"❌ TMDb details request failed: {response.status_code} | {url}"
            )

            return None


# Global service instance export
tmdb_service = TMDBService()