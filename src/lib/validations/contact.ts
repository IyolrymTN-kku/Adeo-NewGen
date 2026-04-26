import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .trim()
    .toLowerCase(),
  company: z
    .string()
    .max(150, "Company must be at most 150 characters")
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .max(40, "Phone must be at most 40 characters")
    .regex(
      /^[\d+()\-.\s]*$/,
      "Phone may only contain digits, spaces, +, -, ., (, )"
    )
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5,000 characters")
    .trim(),
  // Honeypot — must be empty. Real users never fill hidden inputs.
  website: z
    .string()
    .max(0, "Spam detected")
    .optional()
    .or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
