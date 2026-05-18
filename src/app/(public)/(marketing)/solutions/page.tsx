import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailList } from "@/components/sections/ServiceDetailList";
import { CTASection } from "@/components/sections/CTASection";
import { IT_SOLUTION_CATEGORIES } from "@/lib/services";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "IT Solutions",
  description:
    "Custom software development, managed IT support, and enterprise network infrastructure — engineered for the way your business actually runs.",
};

export const revalidate = 60;

export default async function SolutionsPage() {
  const t = await getTranslations("solutions");
  const services = await prisma.service.findMany({
    where: { isActive: true, category: { in: IT_SOLUTION_CATEGORIES } },
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
        secondaryCta={{ href: "/cloud", label: t("ctaBtn2") }}
      />
    </>
  );
}
