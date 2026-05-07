import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/sections/Logo";

const FOOTER_NAV = {
  Solutions: [
    { href: "/solutions", label: "IT Solutions" },
    { href: "/cloud", label: "Cloud Services" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export function Footer({ siteName }: { siteName?: string }) {
  return (
    <footer className="mt-auto bg-[#0a1628] text-slate-300">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo invert siteName={siteName} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Enterprise IT Solutions and Cloud Services — secure, scalable,
              and built for the future of your business.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <p>
                <span className="font-semibold text-slate-200">Email:</span>{" "}
                <a
                  href="mailto:contact@adeo.co.th"
                  className="hover:text-[#3385ff]"
                >
                  contact@adeo.co.th
                </a>
              </p>
              <p>
                <span className="font-semibold text-slate-200">Phone:</span>{" "}
                +66 (0) 2 000 0000
              </p>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(FOOTER_NAV).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  {heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-[#3385ff]"
                      >
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
          <p>© {new Date().getFullYear()} {siteName ?? "ADEO Solution"}. All rights reserved.</p>
          <p>Bangkok, Thailand</p>
        </div>
      </Container>
    </footer>
  );
}
