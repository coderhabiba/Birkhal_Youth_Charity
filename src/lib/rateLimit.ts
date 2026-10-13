interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now - entry.firstRequest > 1000 * 60 * 30) {
        memoryStore.delete(key);
      }
    }
  }, 1000 * 60 * 5);
}

/**
 * In-memory sliding rate limiter per action + IP
 * @param ip Client IP address
 * @param action Action identifier (e.g., 'login', 'contact', 'donation')
 * @param maxAttempts Max allowed requests in the time window
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number, resetSeconds: number }
 */
export function checkRateLimit(
  ip: string,
  action: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { success: boolean; remaining: number; resetSeconds: number } {
  const safeIp = ip || 'unknown-client';
  const key = `${action}:${safeIp}`;
  const now = Date.now();

  const entry = memoryStore.get(key);

  if (!entry) {
    memoryStore.set(key, { count: 1, firstRequest: now });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const elapsed = now - entry.firstRequest;

  if (elapsed > windowMs) {
    // Window expired, reset counter
    memoryStore.set(key, { count: 1, firstRequest: now });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  // Inside current window
  if (entry.count >= maxAttempts) {
    const resetSeconds = Math.ceil((windowMs - elapsed) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetSeconds: Math.ceil((windowMs - elapsed) / 1000),
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}
