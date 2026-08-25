import time
from typing import Any, Optional, Dict

class SimpleAsyncCache:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a cached value if it exists and has not expired."""
        entry = self._cache.get(key)
        if not entry:
            return None
        
        if time.time() > entry["expires_at"]:
            del self._cache[key]
            return None
        
        return entry["value"]

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Store a value in cache with a specified expiration time."""
        self._cache[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

    def clear(self) -> None:
        """Purge all cached entries."""
        self._cache.clear()

memory_cache = SimpleAsyncCache()