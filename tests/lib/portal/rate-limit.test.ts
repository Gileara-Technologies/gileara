import { describe, expect, it } from "vitest";
import {
  APPLY_RATE_LIMIT_MAX,
  APPLY_RATE_LIMIT_WINDOW_MS,
  createRateLimiter,
} from "@/lib/portal/rate-limit";

describe("createRateLimiter", () => {
  it("allows exactly `limit` calls inside one window", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const now = 1_000_000;

    for (let i = 0; i < 3; i += 1) {
      expect(limiter.check("ip", now)).toEqual({
        allowed: true,
        retryAfterSeconds: 0,
      });
    }
    const denied = limiter.check("ip", now);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterSeconds).toBe(60);
  });

  it("keeps counters separate per key", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    const now = 1_000_000;

    expect(limiter.check("ip-a", now).allowed).toBe(true);
    expect(limiter.check("ip-a", now).allowed).toBe(false);
    expect(limiter.check("ip-b", now).allowed).toBe(true);
  });

  it("starts a fresh window after the old one expires", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    const start = 1_000_000;

    expect(limiter.check("ip", start).allowed).toBe(true);
    expect(limiter.check("ip", start + 59_000).allowed).toBe(false);
    // One second past the reset boundary the caller is welcome again.
    expect(limiter.check("ip", start + 60_001).allowed).toBe(true);
  });

  it("counts from the first hit, not from each hit", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000 });
    const start = 1_000_000;

    expect(limiter.check("ip", start).allowed).toBe(true);
    expect(limiter.check("ip", start + 900).allowed).toBe(true);
    expect(limiter.check("ip", start + 999).allowed).toBe(false);
    expect(limiter.check("ip", start + 2_000).allowed).toBe(true);
  });

  it("evicts the oldest key when at capacity, not an arbitrary one", () => {
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 60_000,
      maxKeys: 2,
    });
    const now = 1_000_000;

    expect(limiter.check("a", now).allowed).toBe(true);
    expect(limiter.check("b", now).allowed).toBe(true);
    // At capacity: "a" is oldest, so it is the one dropped for "c".
    expect(limiter.check("c", now).allowed).toBe(true);
    expect(limiter.check("b", now).allowed).toBe(false); // b's counter survived
    expect(limiter.check("a", now).allowed).toBe(true); // a starts fresh
    expect(limiter.check("a", now).allowed).toBe(false);
  });

  it("makes room from an expired key while a younger key keeps counting", () => {
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 1_000,
      maxKeys: 2,
    });
    const start = 1_000_000;

    limiter.check("older", start); // expires at start + 1000
    limiter.check("younger", start + 500); // expires at start + 1500
    // At start + 1100 the older key's window is over; admitting "new" must
    // not cost the younger key its recorded hit.
    expect(limiter.check("new", start + 1_100).allowed).toBe(true);
    expect(limiter.check("younger", start + 1_100).allowed).toBe(false);
    expect(limiter.check("older", start + 1_100).allowed).toBe(true);
  });

  it("ships apply-route defaults that are sane for a public form", () => {
    expect(APPLY_RATE_LIMIT_MAX).toBeGreaterThanOrEqual(5);
    expect(APPLY_RATE_LIMIT_MAX).toBeLessThanOrEqual(60);
    expect(APPLY_RATE_LIMIT_WINDOW_MS).toBeGreaterThanOrEqual(60_000);
  });
});
