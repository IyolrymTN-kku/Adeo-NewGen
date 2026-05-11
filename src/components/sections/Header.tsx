"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/sections/Logo_on label";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "IT Solutions" },
  { href: "/cloud", label: "Cloud Services" },
  { href: "/contact", label: "Contact" },
];

const HEADER_RESET_KEY = "adeo-site-header-reset-white";

// Header เปลี่ยนสีได้จาก palette
const paletteHeaderBg = "var(--site-header-bg, #FFFFFF)";
const paletteHeaderText = "var(--site-header-text, #0F172A)";

const headerActive =
  "var(--site-header-active-nav, var(--admin-accent, #2563EB))";
const headerCtaBg =
  "var(--site-header-cta-bg, var(--admin-primary, #2563EB))";
const headerCtaText = "var(--site-header-cta-text, #FFFFFF)";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [forceWhiteHeader, setForceWhiteHeader] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function syncHeaderResetState() {
      setForceWhiteHeader(
        localStorage.getItem(HEADER_RESET_KEY) === "true"
      );
    }

    syncHeaderResetState();

    window.addEventListener("storage", syncHeaderResetState);
    window.addEventListener("ADEO_HEADER_RESET_WHITE", syncHeaderResetState);
    window.addEventListener("ADEO_ADMIN_THEME_CHANGED", syncHeaderResetState);

    return () => {
      window.removeEventListener("storage", syncHeaderResetState);
      window.removeEventListener(
        "ADEO_HEADER_RESET_WHITE",
        syncHeaderResetState
      );
      window.removeEventListener(
        "ADEO_ADMIN_THEME_CHANGED",
        syncHeaderResetState
      );
    };
  }, []);

  const headerBg = forceWhiteHeader ? "#FFFFFF" : paletteHeaderBg;
  const headerText = forceWhiteHeader ? "#0F172A" : paletteHeaderText;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled ? "backdrop-blur" : ""
      )}
      style={{
        backgroundColor: scrolled
          ? `color-mix(in srgb, ${headerBg} 94%, transparent)`
          : headerBg,
        color: headerText,
        borderColor: `color-mix(in srgb, ${headerText} 14%, transparent)`,
      }}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo href="/" className="text-current" />

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-semibold transition hover:opacity-100",
                    active ? "opacity-100" : "opacity-75"
                  )}
                  style={{
                    color: headerText,
                  }}
                >
                  {link.label}

                  {active && (
                    <span
                      className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full"
                      style={{
                        backgroundColor: headerActive,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-bold shadow-sm transition hover:opacity-90"
              style={{
                backgroundColor: headerCtaBg,
                color: headerCtaText,
              }}
            >
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition lg:hidden"
            style={{
              color: headerText,
              backgroundColor: open
                ? `color-mix(in srgb, ${headerText} 10%, transparent)`
                : "transparent",
            }}
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
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div
            className="py-4 lg:hidden"
            style={{
              borderTop: `1px solid color-mix(in srgb, ${headerText} 14%, transparent)`,
            }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-base font-semibold transition"
                    style={{
                      color: headerText,
                      backgroundColor: active
                        ? `color-mix(in srgb, ${headerActive} 16%, transparent)`
                        : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-3 px-1">
                <Link
                  href="/contact"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-bold shadow-sm transition hover:opacity-90"
                  style={{
                    backgroundColor: headerCtaBg,
                    color: headerCtaText,
                  }}
                >
                  Get a Quote
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}