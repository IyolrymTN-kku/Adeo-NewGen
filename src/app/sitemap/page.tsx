import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSitemapData } from "@/lib/sitemap/get-sitemap-data";
import { auth } from "@/auth";
import { Footer } from "@/components/sections/Footer";
import { CardLink } from "./CardLink";


export default async function SitemapPage() {
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
    select: { companyName: true },
  });

  const companyName = settings?.companyName ?? "ADEO Solution";
  const { services, cloudServices } = await getSitemapData();
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(var(--background))" }}>

      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "var(--site-cta-bg, #0a1628)",
          color: "var(--site-cta-text, #ffffff)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--site-button-bg)" }}
          >
            Structure
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            {companyName}
            <span style={{ color: "var(--site-button-bg)" }}> Sitemap</span>
          </h1>

          <p
            className="mx-auto mt-4 max-w-xl text-sm"
            style={{ color: "color-mix(in srgb, var(--site-cta-text, #ffffff) 70%, transparent)" }}
          >
            Explore the full navigation structure of our platform — including
            public pages, services, and system areas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <Section title="Public Pages">
            <CardLink href="/" title="Home" desc="Landing page overview" />
            <CardLink href="/solutions" title="IT Solutions" desc="All IT services" />
            <CardLink href="/cloud" title="Cloud Services" desc="Cloud offerings" />
            <CardLink href="/contact" title="Contact" desc="Get in touch" />
          </Section>

          <Section title="IT Solutions">
            {services.map((s) => (
              <CardLink key={s.slug} href={`/solutions#${s.slug}`} title={s.title} desc="Service detail page" />
            ))}
          </Section>

          <Section title="Cloud Services">
            {cloudServices.map((s) => (
              <CardLink key={s.slug} href={`/cloud#${s.slug}`} title={s.title} desc="Cloud service" />
            ))}
          </Section>

          <Section title="System">
            {!isLoggedIn ? (
              <CardLink href="/login" title="Login" desc="Admin access" />
            ) : (
              <>
                <CardLink href="/admin" title="Dashboard" desc="Admin dashboard" />
                <CardLink href="/admin/services" title="Manage Services" desc="CRUD services" />
                <CardLink href="/admin/partners" title="Manage Partners" desc="Partner list" />
                <CardLink href="/admin/inbox" title="Inbox" desc="Contact submissions" />
                <CardLink href="/admin/Corporation" title="Corporation" desc="Corporation Settings" />
              </>
            )}
          </Section>

          <Section title="Company">
            <CardLink href="/about" title="About" desc="Company overview" />
            <CardLink href="/contact" title="Contact" desc="Get in touch" />
          </Section>

          <Section title="Legal">
            <CardLink href="/privacy" title="Privacy Policy" desc="Data protection & privacy" />
            <CardLink href="/terms" title="Terms of Service" desc="Terms and conditions" />
          </Section>

        </div>
      </section>

      <div className="mt-16" />
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-6 shadow-sm"
      style={{
        backgroundColor: "color-mix(in srgb, var(--site-button-bg) 10%, white)",
        border: "1px solid color-mix(in srgb, var(--site-button-bg) 25%, transparent)",
      }}
    >
      <h2
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "color-mix(in srgb, var(--site-button-bg) 80%, black)" }}
      >
        {title}
      </h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}
