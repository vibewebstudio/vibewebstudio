/**
 * In-memory rate limiter — zero dependencies, no Redis required.
 *
 * Each limiter exposes an async `.limit(ip)` method returning:
 *   { success, limit, remaining, reset }
 *
 * ⚠️  Resets on cold starts and is not shared across serverless instances.
 *     For production, swap to Upstash — the packages are already in package.json:
 *
 *     import { Ratelimit } from "@upstash/ratelimit";
 *     import { Redis } from "@upstash/redis";
 *     const redis = Redis.fromEnv();
 *     export const chatLimiter = new Ratelimit({
 *       redis,
 *       limiter: Ratelimit.slidingWindow(10, "60 s"),
 *       prefix: "chat",
 *     });
 */

const store = new Map();

// Prevent unbounded memory growth — prune expired entries periodically.
const PRUNE_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    // Extract windowMs from the key prefix: "maxReq:windowMs:ip"
    const windowMs = parseInt(key.split(":")[1], 10);
    if (!isNaN(windowMs) && now - entry.windowStart >= windowMs) {
      store.delete(key);
    }
  }
}, PRUNE_INTERVAL_MS);

function createLimiter(maxRequests, windowMs) {
  return {
    async limit(ip) {
      const now = Date.now();
      const key = `${maxRequests}:${windowMs}:${ip}`;
      const entry = store.get(key);

      if (!entry || now - entry.windowStart >= windowMs) {
        store.set(key, { count: 1, windowStart: now });
        return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
      }

      if (entry.count >= maxRequests) {
        return { success: false, limit: maxRequests, remaining: 0, reset: entry.windowStart + windowMs };
      }

      entry.count += 1;
      return { success: true, limit: maxRequests, remaining: maxRequests - entry.count, reset: entry.windowStart + windowMs };
    },
  };
}

/** /api/chat — 10 requests per minute per IP */
export const chatLimiter = createLimiter(10, 60_000);

/** /api/contact — 5 requests per minute per IP */
export const contactLimiter = createLimiter(5, 60_000);

/**
 * Returns the most reliable client IP in Next.js / Vercel.
 * Falls back to localhost so rate limiting works in dev.
 */
export function getIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
