import Image from "next/image";
import type { Partner, PartnerCategory } from "@prisma/client";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { useTranslations } from "next-intl";

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  NETWORK: "Network",
  CLOUD: "Cloud",
  SECURITY: "Security",
  HARDWARE: "Hardware",
};

const CATEGORY_ORDER: PartnerCategory[] = [
  "CLOUD",
  "NETWORK",
  "SECURITY",
  "HARDWARE",
];

type PartnerGridProps = {
  partners: Pick<
    Partner,
    "id" | "name" | "logoUrl" | "websiteUrl" | "category"
  >[];
};

export function PartnerGrid({ partners }: PartnerGridProps) {
  const t = useTranslations("home");
  const grouped = new Map<
    PartnerCategory,
    typeof partners
  >();
  for (const p of partners) {
    const list = grouped.get(p.category) ?? [];
    list.push(p);
    grouped.set(p.category, list);
  }

  if (partners.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500">
        No partners listed.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {CATEGORY_ORDER.filter((c) => grouped.has(c)).map((category) => {
        const list = grouped.get(category)!;
        return (
          <div key={category}>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {category === "NETWORK" ? t("partnerCatNETWORK") :
                 category === "CLOUD" ? t("partnerCatCLOUD") :
                 category === "SECURITY" ? t("partnerCatSECURITY") :
                 category === "HARDWARE" ? t("partnerCatHARDWARE") : 
                 CATEGORY_LABELS[category]}
              </h3>
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">
                {t("partnerCount", { count: list.length })}
              </span>
            </div>
            <StaggerContainer
              as="ul"
              staggerChildren={0.05}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {list.map((partner) => (
                <StaggerItem key={partner.id} as="li" y={16}>
                  <PartnerLogo partner={partner} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        );
      })}
    </div>
  );
}

function PartnerLogo({
  partner,
}: {
  partner: Pick<Partner, "name" | "logoUrl" | "websiteUrl">;
}) {
  const tile = (
    <div className="group flex h-24 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 transition hover:border-primary/40 hover:shadow-sm">
      {partner.logoUrl && partner.logoUrl !== "/uploads/placeholder-logo.svg" ? (
        <Image
          src={partner.logoUrl}
          alt={partner.name}
          width={120}
          height={48}
          className="max-h-12 w-auto object-contain opacity-80 transition group-hover:opacity-100"
        />
      ) : (
        <span className="text-center text-sm font-semibold text-slate-700 transition group-hover:text-primary">
          {partner.name}
        </span>
      )}
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} website`}
        className="block"
      >
        {tile}
      </a>
    );
  }

  return tile;
}
