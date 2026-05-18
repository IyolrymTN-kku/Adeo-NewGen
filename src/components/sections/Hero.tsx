import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FadeInOnLoad } from "@/components/animations";
import { useTranslations } from "next-intl";

type HeroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function Hero({
  eyebrow = "Enterprise IT & Cloud",
  title,
  highlight,
  description,
  primaryCta = { href: "/contact", label: "Talk to an Expert" },
  secondaryCta = { href: "/solutions", label: "Explore Solutions" },
}: HeroProps) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-[#0a1628] text-white">
      {/* Decorative gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #0066ff 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #0066ff 0%, transparent 65%)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-16 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <FadeInOnLoad y={8} delay={0.05}>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#3385ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0066ff]" />
                {eyebrow}
              </p>
            </FadeInOnLoad>
            <FadeInOnLoad as="h1" y={16} delay={0.15} duration={0.7} className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-[#3385ff]">{highlight}</span>
                </>
              )}
            </FadeInOnLoad>
            <FadeInOnLoad as="p" y={16} delay={0.3} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              {description}
            </FadeInOnLoad>
            <FadeInOnLoad y={16} delay={0.45} className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={primaryCta.href} size="lg">
                {primaryCta.label}
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </ButtonLink>
              <ButtonLink
                href={secondaryCta.href}
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent hover:border-white hover:bg-white/5 hover:text-white"
              >
                {secondaryCta.label}
              </ButtonLink>
            </FadeInOnLoad>
          </div>

          {/* Visual panel */}
          <FadeInOnLoad
            y={24}
            delay={0.4}
            duration={0.8}
            className="hidden lg:col-span-5 lg:block"
          >
            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t("serviceSoftwareDev"), icon: "code" },
                    { label: t("serviceCloudNative"), icon: "cloud" },
                    { label: t("serviceNetwork"), icon: "network" },
                    { label: t("serviceBackupDr"), icon: "shield" },
                    { label: t("serviceMigration"), icon: "swap" },
                    { label: t("serviceItSupport"), icon: "support" },
                  ].map((item) => (
                    <div
                      key={item.icon}
                      className="rounded-xl border border-white/10 bg-[#0d2040]/60 p-4"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0066ff]/15 text-[#3385ff]">
                        <ServiceIcon name={item.icon} />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400">{t("enterpriseGrade")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -inset-x-8 -bottom-6 h-12 rounded-full bg-[#0066ff]/30 blur-2xl"
              />
            </div>
          </FadeInOnLoad>
        </div>
      </Container>
    </section>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };
  switch (name) {
    case "code":
      return (
        <svg {...common}>
          <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 5 13a4 4 0 0 0 .5 8h12Z" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
      );
    case "swap":
      return (
        <svg {...common}>
          <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
}
