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
];

type AdminSidebarProps = {
  user: { name?: string | null; email?: string | null; role: string };
  newSubmissions: number;
  companyName?: string;
};

export function AdminSidebar({
  user,
  newSubmissions,
  companyName = "ADEO Solution",
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
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-[#0066ff] text-white shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              {item.icon}
            </svg>
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  active ? "bg-white text-[#0066ff]" : "bg-[#0066ff] text-white"
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
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-5">
        <Link
          href="/admin"
          className="inline-flex"
          onClick={() => setMobileOpen(false)}
        >
          <Logo invert companyName={companyName} />
        </Link>
        <p className="mt-1 pl-12 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3385ff]">
          Admin Portal
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3">{NavList}</div>

      {/* User card */}
      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0066ff]/20 text-sm font-semibold text-[#3385ff]">
            {(user.name ?? user.email ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <span className="rounded-full bg-[#0066ff]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3385ff]">
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
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/admin">
          <Logo invert companyName={companyName} />
        </Link>
        <button
          type="button"
          aria-label="Toggle admin menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#0a1628] text-white shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/5 lg:bg-[#0a1628] lg:text-white">
        {SidebarContent}
      </aside>
    </>
  );
}
