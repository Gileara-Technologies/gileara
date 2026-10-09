/**
 * Fixed-window in-memory rate limiter for POST /api/apply.
 *
 * Cloudflare Workers gives every isolate its own memory, so this is
 * best-effort by design: each isolate counts separately, and counters
 * reset when an isolate is recycled. That still bounds what any single
 * isolate will accept, which is the point — the endpoint spends a D1
 * insert plus up to two emails per accepted request, and an uncapped
 * loop could burn both while looking like ordinary traffic.
 *
 * No env vars: the numbers live here so the route and its tests share
 * one definition. Tuning happens by changing APPLY_RATE_LIMIT_MAX /
 * APPLY_RATE_LIMIT_WINDOW_MS and redeploying.
 */

/** Requests one IP may make per window before 429s start. */
export const APPLY_RATE_LIMIT_MAX = 10;

/** Window length for APPLY_RATE_LIMIT_MAX. */
export const APPLY_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export interface RateLimitDecision {
  /** True when this call may proceed. */
  allowed: boolean;
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  /**
   * Record one call for `key`. The first `limit` calls inside the window
   * pass; the next one is denied with a Retry-After countdown. `now` is
   * injectable so tests do not sleep.
   */
  check(key: string, now?: number): RateLimitDecision;
}

export interface RateLimiterOptions {
  /** Calls allowed per window, inclusive. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Guard against unbounded key growth (oldest keys are evicted first). */
  maxKeys?: number;
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const limit = Math.max(1, Math.floor(options.limit));
  const windowMs = Math.max(1, Math.floor(options.windowMs));
  const maxKeys = Math.max(1, options.maxKeys ?? 5000);
  const hits = new Map<string, { count: number; resetAt: number }>();

  const denied = (resetAt: number, now: number): RateLimitDecision => ({
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  });

  return {
    check(key: string, now: number = Date.now()): RateLimitDecision {
      const entry = hits.get(key);
      if (entry && now < entry.resetAt) {
        entry.count += 1;
        if (entry.count > limit) {
          return denied(entry.resetAt, now);
        }
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (hits.size >= maxKeys) {
        // Free expired windows first, then the oldest key, so a flood of
        // distinct keys cannot evict everyone else's counters.
        for (const [staleKey, stale] of hits) {
          if (now >= stale.resetAt) {
            hits.delete(staleKey);
          }
        }
        while (hits.size >= maxKeys) {
          const oldest = hits.keys().next();
          if (oldest.done) {
            break;
          }
          hits.delete(oldest.value);
        }
      }

      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
