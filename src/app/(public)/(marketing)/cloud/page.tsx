import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailList } from "@/components/sections/ServiceDetailList";
import { CTASection } from "@/components/sections/CTASection";
import { CLOUD_SERVICE_CATEGORIES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "Cloud-native development, structured cloud migration, hybrid connectivity, and disaster recovery — across AWS, Azure, and Google Cloud.",
};

export const revalidate = 60;

export default async function CloudPage() {
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
        eyebrow="Cloud Services"
        title="Cloud done right — secure, optimised, and built to scale."
        description="From cloud-native architecture to risk-managed migration and 24/7 disaster recovery. We bring engineering rigor to every cloud workload — across AWS, Azure, and GCP."
      />

      <section className="py-20">
        <Container>
          <ServiceDetailList services={services} />
        </Container>
      </section>

      <CTASection
        title="Plan your cloud journey with confidence."
        description="Whether it's a full migration or a single workload modernisation, we'll help you scope it right the first time."
        primaryCta={{ href: "/contact", label: "Book a Cloud Assessment" }}
        secondaryCta={{ href: "/solutions", label: "View IT Solutions" }}
      />
    </>
  );
}
