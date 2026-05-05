import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[hsl(var(--hero-bg,222_47%_10%))] py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.75) 0%, transparent 65%)",
        }}
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
