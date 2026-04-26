import type { Service, ServiceCategory } from "@prisma/client";

export const IT_SOLUTION_CATEGORIES: ServiceCategory[] = [
  "SOFTWARE_DEV",
  "IT_SUPPORT",
  "NETWORK",
];

export const CLOUD_SERVICE_CATEGORIES: ServiceCategory[] = [
  "CLOUD_NATIVE",
  "MIGRATION",
  "CONNECTIVITY",
  "BACKUP_DR",
];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  SOFTWARE_DEV: "Software Development",
  IT_SUPPORT: "IT Support",
  NETWORK: "Network",
  CLOUD_NATIVE: "Cloud Native",
  MIGRATION: "Cloud Migration",
  CONNECTIVITY: "Connectivity",
  BACKUP_DR: "Backup & DR",
};

export function categoryLabel(category: ServiceCategory): string {
  return CATEGORY_LABELS[category];
}

export function isCloudCategory(category: ServiceCategory): boolean {
  return CLOUD_SERVICE_CATEGORIES.includes(category);
}

/**
 * Service.features is stored as a Prisma Json field. The seed currently passes
 * a JSON-encoded string, while the admin CRUD will pass arrays directly — this
 * normalizes both shapes into a string[] for rendering.
 */
export function parseFeatures(value: Service["features"]): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === "string");
      }
    } catch {
      // fall through
    }
  }
  return [];
}
