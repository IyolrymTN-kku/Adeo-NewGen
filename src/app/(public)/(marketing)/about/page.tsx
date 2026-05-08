// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/sections/CTASection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white py-28">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#0066ff]/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#3385ff]/20 blur-3xl animate-pulse" />

        <Container className="relative text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-xs uppercase tracking-[0.25em] text-[#3385ff]"
          >
            About ADEO Solution
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight"
          >
            Built for modern enterprise systems
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed"
          >
            We design secure, scalable IT infrastructure and cloud systems that
            help organizations move faster with confidence.
          </motion.p>
        </Container>
      </section>

      {/* ───────── STORY ───────── */}
      <section className="py-24">
        <Container className="grid lg:grid-cols-2 gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              align="left"
              eyebrow="Our story"
              title="From infrastructure to innovation"
              subtitle="We started with real-world IT systems — now we build cloud-native architectures for enterprise-scale organizations."
            />

            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                What began as infrastructure engineering evolved into full-scale
                digital transformation services.
              </p>
              <p>
                Today, we focus on reliability, scalability, and systems that
                actually survive production environments.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-8"
          >
            {[
              "Enterprise-grade architecture",
              "Cloud-native systems",
              "Security-first engineering",
            ].map((item, i) => (
              <motion.div
                key={item}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mb-4 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ───────── MISSION / VISION ───────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <Container>
          <SectionHeader
            eyebrow="Direction"
            title="Mission & Vision"
            subtitle="What drives every system we build."
          />

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            {[
              {
                title: "Mission",
                desc: "Deliver scalable and secure IT solutions that remove technical limitations from businesses.",
              },
              {
                title: "Vision",
                desc: "Become a trusted long-term partner for cloud-first and digital-first enterprises.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white border border-slate-200 p-8 hover:border-[#0066ff]/40 transition"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── VALUES ───────── */}
      <section className="py-24 bg-[#0a1628] text-white">
        <Container>
          <SectionHeader
            eyebrow="Principles"
            title="What we value"
            subtitle="The mindset behind every decision."
            invert
          />

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Reliability", "Security-first", "Clarity", "Scalability"].map(
              (v, i) => (
                <motion.div
                  key={v}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
                >
                  {v}
                </motion.div>
              )
            )}
          </div>
        </Container>
      </section>

      {/* ───────── CTA ───────── */}
      <CTASection
        eyebrow="Let’s build together"
        title="Need a trusted IT partner?"
        description="We design systems that are stable, scalable, and ready for real production use."
        primaryCta={{ href: "/contact", label: "Contact Us" }}
        secondaryCta={{ href: "/solutions", label: "See Solutions" }}
      />
    </main>
  );
}