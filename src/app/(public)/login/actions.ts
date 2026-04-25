"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { consumeLoginAttempt, resetLoginAttempts } from "@/lib/security/rate-limit";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

export type LoginState = {
  error: string | null;
  fieldErrors?: { email?: string[]; password?: string[] };
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // ── 1. Extract IP (OWASP A07 — rate limit per IP) ─────────────────────────
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "127.0.0.1";

  // ── 2. Rate limit check — fail fast before any DB work ────────────────────
  const rateLimit = await consumeLoginAttempt(ip);
  if (!rateLimit.success) {
    const minutes = Math.ceil(rateLimit.retryAfterSeconds / 60);
    return {
      error: `Too many login attempts. Please wait ${minutes} minute${minutes !== 1 ? "s" : ""} before trying again.`,
    };
  }

  // ── 3. Zod validation — reject malformed input before hitting the DB ───────
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: null,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // ── 4. Delegate credential verification to NextAuth's Credentials provider ─
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });

    // On success, reset rate-limit counter for this IP
    await resetLoginAttempts(ip);

    return { error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      // CredentialsSignin covers wrong password or authorize() returning null
      return { error: "Invalid email or password. Please try again." };
    }
    // NEXT_REDIRECT — must be re-thrown so Next.js can handle the redirect
    throw err;
  }
}
