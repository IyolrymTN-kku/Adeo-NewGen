import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Session } from "next-auth";

export type AdminRole = "ADMIN" | "EDITOR";

export type AdminSession = Session & {
  user: NonNullable<Session["user"]> & {
    id: string;
    role: AdminRole;
  };
};

function isAdminRole(role: unknown): role is AdminRole {
  return role === "ADMIN" || role === "EDITOR";
}

/**
 * Page-level guard: redirects unauthenticated users to /login (with callbackUrl)
 * and forbids non-admin roles. Always call this at the top of admin pages.
 *
 * OWASP A01: Broken Access Control — every admin page reads session and verifies
 * role, layered on top of the middleware route matcher.
 */
export async function requireAdminPage(
  callbackPath = "/admin"
): Promise<AdminSession> {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }
  const role = (session.user as { role?: unknown }).role;
  if (!isAdminRole(role)) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }
  return session as AdminSession;
}

/**
 * Server-Action guard: throws on unauthorized requests. Use at the very top of
 * every mutating Server Action — never trust middleware alone for state changes.
 */
export async function requireAdminAction(): Promise<AdminSession> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  const role = (session.user as { role?: unknown }).role;
  if (!isAdminRole(role)) {
    throw new Error("FORBIDDEN");
  }
  return session as AdminSession;
}

/**
 * ADMIN-only guard for destructive or high-privilege operations
 * (e.g. deleting services/partners). EDITOR is rejected.
 */
export async function requireFullAdmin(): Promise<AdminSession> {
  const session = await requireAdminAction();
  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
