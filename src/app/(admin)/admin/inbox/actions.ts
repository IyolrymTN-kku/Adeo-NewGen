"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  requireAdminAction,
  requireFullAdmin,
} from "@/lib/auth/require-admin";
import {
  deleteSubmissionSchema,
  updateStatusSchema,
} from "@/lib/validations/inbox";

export async function updateSubmissionStatusAction(
  formData: FormData
): Promise<void> {
  await requireAdminAction();

  const parsed = updateStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  const updated = await prisma.contactSubmission.updateMany({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });
  if (updated.count === 0) return;

  revalidatePath("/admin/inbox");
  revalidatePath(`/admin/inbox/${parsed.data.id}`);
  revalidatePath("/admin");
}

export async function deleteSubmissionAction(formData: FormData): Promise<void> {
  // Destructive — ADMIN only
  await requireFullAdmin();

  const parsed = deleteSubmissionSchema.safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) return;

  await prisma.contactSubmission.deleteMany({ where: { id: parsed.data.id } });

  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
  redirect("/admin/inbox");
}
