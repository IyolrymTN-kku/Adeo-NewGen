import type { NextAuthConfig } from "next-auth";

/**
 * Edge-runtime-safe NextAuth config.
 * No Prisma, no bcrypt — only JWT/cookie operations that run fine at the Edge.
 * Imported by middleware.ts (Edge) AND spread into the full auth.ts (Node.js).
 */
export default {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Credentials provider added in auth.ts (Node.js only)
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/login";

      // Already logged-in users don't need the login page
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        // Role check: only ADMIN and EDITOR can access admin routes
        const role = auth?.user?.role as string | undefined;
        return role === "ADMIN" || role === "EDITOR";
      }

      return true;
    },

    jwt({ token, user }) {
      // user is only present on initial sign-in
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
