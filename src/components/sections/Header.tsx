"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/sections/Logo";
import { LanguageSwitcher } from "@/components/sections/LanguageSwitcher";

export function Header({
  companyName = "ADEO Solution",
  logoUrl,
  locale = "en"
}: {
  companyName?: string;
  logoUrl?: string | null;
  locale?: string;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/solutions", label: t("solutions") },
    { href: "/cloud", label: t("cloud") },
    { href: "/contact", label: t("contact") },
    { href: "/about", label: t("about") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-slate-200 bg-white/90 backdrop-blur"
          : "border-transparent bg-white"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label={`${companyName} home`}>
            <Logo companyName={companyName} logoUrl={logoUrl} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition",
                  isActive(link.href)
                    ? "text-[#0066ff]"
                    : "text-slate-700 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <ButtonLink href="/contact" size="sm">
              {t("getQuote")}
            </ButtonLink>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
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

        {/* Mobile drawer */}
        {open && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-base font-medium transition",
                    isActive(link.href)
                      ? "bg-blue-50 text-[#0066ff]"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 px-1">
                <LanguageSwitcher currentLocale={locale} />
              </div>
              <div className="mt-2 px-1">
                <ButtonLink href="/contact" className="w-full">
                  {t("getQuote")}
                </ButtonLink>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}