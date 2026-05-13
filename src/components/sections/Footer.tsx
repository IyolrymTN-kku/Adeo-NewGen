import { prisma } from "@/lib/db";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/sections/Logo";
import { getTranslations, getLocale } from "next-intl/server";

export async function Footer({ companyName = "ADEO Solution" }: { companyName?: string }) {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const t = await getTranslations("footer");
  const locale = await getLocale();

  const description = locale === "th"
    ? (settings?.descriptionTh ?? settings?.descriptionEn ?? "")
    : (settings?.descriptionEn ?? settings?.descriptionTh ?? "");

  const FOOTER_NAV = {
    [t("solutions")]: [
      { href: "/solutions", label: t("itSolutions") },
      { href: "/cloud",     label: t("cloudServices") },
      { href: "/sitemap",     label: t("sitemap") },
    ],
    [t("company")]: [
      { href: "/about", label: t("about") },
      { href: "/contact", label: t("contact") },
    ],
    [t("legal")]: [
      { href: "/privacy", label: t("privacy") },
      { href: "/terms", label: t("terms") },
    ],
  };

  return (
    <footer className="mt-auto bg-[#0a1628] text-slate-300">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo invert companyName={settings?.companyName ?? companyName} logoUrl={settings?.logoUrl} />
           <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              {description || t("desc")}
          </p>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2">
              {/* คอลัมน์ซ้าย — ข้อมูลบริษัท */}
              <div className="space-y-2 text-sm text-slate-400">
                {settings?.taxId && (
                  <p><span className="font-semibold text-slate-200">{t("taxId")}</span> {settings.taxId}</p>
                )}
                {settings?.email && (
                  <p><span className="font-semibold text-slate-200">{t("email")}</span>{" "}
                    <a href={`mailto:${settings.email}`} className="hover:text-[#3385ff]">{settings.email}</a>
                  </p>
                )}
                {settings?.phone && (
                  <p><span className="font-semibold text-slate-200">{t("phone")}</span> {settings.phone}</p>
                )}
                {settings?.address && (
                  <p><span className="font-semibold text-slate-200">{t("address")}</span> {settings.address}</p>
                )}
                {settings?.website && (
                  <p><span className="font-semibold text-slate-200">{t("website")}</span>{" "}
                    <a href={settings.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#3385ff]">{settings.website.replace(/^https?:\/\//, "")}</a></p>
                )}
              </div>

              {/* คอลัมน์ขวา — โซเชียลมีเดีย */}
              {(settings?.facebook || settings?.linkedin || settings?.instagram || settings?.tiktok || settings?.line) && (
                <div className="space-y-2 text-sm text-slate-400">
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#3385ff] transition">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span>{settings.facebook.replace(/.*facebook\.com\//, "")}</span>
                    </a>
                  )}
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#3385ff] transition min-w-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span className="truncate">{settings.linkedin.replace(/.*linkedin\.com\/(company\/|in\/)?/, "").replace(/\/$/, "")}</span>
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#3385ff] transition">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                      </svg>
                      <span>{settings.instagram.replace(/.*instagram\.com\//, "")}</span>
                    </a>
                  )}
                  {settings.tiktok && (
                    <a href={settings.tiktok} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#3385ff] transition">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                      </svg>
                      <span>{settings.tiktok.replace(/.*tiktok\.com\/@?/, "")}</span>
                    </a>
                  )}
                  {settings.line && (
                    <a href={`https://line.me/R/ti/p/${settings.line}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#3385ff] transition">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                        <path d="M12 2C6.48 2 2 6.02 2 11c0 3.53 2.16 6.6 5.37 8.37-.19.7-.7 2.54-.8 2.94-.13.5.18.49.38.36.16-.1 2.5-1.65 3.51-2.32.5.07 1.01.11 1.54.11 5.52 0 10-4.02 10-9S17.52 2 12 2zm5.12 11.76H13.4a.37.37 0 0 1-.37-.37V9.12a.37.37 0 0 1 .74 0v3.9h3.35a.37.37 0 0 1 0 .74zm-8.28.37a.37.37 0 0 1-.74 0V9.12a.37.37 0 0 1 .74 0v4.63zm-1.96 0a.37.37 0 0 1-.74 0V9.12a.37.37 0 0 1 .37-.37c.1 0 .2.04.27.12l2.66 3.54V9.12a.37.37 0 0 1 .74 0v4.63a.37.37 0 0 1-.37.37c-.1 0-.2-.04-.27-.12L8.51 10.4v3.36z"/>
                      </svg>
                      <span>{settings.line}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(FOOTER_NAV).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{heading}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 transition hover:text-[#3385ff]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {settings?.companyName ?? companyName}. {t("rights")}</p>
          <p>{t("location")}</p>
        </div>
      </Container>
    </footer>
  );
}