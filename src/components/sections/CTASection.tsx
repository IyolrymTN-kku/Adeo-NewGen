import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctaSectionStyle, mix, palette } from "@/lib/palette-helper";

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function CTASection({
  eyebrow = "Get started",
  title,
  description,
  primaryCta = { href: "/contact", label: "Talk to an Expert" },
  secondaryCta,
}: CTASectionProps) {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={ctaSectionStyle()}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, var(--admin-primary, #0066FF) 0%, transparent 55%)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: palette.admin.primary }}
          >
            {eyebrow}
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>

          <p
            className="mt-4 text-base leading-relaxed sm:text-lg"
            style={{ color: mix(palette.cta.text, 76) }}
          >
            {description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition hover:opacity-90"
              style={{
                backgroundColor: palette.admin.primary,
                color: palette.admin.primaryText,
              }}
            >
              {primaryCta.label}
            </Link>

            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold transition hover:opacity-90"
                style={{
                  borderColor: mix(palette.cta.text, 22),
                  backgroundColor: "transparent",
                  color: palette.cta.text,
                }}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}