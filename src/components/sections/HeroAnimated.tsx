"use client";

import Link from "next/link";

type ServiceCard = { label: string; icon: string };

type HeroAnimatedProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  serviceCards: ServiceCard[];
  enterpriseGrade: string;
};

export function HeroAnimated({
  eyebrow, title, highlight, description,
  primaryCta, secondaryCta, serviceCards, enterpriseGrade,
}: HeroAnimatedProps) {
  return (
    <div className="grid items-center gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-32">
      <div className="lg:col-span-7">

        <p className="hero-fade-1 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{
            borderColor: "color-mix(in srgb, var(--cta-text, #FFFFFF) 10%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--cta-text, #FFFFFF) 5%, transparent)",
            color: "color-mix(in srgb, var(--admin-primary, #0066FF) 80%, black)",
          }}>
          <span className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--admin-primary, #0066FF) 80%, black)" }} />
          {eyebrow}
        </p>

        <h1 className="hero-fade-2 text-2xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "var(--cta-text, #FFFFFF)" }}>
          {title}
          {highlight && (
            <> <span style={{ color: "var(--admin-primary, #0066FF)" }}>{highlight}</span></>
          )}
        </h1>

        <p className="hero-fade-3 mt-4 max-w-xl text-base leading-relaxed lg:text-lg"
          style={{ color: "color-mix(in srgb, var(--cta-text, #FFFFFF) 76%, transparent)" }}>
          {description}
        </p>

        <div className="hero-fade-4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link href={primaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: "var(--admin-primary, #0066FF)", color: "var(--admin-primary-text, #FFFFFF)" }}>
            {primaryCta.label}
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href={secondaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold transition hover:opacity-90 sm:w-auto"
            style={{
              borderColor: "color-mix(in srgb, var(--cta-text, #FFFFFF) 20%, transparent)",
              backgroundColor: "transparent",
              color: "var(--cta-text, #FFFFFF)",
            }}>
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="hero-fade-5 relative">
          <div className="rounded-2xl p-6 backdrop-blur"
            style={{
              border: "1px solid color-mix(in srgb, var(--cta-text, #FFFFFF) 10%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--cta-text, #FFFFFF) 3%, transparent)",
            }}>
            <div className="grid grid-cols-2 gap-3">
              {serviceCards.map((item) => (
                <div key={item.icon} className="rounded-xl p-4"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--site-button-bg) 20%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--site-button-bg) 30%, transparent)",
                  }}>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--site-button-bg) 25%, transparent)",
                      color: "color-mix(in srgb, var(--site-button-bg) 80%, black)",
                    }}>
                    <ServiceIcon name={item.icon} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--site-button-text)" }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "color-mix(in srgb, var(--site-button-text) 60%, transparent)" }}>{enterpriseGrade}</p>
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="absolute -inset-x-8 -bottom-6 h-12 rounded-full blur-2xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--admin-primary, #0066FF) 30%, transparent)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    className: "h-5 w-5", "aria-hidden": true,
  };
  switch (name) {
    case "code":    return <svg {...common}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>;
    case "cloud":   return <svg {...common}><path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 5 13a4 4 0 0 0 .5 8h12Z" /></svg>;
    case "network": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "shield":  return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>;
    case "swap":    return <svg {...common}><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" /></svg>;
    case "support": return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    default: return null;
  }
}