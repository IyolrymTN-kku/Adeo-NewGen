import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailList } from "@/components/sections/ServiceDetailList";
import { CTASection } from "@/components/sections/CTASection";
import { IT_SOLUTION_CATEGORIES } from "@/lib/services";

export const metadata: Metadata = {
  title: "IT Solutions",
  description:
    "Custom software development, managed IT support, and enterprise network infrastructure — engineered for the way your business actually runs.",
};

export const revalidate = 60;

export default async function SolutionsPage() {
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
        eyebrow="IT Solutions"
        title="Enterprise IT engineered to perform under load."
        description="Custom software, managed IT operations, and high-availability network infrastructure — delivered by a senior team with two decades of enterprise experience."
      />

      <section className="py-20">
        <Container>
          <ServiceDetailList services={services} />
        </Container>
      </section>

      <CTASection
        title="Need something specific?"
        description="Every IT environment is different. Tell us what you're trying to achieve and we'll scope a solution that fits."
        primaryCta={{ href: "/contact", label: "Request a Consultation" }}
        secondaryCta={{ href: "/cloud", label: "View Cloud Services" }}
      />
    </>
  );
}
