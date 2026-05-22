import type { Service } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { categoryLabel, parseFeatures } from "@/lib/services";
import { mix, palette } from "@/lib/palette-helper";
import { getTranslations } from "next-intl/server";

type ServiceDetailListProps = {
  services: Pick<
    Service,
    "id" | "title" | "shortDescription" | "description" | "category" | "features" | "slug"
  >[];
};

export async function ServiceDetailList({ services }: ServiceDetailListProps) {
  const t = await getTranslations("services");
  const c = await getTranslations("categories");

  if (services.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500">
        No services in this category yet.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {services.map((service) => {
        const features = parseFeatures(service.features);

        const title = t.has(`${service.slug}.title`)
          ? t(`${service.slug}.title`)
          : service.title;
        const desc = t.has(`${service.slug}.description`)
          ? t(`${service.slug}.description`)
          : service.description;
        const catLabel = c.has(service.category)
          ? c(service.category)
          : categoryLabel(service.category);
        const whatsIncluded = t.has("whatsIncluded")
          ? t("whatsIncluded")
          : "What's included";

        const mappedFeatures = features.map((feat, idx) =>
          t.has(`${service.slug}.features_${idx}`)
            ? t(`${service.slug}.features_${idx}`)
            : feat
        );

        return (
          <Card key={service.id} className="p-8 sm:p-10">
            <div id={service.slug} className="scroll-mt-28">
              <div className="lg:col-span-5">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                  backgroundColor: mix(palette.section.accent, 15),
                  color: `color-mix(in srgb, ${palette.section.accent} 80%, black)`,
                }}
                >
                  {catLabel}
                </span>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {desc}
                </p>
              </div>

              <div className="lg:col-span-7 mt-8">
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: `color-mix(in srgb, ${palette.section.accent} 80%, black)` }}>
                  {whatsIncluded}
                </h4>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {mappedFeatures.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: `color-mix(in srgb, ${palette.section.accent} 80%, black)` }}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.085l6.79-6.795a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
