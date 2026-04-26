import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

/**
 * Login rate limiter: 5 attempts per 15 minutes per IP.
 * Uses in-memory store — swap for RateLimiterRedis in production.
 *
 * OWASP A07: Identification and Authentication Failures.
 */
const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

/**
 * Contact form rate limiter: 3 submissions per hour per IP.
 * Defends the public contact form against spam and abuse.
 */
const contactLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60 * 60,
  blockDuration: 60 * 60,
});

export type RateLimitResult =
  | { success: true; remainingPoints: number }
  | { success: false; retryAfterSeconds: number };

async function consume(
  limiter: RateLimiterMemory,
  ip: string
): Promise<RateLimitResult> {
  try {
    const result = await limiter.consume(ip);
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

export function consumeLoginAttempt(ip: string): Promise<RateLimitResult> {
  return consume(loginLimiter, ip);
}

export async function resetLoginAttempts(ip: string): Promise<void> {
  await loginLimiter.delete(ip);
}

export function consumeContactAttempt(ip: string): Promise<RateLimitResult> {
  return consume(contactLimiter, ip);
}
