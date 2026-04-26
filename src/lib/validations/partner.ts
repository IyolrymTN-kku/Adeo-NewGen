import { z } from "zod";

export const PARTNER_CATEGORIES = [
  "NETWORK",
  "CLOUD",
  "SECURITY",
  "HARDWARE",
] as const;

export const partnerSchema = z.object({
  name: z.string().min(2).max(120).trim(),
  websiteUrl: z
    .string()
    .url("Must be a valid URL (e.g. https://example.com)")
    .max(500)
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  category: z.enum(PARTNER_CATEGORIES),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
