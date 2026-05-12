import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailList } from "@/components/sections/ServiceDetailList";
import { CTASection } from "@/components/sections/CTASection";
import { CLOUD_SERVICE_CATEGORIES } from "@/lib/services";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "Cloud-native development, structured cloud migration, hybrid connectivity, and disaster recovery — across AWS, Azure, and Google Cloud.",
};

export const revalidate = 60;

export default async function CloudPage() {
  const t = await getTranslations("cloud");
  const services = await prisma.service.findMany({
    where: { isActive: true, category: { in: CLOUD_SERVICE_CATEGORIES } },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      description: true,
      category: true,
      features: true,
      slug: true,
    },
  });

  return (
    <>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        description={t("heroDesc")}
      />

      <section className="py-20">
        <Container>
          <ServiceDetailList services={services} />
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
