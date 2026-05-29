import { getTranslations } from "next-intl/server";
import { StatsBarClient } from "./StatsBarClient";

export async function StatsBar() {
  const t = await getTranslations("home");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return <StatsBarClient stats={stats} />;
}