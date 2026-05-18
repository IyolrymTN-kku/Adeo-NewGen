"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/sections/CTASection";
import { useTranslations } from "next-intl";

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

export function AboutClient({
  companyName,
}: {
  companyName: string;
}) {
  const t = useTranslations("about");

  return (
    <main className="bg-white text-slate-900 overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white py-28">

        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#0066ff]/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#3385ff]/20 blur-3xl animate-pulse" />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Container className="relative text-center">

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-xs uppercase tracking-[0.25em] text-[#3385ff]"
          >
            {t("heroEyebrow")} {companyName}
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 text-6xl sm:text-6xl font-bold leading-tight tracking-tight leading-[1.05]"
          >
            {t("heroTitle1")}
            <span className="block text-[#3385ff]">
              {t("heroTitle2")}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed"
          >
            {t("heroDesc")}
          </motion.p>

        </Container>
      </section>

      {/* STORY */}
      <section className="py-28">
        <Container className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader
              align="left"
              eyebrow={t("storyEyebrow")}
              title={t("storyTitle")}
              subtitle={t("storySubtitle")}
            />

            <div className="mt-7 space-y-5 text-slate-600 leading-relaxed text-[15px]">
              <p>
                {t("storyP1")}
              </p>

              <p>
                {t("storyP2")}
              </p>

              <p>
                {t("storyP3")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >

            <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-r from-[#0066ff]/10 to-[#3385ff]/10 blur-2xl" />

            <div className="relative rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl">

              {[
                {
                  title: t("feat1Title"),
                  desc: t("feat1Desc"),
                },
                {
                  title: t("feat2Title"),
                  desc: t("feat2Desc"),
                },
                {
                  title: t("feat3Title"),
                  desc: t("feat3Desc"),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  className="group mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-[#0066ff] transition">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}

            </div>
          </motion.div>

        </Container>
      </section>

      {/* MISSION */}
      <section className="border-y border-slate-200 bg-slate-50 py-28">
        <Container>

          <SectionHeader
            eyebrow={t("missionEyebrow")}
            title={t("missionTitle")}
            subtitle={t("missionSubtitle")}
          />

          <div className="mt-14 grid lg:grid-cols-2 gap-7">

            {[
              {
                title: t("missionCard"),
                desc: t("missionDesc"),
              },
              {
                title: t("visionCard"),
                desc: t("visionDesc"),
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.6,
                }}
                whileHover={{
                  y: -6,
                }}
                className="rounded-[28px] border border-slate-200 bg-white p-9 shadow-sm transition hover:border-[#0066ff]/40 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066ff]">
                  {item.title}
                </div>

                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>

        </Container>
      </section>

      {/* VALUES */}
      <section className="relative overflow-hidden bg-[#0a1628] py-28 text-white">

        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <Container className="relative">

          <SectionHeader
            eyebrow={t("valuesEyebrow")}
            title={t("valuesTitle")}
            subtitle={t("valuesSubtitle")}
            invert
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              t("val1"),
              t("val2"),
              t("val3"),
              t("val4"),
            ].map((value, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.45,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                }}
                className="rounded-[28px] border border-white/10 bg-white/[0.05] p-7 text-center backdrop-blur transition hover:border-[#3385ff]/40 hover:bg-white/[0.08]"
              >
                <p className="text-lg font-semibold tracking-tight">
                  {value}
                </p>
              </motion.div>
            ))}

          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
        primaryCta={{
          href: "/contact",
          label: t("ctaBtn1"),
        }}
        secondaryCta={{
          href: "/solutions",
          label: t("ctaBtn2"),
        }}
      />

    </main>
  );
}