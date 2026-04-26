"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  requireAdminAction,
  requireFullAdmin,
} from "@/lib/auth/require-admin";
import { partnerSchema } from "@/lib/validations/partner";
import {
  saveUploadedImage,
  isUploadedFile,
  deleteUploadedImage,
  UploadError,
} from "@/lib/upload";

import type { PartnerFormState } from "./form-state";

function readForm(formData: FormData) {
  return {
    name: (formData.get("name") ?? "").toString(),
    websiteUrl: (formData.get("websiteUrl") ?? "").toString(),
    category: (formData.get("category") ?? "").toString(),
    isActive: formData.get("isActive") === "on",
    sortOrder: (formData.get("sortOrder") ?? "0").toString(),
  };
}

function flatten<TKeys extends string>(
  errors: Record<string, string[] | undefined>
): Partial<Record<TKeys, string[]>> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(errors)) {
    if (v && v.length > 0) out[k] = v;
  }
  return out as Partial<Record<TKeys, string[]>>;
}

export async function createPartnerAction(
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  await requireAdminAction();

  const parsed = partnerSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flatten(parsed.error.flatten().fieldErrors),
    };
  }

  // Logo is required on create
  const logoValue = formData.get("logo");
  if (!isUploadedFile(logoValue)) {
    return {
      status: "error",
      message: "Logo is required.",
      fieldErrors: { logo: ["Please upload a logo image."] },
    };
  }

  let logoUrl: string;
  try {
    logoUrl = await saveUploadedImage(logoValue);
  } catch (err) {
    const message =
      err instanceof UploadError
        ? err.message
        : "Could not upload logo. Try again.";
    return {
      status: "error",
      message,
      fieldErrors: { logo: [message] },
    };
  }

  try {
    await prisma.partner.create({
      data: {
        name: parsed.data.name,
        websiteUrl: parsed.data.websiteUrl ?? null,
        category: parsed.data.category,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        logoUrl,
      },
    });
  } catch (err) {
    await deleteUploadedImage(logoUrl);
    console.error("[partners.create]", err);
    return {
      status: "error",
      message: "Could not save the partner. Please try again.",
    };
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function updatePartnerAction(
  id: string,
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  await requireAdminAction();

  if (!id) return { status: "error", message: "Missing partner id." };

  const parsed = partnerSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flatten(parsed.error.flatten().fieldErrors),
    };
  }

  const existing = await prisma.partner.findUnique({
    where: { id },
    select: { logoUrl: true },
  });
  if (!existing) {
    return { status: "error", message: "Partner not found." };
  }

  let newLogoUrl: string | undefined;
  const logoValue = formData.get("logo");
  if (isUploadedFile(logoValue)) {
    try {
      newLogoUrl = await saveUploadedImage(logoValue);
    } catch (err) {
      const message =
        err instanceof UploadError
          ? err.message
          : "Could not upload logo. Try again.";
      return {
        status: "error",
        message,
        fieldErrors: { logo: [message] },
      };
    }
  }

  try {
    await prisma.partner.update({
      where: { id },
      data: {
        name: parsed.data.name,
        websiteUrl: parsed.data.websiteUrl ?? null,
        category: parsed.data.category,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        ...(newLogoUrl ? { logoUrl: newLogoUrl } : {}),
      },
    });
  } catch (err) {
    if (newLogoUrl) await deleteUploadedImage(newLogoUrl);
    console.error("[partners.update]", err);
    return {
      status: "error",
      message: "Could not save the partner. Please try again.",
    };
  }

  if (newLogoUrl && existing.logoUrl !== newLogoUrl) {
    await deleteUploadedImage(existing.logoUrl);
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function togglePartnerActiveAction(
  formData: FormData
): Promise<void> {
  await requireAdminAction();
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;

  const current = await prisma.partner.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;

  await prisma.partner.update({
    where: { id },
    data: { isActive: !current.isActive },
  });

  revalidatePath("/admin/partners");
  revalidatePath("/");
}

export async function deletePartnerAction(formData: FormData): Promise<void> {
  await requireFullAdmin();
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;

  const partner = await prisma.partner.findUnique({
    where: { id },
    select: { logoUrl: true },
  });
  if (!partner) return;

  await prisma.partner.delete({ where: { id } });
  await deleteUploadedImage(partner.logoUrl);

  revalidatePath("/admin/partners");
  revalidatePath("/");
}
