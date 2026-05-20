import { Container } from "@/components/ui/Container";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { mix, palette } from "@/lib/palette-helper";

const STATS = [
  { value: "15+", label: "Years of expertise" },
  { value: "200+", label: "Enterprise projects delivered" },
  { value: "99.9%", label: "Uptime across managed services" },
  { value: "24/7", label: "Support and monitoring" },
];
import { useTranslations } from "next-intl";

export function StatsBar() {
  const t = useTranslations("home");

  const STATS = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section
      className="border-y"
      style={{
        borderColor: mix(palette.section.accent, 16, "#e2e8f0"),
        backgroundColor: mix(palette.section.accent, 6, "white"),
      }}
    >
      <Container>
        <StaggerContainer
          as="dl"
          staggerChildren={0.12}
          className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <StaggerItem
              key={stat.label}
              y={16}
              className="text-center lg:text-left"
            >
              <dt
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{
                  color: palette.section.accent,
                }}
              >
                {stat.value}
              </dt>

              <dd className="mt-1 text-sm text-slate-600">{stat.label}</dd>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}