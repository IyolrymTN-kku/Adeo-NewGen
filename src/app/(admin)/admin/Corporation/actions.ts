"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { saveUploadedImage } from "@/lib/upload";
import { z } from "zod";

const schema = z.object({
  companyName:     z.string().min(1, "กรุณากรอกชื่อบริษัท").max(100),
  descriptionEn:   z.string().max(500).optional().or(z.literal("")),
  descriptionTh:   z.string().max(500).optional().or(z.literal("")),
  email:           z.string().email("อีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  phone:           z.string().max(30).optional().or(z.literal("")),
  address:         z.string().max(200).optional().or(z.literal("")),
  website:         z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  facebook:        z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  linkedin:        z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  instagram:       z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  tiktok:          z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  line:            z.string().max(50).optional().or(z.literal("")),
  taxId:           z.string().max(20).optional().or(z.literal("")),
});

export async function updateCorporation(formData: FormData) {
  await requireAdminAction();

  const raw = {
    companyName:     formData.get("companyName"),
    descriptionEn:   formData.get("descriptionEn"),
    descriptionTh:   formData.get("descriptionTh"),
    email:           formData.get("email"),
    phone:           formData.get("phone"),
    address:         formData.get("address"),
    website:         formData.get("website"),
    facebook:        formData.get("facebook"),
    linkedin:        formData.get("linkedin"),
    instagram:       formData.get("instagram"),
    tiktok:          formData.get("tiktok"),
    line:            formData.get("line"),
    taxId:           formData.get("taxId"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const logoFile    = formData.get("logo")    as File | null;
  const faviconFile = formData.get("favicon") as File | null;

  let logoUrl:    string | undefined;
  let faviconUrl: string | undefined;

if (logoFile && logoFile.size > 0) {
  if (!["image/png", "image/svg+xml"].includes(logoFile.type)) {
    return { error: "โลโก้รองรับเฉพาะ SVG และ PNG เท่านั้น" };
  }
  const maxSize = logoFile.type === "image/svg+xml" ? 50 * 1024 : 200 * 1024;
  if (logoFile.size > maxSize) {
    return { error: logoFile.type === "image/svg+xml" ? "SVG ต้องไม่เกิน 50KB" : "PNG ต้องไม่เกิน 200KB" };
  }
  logoUrl = await saveUploadedImage(logoFile);
}

if (faviconFile && faviconFile.size > 0) {
  if (!["image/png", "image/svg+xml"].includes(faviconFile.type)) {
    return { error: "Favicon รองรับเฉพาะ SVG และ PNG เท่านั้น" };
  }
  const maxSize = faviconFile.type === "image/svg+xml" ? 50 * 1024 : 100 * 1024;
  if (faviconFile.size > maxSize) {
    return { error: faviconFile.type === "image/svg+xml" ? "SVG ต้องไม่เกิน 50KB" : "PNG ต้องไม่เกิน 100KB" };
  }
  faviconUrl = await saveUploadedImage(faviconFile);
}

  const data = {
    companyName:     parsed.data.companyName,
    descriptionEn:   parsed.data.descriptionEn || null,
    descriptionTh:   parsed.data.descriptionTh || null,
    email:           parsed.data.email ? parsed.data.email.trim().toLowerCase() : null,
    phone:           parsed.data.phone           || null,
    address:         parsed.data.address         || null,
    website:         parsed.data.website         || null,
    facebook:        parsed.data.facebook        || null,
    linkedin:        parsed.data.linkedin        || null,
    instagram:       parsed.data.instagram       || null,
    tiktok:          parsed.data.tiktok          || null,
    line:            parsed.data.line            || null,
    taxId:           parsed.data.taxId           || null,
    ...(logoUrl    && { logoUrl }),
    ...(faviconUrl && { faviconUrl }),
  };

  await prisma.companySettings.upsert({
    where:  { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/admin/corporation");
  revalidatePath("/");
  revalidatePath("/solutions");
  revalidatePath("/cloud");
  revalidatePath("/contact");
  return { success: true };
}