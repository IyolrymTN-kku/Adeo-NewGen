import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctaSectionStyle } from "@/lib/palette-helper";
import { getTranslations } from "next-intl/server";
import { HeroAnimated } from "./HeroAnimated";

type HeroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export async function Hero({
  eyebrow = "Enterprise IT & Cloud",
  title,
  highlight,
  description,
  primaryCta = { href: "/contact", label: "Talk to an Expert" },
  secondaryCta = { href: "/solutions", label: "Explore Solutions" },
}: HeroProps) {
  const t = await getTranslations("home");

  const serviceCards = [
    { label: t("serviceSoftwareDev"), icon: "code" },
    { label: t("serviceCloudNative"), icon: "cloud" },
    { label: t("serviceNetwork"), icon: "network" },
    { label: t("serviceBackupDr"), icon: "shield" },
    { label: t("serviceMigration"), icon: "swap" },
    { label: t("serviceItSupport"), icon: "support" },
  ];

  return (
    <section className="relative overflow-hidden" style={ctaSectionStyle()}>
      <div aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, var(--admin-primary, #0066FF) 0%, transparent 65%)" }} />
      <div aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, var(--admin-primary, #0066FF) 0%, transparent 65%)" }} />
      <div aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

      <Container className="relative">
        <HeroAnimated
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          serviceCards={serviceCards}
          enterpriseGrade={t("enterpriseGrade")}
        />
      </Container>
    </section>
  );
}