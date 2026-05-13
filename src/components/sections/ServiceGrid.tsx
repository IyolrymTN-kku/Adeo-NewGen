import type { Service, ServiceCategory } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { categoryLabel, isCloudCategory } from "@/lib/services";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { getTranslations } from "next-intl/server";

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  SOFTWARE_DEV: (
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
  ),
  IT_SUPPORT: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  NETWORK: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  CLOUD_NATIVE: (
    <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 5 13a4 4 0 0 0 .5 8h12Z" />
  ),
  MIGRATION: (
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  ),
  CONNECTIVITY: (
    <path d="M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.94 0M12 20h.01" />
  ),
  BACKUP_DR: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  ),
};

type ServiceGridProps = {
  services: Pick<
    Service,
    "id" | "title" | "slug" | "shortDescription" | "category"
  >[];
  columns?: 2 | 3;
};

export async function ServiceGrid({ services, columns = 3 }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500">
        No services available.
      </p>
    );
  }

  return (
    <StaggerContainer
      className={
        columns === 2
          ? "grid gap-6 sm:grid-cols-2"
          : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {services.map((service) => (
        <StaggerItem key={service.id} className="h-full">
          <ServiceCard service={service} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

async function ServiceCard({
  service,
}: {
  service: Pick<
    Service,
    "id" | "title" | "slug" | "shortDescription" | "category"
  >;
}) {
  const cloud = isCloudCategory(service.category);
  const t = await getTranslations("services");
  const c = await getTranslations("categories");

  const title = t.has(`${service.slug}.title`) ? t(`${service.slug}.title`) : service.title;
  const shortDesc = t.has(`${service.slug}.shortDescription`) ? t(`${service.slug}.shortDescription`) : service.shortDescription;
  const catLabel = c.has(service.category) ? c(service.category) : categoryLabel(service.category);

  return (
    <Card hover className="flex h-full flex-col">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0066ff]">
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
            {CATEGORY_ICONS[service.category]}
          </svg>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          {cloud ? "Cloud" : "IT"} · {catLabel}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {shortDesc}
      </p>
    </Card>
  );
}
