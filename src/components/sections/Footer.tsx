import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/sections/Logo";
import { footerStyle, mix, palette } from "@/lib/palette-helper";

const FOOTER_NAV = {
  Solutions: [
    { href: "/solutions", label: "IT Solutions" },
    { href: "/cloud", label: "Cloud Services" },
  ],
  Company: [
    { href: "/", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/sitemap", label: "Site Map" },
  ],
  Legal: [
    { href: "/", label: "Privacy" },
    { href: "/", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto" style={footerStyle()}>
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo invert className="text-current" />

            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Enterprise IT Solutions and Cloud Services — secure, scalable,
              and built for the future of your business.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span
                  className="font-semibold"
                  style={{ color: palette.footer.text }}
                >
                  Email:
                </span>{" "}
                <a
                  href="mailto:contact@adeo.co.th"
                  className="transition hover:opacity-80"
                >
                  contact@adeo.co.th
                </a>
              </p>

              <p>
                <span
                  className="font-semibold"
                  style={{ color: palette.footer.text }}
                >
                  Phone:
                </span>{" "}
                +66 (0) 2 000 0000
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(FOOTER_NAV).map(([heading, links]) => (
              <div key={heading}>
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: palette.footer.text }}
                >
                  {heading}
                </h3>

                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition hover:opacity-80"
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

        <div
          className="flex flex-col items-start justify-between gap-3 border-t py-6 text-xs sm:flex-row sm:items-center"
          style={{
            borderColor: mix(palette.footer.text, 14),
          }}
        >
          <p>
            © {new Date().getFullYear()} ADEO Solution. All rights reserved.
          </p>

          <p>Bangkok, Thailand</p>
        </div>
      </Container>
    </footer>
  );
}