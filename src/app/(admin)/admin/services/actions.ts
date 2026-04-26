"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  requireAdminAction,
  requireFullAdmin,
} from "@/lib/auth/require-admin";
import {
  parseFeaturesText,
  serviceSchema,
  slugify,
  slugSchema,
} from "@/lib/validations/service";
import { saveUploadedImage, isUploadedFile, deleteUploadedImage, UploadError } from "@/lib/upload";

import type { ServiceFormState } from "./form-state";

function readForm(formData: FormData) {
  const titleRaw = (formData.get("title") ?? "").toString();
  const slugRaw = (formData.get("slug") ?? "").toString().trim();
  return {
    title: titleRaw.trim(),
    slug: slugRaw === "" ? slugify(titleRaw) : slugRaw,
    shortDescription: (formData.get("shortDescription") ?? "").toString(),
    description: (formData.get("description") ?? "").toString(),
    category: (formData.get("category") ?? "").toString(),
    features: parseFeaturesText((formData.get("features") ?? "").toString()),
    isActive: formData.get("isActive") === "on",
    sortOrder: (formData.get("sortOrder") ?? "0").toString(),
  };
}

function flattenError<TKeys extends string>(
  errors: Record<string, string[] | undefined>
): Partial<Record<TKeys, string[]>> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(errors)) {
    if (v && v.length > 0) out[k] = v;
  }
  return out as Partial<Record<TKeys, string[]>>;
}

export async function createServiceAction(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdminAction();

  const parsed = serviceSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenError(parsed.error.flatten().fieldErrors),
    };
  }

  // Optional icon upload
  let iconUrl: string | null = null;
  const iconValue = formData.get("icon");
  if (isUploadedFile(iconValue)) {
    try {
      iconUrl = await saveUploadedImage(iconValue);
    } catch (err) {
      const message =
        err instanceof UploadError
          ? err.message
          : "Could not upload icon. Try again.";
      return {
        status: "error",
        message,
        fieldErrors: { icon: [message] },
      };
    }
  }

  try {
    await prisma.service.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        category: parsed.data.category,
        features: parsed.data.features,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        icon: iconUrl,
      },
    });
  } catch (err) {
    if (iconUrl) await deleteUploadedImage(iconUrl);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        status: "error",
        message: "A service with this slug already exists.",
        fieldErrors: { slug: ["Slug must be unique"] },
      };
    }
    console.error("[services.create]", err);
    return {
      status: "error",
      message: "Could not save the service. Please try again.",
    };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/solutions");
  revalidatePath("/cloud");
  redirect("/admin/services");
}

export async function updateServiceAction(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdminAction();

  if (!id || typeof id !== "string") {
    return { status: "error", message: "Missing service id." };
  }

  const parsed = serviceSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenError(parsed.error.flatten().fieldErrors),
    };
  }

  const existing = await prisma.service.findUnique({
    where: { id },
    select: { icon: true },
  });
  if (!existing) {
    return { status: "error", message: "Service not found." };
  }

  // Optional icon replacement
  let iconUrl: string | null | undefined = undefined; // undefined = leave alone
  const iconValue = formData.get("icon");
  if (isUploadedFile(iconValue)) {
    try {
      iconUrl = await saveUploadedImage(iconValue);
    } catch (err) {
      const message =
        err instanceof UploadError
          ? err.message
          : "Could not upload icon. Try again.";
      return {
        status: "error",
        message,
        fieldErrors: { icon: [message] },
      };
    }
  } else if (formData.get("removeIcon") === "on") {
    iconUrl = null;
  }

  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        category: parsed.data.category,
        features: parsed.data.features,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        ...(iconUrl !== undefined ? { icon: iconUrl } : {}),
      },
    });
  } catch (err) {
    if (typeof iconUrl === "string") await deleteUploadedImage(iconUrl);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        status: "error",
        message: "A service with this slug already exists.",
        fieldErrors: { slug: ["Slug must be unique"] },
      };
    }
    console.error("[services.update]", err);
    return {
      status: "error",
      message: "Could not save the service. Please try again.",
    };
  }

  // Clean up the previous icon only after a successful DB write.
  if (iconUrl !== undefined && existing.icon && existing.icon !== iconUrl) {
    await deleteUploadedImage(existing.icon);
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/solutions");
  revalidatePath("/cloud");
  redirect("/admin/services");
}

export async function toggleServiceActiveAction(
  formData: FormData
): Promise<void> {
  await requireAdminAction();
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;

  const current = await prisma.service.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;

  await prisma.service.update({
    where: { id },
    data: { isActive: !current.isActive },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/solutions");
  revalidatePath("/cloud");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  // Destructive — ADMIN only.
  await requireFullAdmin();
  const idRaw = (formData.get("id") ?? "").toString();
  const id = slugSchema.safeParse(idRaw).success
    ? idRaw // benign; use the cuid directly below
    : idRaw;
  if (!id) return;

  const svc = await prisma.service.findUnique({
    where: { id },
    select: { icon: true },
  });
  if (!svc) return;

  await prisma.service.delete({ where: { id } });
  await deleteUploadedImage(svc.icon);

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/solutions");
  revalidatePath("/cloud");
}
