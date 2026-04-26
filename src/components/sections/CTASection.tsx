import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

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
    <section className="relative overflow-hidden bg-[#0a1628] py-20 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, #0066ff 0%, transparent 55%)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#3385ff]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            {secondaryCta && (
              <ButtonLink
                href={secondaryCta.href}
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent hover:border-white hover:bg-white/5 hover:text-white"
              >
                {secondaryCta.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
