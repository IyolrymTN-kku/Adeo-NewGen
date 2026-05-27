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

// ใช้ตัวแปรเดียวกับ CTASection — Hero และ Values จะเปลี่ยนสีตาม palette
const ctaBg         = "var(--site-cta-bg, var(--admin-primary, #0a1628))";
const ctaFg         = "var(--site-cta-text, #ffffff)";
const ctaAccent = "color-mix(in srgb, var(--site-cta-accent, var(--admin-accent, #3385ff)) 80%, black)";
const ctaMuted      = "color-mix(in srgb, var(--site-cta-text, #ffffff) 65%, transparent)";
const ctaBorder     = "color-mix(in srgb, var(--site-cta-text, #ffffff) 12%, transparent)";
const ctaCard       = "color-mix(in srgb, var(--site-cta-text, #ffffff) 6%, transparent)";

const sectionBg     = "var(--site-section-bg, #ffffff)";
const sectionFg     = "var(--site-section-text, #0f172a)";
const sectionMuted  = "color-mix(in srgb, var(--site-section-text, #0f172a) 55%, transparent)";
const sectionBorder = "color-mix(in srgb, var(--site-section-text, #0f172a) 12%, transparent)";
const cardBg        = "var(--site-card-bg, #ffffff)";
const cardAltBg     = "var(--site-card-alt-bg, #f8fafc)";

export function AboutClient({ companyName }: { companyName: string }) {
  const t = useTranslations("about");

  return (
    <main style={{ backgroundColor: sectionBg, color: sectionFg }} className="overflow-hidden">

      {/* HERO */}
      <section
        className="relative overflow-hidden py-28"
        style={{ backgroundColor: ctaBg, color: ctaFg }}
      >
        <div
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: `color-mix(in srgb, ${ctaAccent} 30%, transparent)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: `color-mix(in srgb, ${ctaAccent} 18%, transparent)` }}
        />
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
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: ctaAccent }}
          >
            {t("heroEyebrow")} {companyName}
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 text-6xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
            style={{ color: ctaFg }}
          >
            {t("heroTitle1")}
            <span className="block" style={{ color: ctaAccent }}>
              {t("heroTitle2")}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed"
            style={{ color: ctaMuted }}
          >
            {t("heroDesc")}
          </motion.p>
        </Container>
      </section>

      {/* STORY */}
      <section className="py-28" style={{ backgroundColor: sectionBg }}>
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
            <div className="mt-7 space-y-5 text-[15px] leading-relaxed" style={{ color: sectionMuted }}>
              <p>{t("storyP1")}</p>
              <p>{t("storyP2")}</p>
              <p>{t("storyP3")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="absolute -inset-5 rounded-[32px] blur-2xl"
              style={{ background: `linear-gradient(to right, color-mix(in srgb, ${ctaAccent} 10%, transparent), color-mix(in srgb, ${ctaAccent} 10%, transparent))` }}
            />
            <div
              className="relative rounded-[28px] p-8 shadow-xl"
              style={{ backgroundColor: cardBg, border: `1px solid ${sectionBorder}` }}
            >
              {[
                { title: t("feat1Title"), desc: t("feat1Desc") },
                { title: t("feat2Title"), desc: t("feat2Desc") },
                { title: t("feat3Title"), desc: t("feat3Desc") },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group mb-4 rounded-2xl p-5 transition"
                  style={{ backgroundColor: cardAltBg, border: `1px solid ${sectionBorder}` }}
                >
                  <h3
                    className="font-semibold transition"
                    style={{ color: sectionFg }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: sectionMuted }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* MISSION */}
      <section
        className="border-y py-28"
        style={{ backgroundColor: cardAltBg, borderColor: sectionBorder }}
      >
        <Container>
          <SectionHeader
            eyebrow={t("missionEyebrow")}
            title={t("missionTitle")}
            subtitle={t("missionSubtitle")}
          />
          <div className="mt-14 grid lg:grid-cols-2 gap-7">
            {[
              { title: t("missionCard"), desc: t("missionDesc") },
              { title: t("visionCard"), desc: t("visionDesc") },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="rounded-[28px] p-9 shadow-sm transition"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${sectionBorder}`,
                }}
              >
                <div
                  className="mb-5 inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                 style={{
                  backgroundColor: "color-mix(in srgb, var(--site-button-bg) 12%, transparent)",
                  color: "color-mix(in srgb, var(--site-button-bg) 80%, black)",
                }}

                >
                  {item.title}
                </div>
                <p
                className="leading-relaxed"
                style={{ color: "var(--site-button-text, #0f172a)" }}
              >
                {item.desc}
              </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <section
        className="relative overflow-hidden py-28"
        style={{ backgroundColor: ctaBg, color: ctaFg }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
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
            {[t("val1"), t("val2"), t("val3"), t("val4")].map((value, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -6, scale: 1.04 }}
                className="rounded-[28px] p-7 text-center backdrop-blur transition"
                style={{
                  backgroundColor: ctaCard,
                  border: `1px solid ${ctaBorder}`,
                  color: ctaFg,
                }}
              >
               <p
                className="text-lg font-semibold tracking-tight"
                style={{ color: "color-mix(in srgb, var(--site-cta-text, #ffffff) 100%, black 0%)" }}
              >
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
        primaryCta={{ href: "/contact", label: t("ctaBtn1") }}
        secondaryCta={{ href: "/solutions", label: t("ctaBtn2") }}
      />
    </main>
  );
}