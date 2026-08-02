import time

class SimpleTTLCache:
    def __init__(self, default_ttl=300):
        """
        A process-level in-memory cache with Time-To-Live (TTL) expiration.
        
        ARCHITECTURE LIMITATION & PRODUCTION NOTE:
        This cache operates strictly in-memory within a single Python process instance.
        In multi-instance cloud deployments (e.g. horizontally scaled Render web dynos
        or Kubernetes pods), cache entries are not shared across instances, leading to
        potential cache skew across replicas.
        
        Production Path: Replace this in-memory dictionary with a centralized Redis instance
        (e.g., redis-py / django-redis) for shared distributed caching across dynos.
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
