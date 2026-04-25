import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

/**
 * Login rate limiter: 5 attempts per 15 minutes per IP.
 * Uses in-memory store — swap for RateLimiterRedis in production.
 *
 * OWASP A07: Identification and Authentication Failures.
 */
const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,     // 15 minutes window
  blockDuration: 15 * 60, // block for 15 minutes once exhausted
});

export type RateLimitResult =
  | { success: true; remainingPoints: number }
  | { success: false; retryAfterSeconds: number };

export async function consumeLoginAttempt(
  ip: string
): Promise<RateLimitResult> {
  try {
    const result = await loginLimiter.consume(ip);
    return { success: true, remainingPoints: result.remainingPoints };
  } catch (err) {
    if (err instanceof RateLimiterRes) {
      return {
        success: false,
        retryAfterSeconds: Math.ceil(err.msBeforeNext / 1000),
      };
    }
    throw err;
  }
}

export async function resetLoginAttempts(ip: string): Promise<void> {
  await loginLimiter.delete(ip);
}
