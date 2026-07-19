/**
 * @module rate-limit
 * @description In-memory token-bucket rate limiter for Next.js API routes.
 *
 * Designed to protect AI inference endpoints from abuse and protect
 * against denial-of-service attacks during stadium operations.
 * Note: Uses in-process Map — suitable for single-process deployments.
 * For multi-instance Vercel deployments, swap the store with an
 * edge-compatible KV store (e.g. Vercel KV or Upstash Redis).
 */

import { NextRequest } from "next/server";

/** Configuration for a rate-limit window. */
export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

/** Result returned by {@link rateLimit}. */
export interface RateLimitResult {
  /** Whether the request is allowed to proceed. */
  success: boolean;
  /** The maximum request limit for this window. */
  limit: number;
  /** How many requests remain in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the rate-limit window resets. */
  reset: number;
}

/** Internal per-IP tracking record. */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store keyed by IP address
const store = new Map<string, RateLimitRecord>();

/**
 * Evaluates a request against a sliding-window rate limit.
 *
 * @param req    - The incoming Next.js request object.
 * @param config - The rate-limit configuration.
 * @returns A {@link RateLimitResult} indicating whether the request should proceed.
 *
 * @example
 * ```ts
 * const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
 * if (!rl.success) {
 *   return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 * }
 * ```
 */
export function rateLimit(
  req: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  // Prefer the first IP in X-Forwarded-For (set by Vercel / reverse proxies)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded
      ? forwarded.split(",")[0].trim()
      : (req as unknown as { ip?: string }).ip ?? "127.0.0.1";

  const now = Date.now();
  const record = store.get(ip);

  // First request from this IP
  if (!record) {
    store.set(ip, { count: 1, resetTime: now + config.windowMs });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + config.windowMs,
    };
  }

  // Window has expired — reset the counter
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.windowMs;
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: record.resetTime,
    };
  }

  // Over the limit
  if (record.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Within the limit — increment and allow
  record.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - record.count,
    reset: record.resetTime,
  };
}
