import { NextRequest } from "next/server";

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(req: NextRequest, config: RateLimitConfig): { success: boolean; limit: number; remaining: number; reset: number } {
  // Try to get IP from headers (x-forwarded-for or real-ip)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : (req as unknown as { ip?: string }).ip || "127.0.0.1";
  
  const now = Date.now();
  const record = store.get(ip);

  if (!record) {
    store.set(ip, { count: 1, resetTime: now + config.windowMs });
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + config.windowMs };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.windowMs;
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: record.resetTime };
  }

  if (record.count >= config.limit) {
    return { success: false, limit: config.limit, remaining: 0, reset: record.resetTime };
  }

  record.count++;
  return { success: true, limit: config.limit, remaining: config.limit - record.count, reset: record.resetTime };
}
