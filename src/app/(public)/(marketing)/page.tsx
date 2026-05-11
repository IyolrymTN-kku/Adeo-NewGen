import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export default async function HomePage() {
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
        eyebrow="Enterprise IT & Cloud"
        title={`Powering ${settings?.companyName ?? "Our Company"}`}
        highlight="modern enterprises."
        description="From custom software and managed IT to cloud-native architectures, ADEO Solution delivers secure, scalable infrastructure built for the way your business actually runs."
        primaryCta={{ href: "/contact", label: "Talk to an Expert" }}
        secondaryCta={{ href: "/solutions", label: "Explore Solutions" }}
      />

      <StatsBar />

      {/* Services overview */}
      <section className="py-24">
        <Container>
          <SectionHeader
            eyebrow="What we do"
            title="Two pillars. One trusted partner."
            subtitle="We bring together the operational rigor of enterprise IT with the velocity of cloud-native engineering — so you don't have to choose."
          />
          <div className="mt-14">
            <ServiceGrid services={services} />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/solutions" variant="outline">
              IT Solutions
            </ButtonLink>
            <ButtonLink href="/cloud" variant="outline">
              Cloud Services
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <Container>
          <SectionHeader
            eyebrow="Trusted technology partners"
            title="Built on enterprise-grade platforms"
            subtitle="We architect with the technologies your IT, security, and compliance teams already trust."
          />
          <div className="mt-14">
            <PartnerGrid partners={partners} />
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready to modernise your IT?"
        description="Let's scope a roadmap that meets your timelines, your budget, and your compliance reality. No fluff — just a working plan."
        primaryCta={{ href: "/contact", label: "Start a Conversation" }}
        secondaryCta={{ href: "/solutions", label: "See Our Capabilities" }}
      />
    </>
  );
}
