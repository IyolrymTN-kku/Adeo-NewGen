import NextAuth from "next-auth";
import authConfig from "@/auth.config";

/**
 * Run the NextAuth middleware using ONLY the edge-compatible config.
 * The full auth.ts (Prisma + bcrypt) is intentionally NOT imported here
 * because Next.js middleware runs on the Edge Runtime.
 *
 * Route protection and login-page redirect are handled inside
 * authConfig.callbacks.authorized.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     *   _next/static   — Next.js static assets
     *   _next/image    — image optimisation
     *   favicon.ico
     *   public/        — uploaded files, SVGs, etc.
     *   api/auth       — NextAuth's own endpoints (must stay public)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|public/|api/auth).*)",
  ],
};
