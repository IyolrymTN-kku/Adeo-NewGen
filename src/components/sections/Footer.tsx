import { prisma } from "@/lib/db";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/sections/Logo";


const FOOTER_NAV = {
  Solutions: [
    { href: "/solutions", label: "IT Solutions" },
    { href: "/cloud",     label: "Cloud Services" },
  ],
  Company: [
    { href: "/",        label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/", label: "Privacy" },
    { href: "/", label: "Terms" },
  ],
};

export async function Footer() {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });

  return (
    <footer className="mt-auto bg-[#0a1628] text-slate-300">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Enterprise IT Solutions and Cloud Services — secure, scalable,
              and built for the future of your business.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              {settings?.email && (
                <p>
                  <span className="font-semibold text-slate-200">Email:</span>{" "}
                  <a href={`mailto:${settings.email}`} className="hover:text-[#3385ff]">{settings.email}</a>
                </p>
              )}
              {settings?.phone && (
                <p>
                  <span className="font-semibold text-slate-200">Phone:</span>{" "}
                  {settings.phone}
                </p>
              )}
              {settings?.address && (
                <p>
                  <span className="font-semibold text-slate-200">Address:</span>{" "}
                  {settings.address}
                </p>
              )}
            </div>

            {/* Social Media */}
            {(settings?.facebook || settings?.linkedin || settings?.instagram) && (
              <div className="mt-6 flex gap-4">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#3385ff] transition" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#3385ff] transition" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#3385ff] transition" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </a>
                )}
              </div>
            )}
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
          <p>© {new Date().getFullYear()} {settings?.companyName ?? "ADEO Solution"}. All rights reserved.</p>
          <p>Bangkok, Thailand</p>
        </div>
      </Container>
    </footer>
  );
}