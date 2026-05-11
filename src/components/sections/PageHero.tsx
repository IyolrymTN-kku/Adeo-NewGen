import { Container } from "@/components/ui/Container";
import { ctaSectionStyle, mix, palette } from "@/lib/palette-helper";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden border-b py-20 sm:py-24"
      style={{
        ...ctaSectionStyle(),
        borderColor: mix(palette.cta.text, 12),
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, var(--admin-primary, #0066FF) 0%, transparent 65%)",
        }}
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: palette.admin.primary }}
          >
            {eyebrow}
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p
            className="mt-5 text-lg leading-relaxed"
            style={{
              color: mix(palette.cta.text, 76),
            }}
          >
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}