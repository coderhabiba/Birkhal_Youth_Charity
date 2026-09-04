/**
 * Simple in-memory cache for MongoDB query results.
 * Caches data for a configurable TTL so that pages render instantly
 * from cache instead of waiting 90s for MongoDB Atlas free tier timeouts.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const globalAny = globalThis as any;
if (!globalAny.__app_db_cache__) {
  globalAny.__app_db_cache__ = new Map<string, CacheEntry<any>>();
}
if (!globalAny.__app_db_in_flight__) {
  globalAny.__app_db_in_flight__ = new Map<string, Promise<any>>();
}

const cache: Map<string, CacheEntry<any>> = globalAny.__app_db_cache__;
const inFlight: Map<string, Promise<any>> = globalAny.__app_db_in_flight__;
const DEFAULT_TTL_MS = 60_000; // 60 seconds

/**
 * Get data from cache or fetch from the provided async function.
 * If the cache is stale, it still returns stale data immediately
 * and refreshes in the background (stale-while-revalidate pattern).
 * Deduplicates in-flight requests to avoid cache stamps.
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);

  // Fresh cache hit - return immediately (< 1ms)
  if (entry && (now - entry.timestamp) < ttlMs) {
    return entry.data;
  }

  // Stale cache exists - return stale data immediately and refresh in background
  if (entry) {
    if (!inFlight.has(key)) {
      const refreshPromise = queryFn()
        .then((data) => {
          cache.set(key, { data, timestamp: Date.now() });
          inFlight.delete(key);
        })
        .catch((err) => {
          console.error(`[cache] Background refresh failed for key "${key}":`, err.message);
          inFlight.delete(key);
        });
      inFlight.set(key, refreshPromise);
    }
    return entry.data;
  }

  // No cache yet: check if another request is already fetching this key
  if (inFlight.has(key)) {
    return inFlight.get(key)!;
  }

  // Fetch fresh data with in-flight deduplication
  const fetchPromise = queryFn()
    .then((data) => {
      cache.set(key, { data, timestamp: Date.now() });
      inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      inFlight.delete(key);
      console.error(`[cache] Query failed for key "${key}":`, err.message || err);
      // If we have any previous stale cache, fallback to it
      const fallback = cache.get(key);
      if (fallback) {
        return fallback.data;
      }
      throw err;
    });

  inFlight.set(key, fetchPromise);
  return fetchPromise;
}

/**
 * Invalidate a specific cache key (e.g., after a mutation)
 */
export function invalidateCache(key: string) {
  cache.delete(key);
}

/**
 * Invalidate all cache keys matching a prefix
 */
export function invalidateCacheByPrefix(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear the entire cache
 */
export function clearCache() {
  cache.clear();
}
