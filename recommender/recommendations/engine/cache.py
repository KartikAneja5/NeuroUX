import time

class SimpleTTLCache:
    def __init__(self, default_ttl=300):
        """
        A simple in-memory cache with a Time-To-Live (TTL) expiration mechanism.
        default_ttl: time in seconds before cache expires (default 300 seconds / 5 min)
        Note: Cache is process-level. In production, replace with Redis.
        """
        self.cache = {}
        self.default_ttl = default_ttl

    def get(self, key):
        if key in self.cache:
            value, expires = self.cache[key]
            if time.time() < expires:
                return value
            else:
                # Remove expired key
                del self.cache[key]
        return None

    def set(self, key, value, ttl=None):
        ttl = ttl if ttl is not None else self.default_ttl
        expires = time.time() + ttl
        self.cache[key] = (value, expires)

    def clear(self):
        self.cache.clear()

    def keys(self):
        """Return all non-expired cache keys."""
        now = time.time()
        return [k for k, (_, exp) in self.cache.items() if now < exp]

# Export a single global cache instance with 5-minute TTL
recommendation_cache = SimpleTTLCache(default_ttl=300)
