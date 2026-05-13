import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { CTASection } from "@/components/sections/CTASection";
import { getTranslations } from "next-intl/server";

export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
  });
  const [services, partners] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        category: true,
      },
    }),
    prisma.partner.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        category: true,
      },
    }),
  ]);

  return (
    <>
      <Hero
        eyebrow={t("heroEyebrow")}
        title={`${t("heroTitle1")}${settings?.companyName ?? t("heroTitle2")}`}
        highlight={t("heroHighlight")}
        description={t("heroDescription")}
        primaryCta={{ href: "/contact", label: t("heroBtn1") }}
        secondaryCta={{ href: "/solutions", label: t("heroBtn2") }}
      />

      <StatsBar />

      {/* Services overview */}
      <section className="py-24">
        <Container>
          <SectionHeader
            eyebrow={t("servicesEyebrow")}
            title={t("servicesTitle")}
            subtitle={t("servicesSubtitle")}
          />
          <div className="mt-14">
            <ServiceGrid services={services} />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/solutions" variant="outline">
              {t("btnIT")}
            </ButtonLink>
            <ButtonLink href="/cloud" variant="outline">
              {t("btnCloud")}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <Container>
          <SectionHeader
            eyebrow={t("partnersEyebrow")}
            title={t("partnersTitle")}
            subtitle={t("partnersSubtitle")}
          />
          <div className="mt-14">
            <PartnerGrid partners={partners} />
          </div>
        </Container>
      </section>

      <CTASection
        title={t("ctaTitle")}
        description={t("ctaDesc")}
        primaryCta={{ href: "/contact", label: t("ctaBtn1") }}
        secondaryCta={{ href: "/solutions", label: t("ctaBtn2") }}
      />
    </>
  );
}
