import { z } from "zod";

export const CONTACT_STATUSES = ["NEW", "READ", "REPLIED"] as const;

export const cuidSchema = z.string().min(20).max(40);

export const updateStatusSchema = z.object({
  id: cuidSchema,
  status: z.enum(CONTACT_STATUSES),
});

export const deleteSubmissionSchema = z.object({
  id: cuidSchema,
});
