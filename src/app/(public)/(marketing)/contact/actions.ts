"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { consumeContactAttempt } from "@/lib/security/rate-limit";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<
    "name" | "email" | "company" | "phone" | "message",
    string[]
  >>;
};

export const initialContactState: ContactState = {
  status: "idle",
  message: null,
};

export async function submitContactAction(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // ── Rate limit per IP (3/hour) ─────────────────────────────────────────
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "127.0.0.1";

  const rate = await consumeContactAttempt(ip);
  if (!rate.success) {
    const minutes = Math.ceil(rate.retryAfterSeconds / 60);
    return {
      status: "error",
      message: `Too many submissions. Please try again in ${minutes} minute(s).`,
    };
  }

  // ── Zod validation (incl. honeypot) ────────────────────────────────────
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    // Honeypot tripped — show generic error, don't tell the bot why.
    if (flat.website && flat.website.length > 0) {
      return {
        status: "error",
        message: "We couldn't process your submission. Please try again.",
      };
    }
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors: {
        name: flat.name,
        email: flat.email,
        company: flat.company,
        phone: flat.phone,
        message: flat.message,
      },
    };
  }

  // ── Persist via Prisma (parameterised, OWASP A03) ──────────────────────
  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        phone: parsed.data.phone ?? null,
        message: parsed.data.message,
      },
    });
  } catch (err) {
    console.error("[contact] DB write failed:", err);
    return {
      status: "error",
      message:
        "Something went wrong on our side. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks for reaching out — our team will be in touch within one business day.",
  };
}
