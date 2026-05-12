import { Container } from "@/components/ui/Container";
import { StaggerContainer, StaggerItem } from "@/components/animations";
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
    <section className="border-y border-slate-200 bg-slate-50">
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
              <dt className="text-3xl font-bold tracking-tight text-[#0a1628] sm:text-4xl">
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
