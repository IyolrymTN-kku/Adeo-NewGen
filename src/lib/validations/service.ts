import { z } from "zod";

export const SERVICE_CATEGORIES = [
  "SOFTWARE_DEV",
  "IT_SUPPORT",
  "NETWORK",
  "CLOUD_NATIVE",
  "MIGRATION",
  "CONNECTIVITY",
  "BACKUP_DR",
] as const;

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug must be at most 80 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may contain only lowercase letters, numbers, and single hyphens"
  );

export const serviceSchema = z.object({
  title: z.string().min(2).max(120).trim(),
  slug: slugSchema,
  shortDescription: z.string().min(10).max(240).trim(),
  description: z.string().min(20).max(5000).trim(),
  category: z.enum(SERVICE_CATEGORIES),
  features: z
    .array(z.string().min(1).max(160))
    .max(20, "Maximum 20 features")
    .default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

/**
 * Convert a one-feature-per-line textarea value into a clean string array.
 * Trims, drops blanks, and caps at 20 entries (also enforced by the schema).
 */
export function parseFeaturesText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
