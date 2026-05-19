"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/sections/Logo";
import { LogoutButton } from "./LogoutButton";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchExact?: boolean;
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    matchExact: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: (
      <>
        <path d="M12 3v18M3 12h18" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </>
    ),
  },
  {
    href: "/admin/partners",
    label: "Partners",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <circle cx="17" cy="11" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),
  },
  {
    href: "/admin/inbox",
    label: "Inbox",
    icon: (
      <>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
  },
<<<<<<< HEAD
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.2a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-.4-1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.2a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6c.26-.3.4-.68.4-1V3.4a2 2 0 1 1 4 0v.2c0 .38.14.74.4 1 .26.3.64.48 1 .6.64.18 1.34-.02 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.3.48-.5 1.18-.33 1.82.12.36.3.74.6 1 .26.26.62.4 1 .4h.2a2 2 0 1 1 0 4h-.2c-.38 0-.74.14-1 .4-.3.26-.48.64-.6 1z" />
      </>
    ),
  },
  {
    href: "/admin/changepalettes",
    label: "Change Palette",
    icon: (
      <>
        <path d="M12 22a10 10 0 1 1 10-10 3.5 3.5 0 0 1-3.5 3.5h-1.1a1.4 1.4 0 0 0-1.12 2.24l.22.3A2.5 2.5 0 0 1 14.5 22H12Z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="10.5" cy="7.5" r="1" />
        <circle cx="14.5" cy="7.5" r="1" />
        <circle cx="16.5" cy="11" r="1" />
      </>
    ),
  },
=======
    {
      href: "/admin/Corporation",
      label: "Corporation",
      icon: (
        <>
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <path d="M9 21v-4h6v4" />
          <rect x="9" y="10" width="2" height="2" />
          <rect x="13" y="10" width="2" height="2" />
        </>
      ),
    },
    {
      href: "/admin/seo-media",
      label: "SEO Media",
      icon: (
        <>
          <path d="M4 4h16v16H4z" />
          <path d="M4 9h16" />
          <path d="M9 13h6" />
        </>
      ),
    },
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
];

type AdminSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
  newSubmissions: number;
<<<<<<< HEAD
  siteName?: string;
=======
  companyName?: string;
  logoUrl?: string | null;
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
};

export function AdminSidebar({
  user,
  newSubmissions,
<<<<<<< HEAD
  siteName,
=======
  companyName = "ADEO Solution",
  logoUrl,
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.matchExact ? pathname === item.href : pathname.startsWith(item.href);

  const NavList = (
    <nav className="space-y-1" aria-label="Admin">
      {NAV.map((item) => {
        const active = isActive(item);
        const showBadge = item.href === "/admin/inbox" && newSubmissions > 0;

        const className = cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
          active
            ? "[background:var(--admin-gradient)] text-[var(--admin-gradient-foreground)] shadow-lg shadow-black/20"
            : "text-[var(--admin-sidebar-foreground)] opacity-80 hover:bg-white/10 hover:opacity-100"
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={className}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.85}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              {item.icon}
            </svg>

            <span className="flex-1 text-left">{item.label}</span>

            {showBadge && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  active
                    ? "bg-white/25 text-current"
                    : "bg-[var(--admin-primary)] text-[var(--admin-primary-foreground)]"
                )}
              >
                {newSubmissions > 99 ? "99+" : newSubmissions}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarContent = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-5 pb-6 pt-5">
        <Logo
          invert
          href="/admin"
<<<<<<< HEAD
          siteName={siteName}
          className="inline-flex text-[var(--admin-sidebar-foreground)]"
        />

        <p className="mt-1 pl-12 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-sidebar-foreground)] opacity-90">
=======
          className="inline-flex"
          onClick={() => setMobileOpen(false)}
        >
          <Logo invert companyName={companyName} logoUrl={logoUrl} />
        </Link>
        <p className="mt-1 pl-12 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3385ff]">
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
          Admin Portal
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3">{NavList}</div>

      <div className="m-3 shrink-0 rounded-xl border border-[color-mix(in_srgb,var(--admin-sidebar-foreground)_18%,transparent)] bg-[color-mix(in_srgb,var(--admin-sidebar-foreground)_10%,transparent)] p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--admin-sidebar-foreground)_14%,transparent)] text-sm font-semibold text-[var(--admin-sidebar-foreground)]">
            {(user.name ?? user.email ?? "A").charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--admin-sidebar-foreground)]">
              {user.name ?? "Admin"}
            </p>

            <p className="truncate text-xs text-[var(--admin-sidebar-foreground)] opacity-70">
              {user.email}
            </p>
          </div>

          <span className="rounded-full bg-[color-mix(in_srgb,var(--admin-sidebar-foreground)_14%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-sidebar-foreground)]">
            {user.role}
          </span>
        </div>

        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
<<<<<<< HEAD
        <Logo href="/admin" siteName={siteName} />

=======
        <Link href="/admin">
          <Logo invert companyName={companyName} logoUrl={logoUrl} />
        </Link>
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
        <button
          type="button"
          aria-label="Toggle admin menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />

          <aside className="absolute inset-y-0 left-0 w-72 [background:var(--admin-gradient-dark)] text-[var(--admin-sidebar-foreground)] shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex lg:h-dvh lg:w-64 lg:flex-col lg:overflow-hidden lg:border-r lg:border-white/10 [background:var(--admin-gradient-dark)] text-[var(--admin-sidebar-foreground)]">
        {SidebarContent}
      </aside>
    </>
  );
}