import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "./ContactForm";
import { generateSEOMetadata } from "@/lib/seo/generate";
import { getTranslations } from "next-intl/server";

export const metadata = generateSEOMetadata("/contact");

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const CONTACT_DETAILS = [
    {
      label: t("email"),
      value: "contact@adeo.co.th",
      href: "mailto:contact@adeo.co.th",
      icon: (
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4 8 5 8-5" />
      ),
    },
    {
      label: t("phone"),
      value: "+66 (0) 2 000 0000",
      href: "tel:+6620000000",
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      ),
    },
    {
      label: t("office"),
      value: t("bangkok"),
      icon: (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
    {
      label: t("hours"),
      value: t("time"),
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        description={t("heroDesc")}
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">
                  {t("formTitle")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t("formSub1")} <span className="text-red-500">*</span>{" "}
                  {t("formSub2")}
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Details */}
            <aside className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0a1628] p-8 text-white">
                <h2 className="text-lg font-semibold">{t("asideTitle")}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {t("asideDesc")}
                </p>

                <ul className="mt-8 space-y-6">
                  {CONTACT_DETAILS.map((item) => (
                    <li key={item.label} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0066ff]/15 text-[#3385ff]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block text-sm text-white hover:text-[#3385ff]"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-slate-300">
                  <p>
                    {t("salesNote")}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
