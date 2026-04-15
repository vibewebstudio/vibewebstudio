/**
 * In-memory rate limiter — 100% free, no Redis, no Upstash.
 *
 * Each limiter object exposes an async `.limit(ip)` method that returns
 * { success, limit, remaining, reset } — the same shape the API routes expect.
 *
 * Caveat: resets on server restart and is per-instance (not shared across
 * multiple Vercel regions). Fine for a portfolio / small-business site.
 */

const store = new Map(); // ip → { count, windowStart }

function createLimiter(maxRequests, windowMs) {
  return {
    /** @param {string} ip */
    async limit(ip) {
      const now = Date.now();
      const key = `${maxRequests}:${windowMs}:${ip}`; // namespace per limiter

      const entry = store.get(key);

      if (!entry || now - entry.windowStart >= windowMs) {
        // New window
        store.set(key, { count: 1, windowStart: now });
        return {
          success:   true,
          limit:     maxRequests,
          remaining: maxRequests - 1,
          reset:     now + windowMs,
        };
      }

      if (entry.count >= maxRequests) {
        return {
          success:   false,
          limit:     maxRequests,
          remaining: 0,
          reset:     entry.windowStart + windowMs,
        };
      }

      entry.count += 1;
      return {
        success:   true,
        limit:     maxRequests,
        remaining: maxRequests - entry.count,
        reset:     entry.windowStart + windowMs,
      };
    },
  };
}

/** /api/chat — 10 requests per minute per IP */
export const chatLimiter = createLimiter(10, 60_000);

/** /api/contact — 5 requests per minute per IP */
export const contactLimiter = createLimiter(5, 60_000);

/**
 * Returns the most reliable client IP available in Next.js / Vercel.
 * Falls back to a localhost placeholder so rate limiting still works in dev.
 * @param {Request} request
 */
export function getIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}