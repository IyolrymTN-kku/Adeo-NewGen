import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "./ContactForm";
import { generateSEOMetadata } from "@/lib/seo/generate";

export const metadata = generateSEOMetadata("/contact");

const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "contact@adeo.co.th",
    href: "mailto:contact@adeo.co.th",
    icon: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4 8 5 8-5" />
    ),
  },
  {
    label: "Phone",
    value: "+66 (0) 2 000 0000",
    href: "tel:+6620000000",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  {
    label: "Office",
    value: "Bangkok, Thailand",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    label: "Hours",
    value: "Mon–Fri, 09:00–18:00 ICT",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Let's talk about what you're building."
        description="Whether you're scoping a new project, evaluating cloud options, or need an experienced IT partner — drop us a note and our team will get back to you within one business day."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fields marked with <span className="text-red-500">*</span>{" "}
                  are required.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Details */}
            <aside className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0a1628] p-8 text-white">
                <h2 className="text-lg font-semibold">Get in touch directly</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Prefer email or phone? Here's how to reach us.
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
                    For sales enquiries please include your project scope and
                    timeline. For existing clients, our 24/7 support hotline is
                    on your service portal.
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
