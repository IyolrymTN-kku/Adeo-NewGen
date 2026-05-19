"use server";

import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";

export async function updateSiteSettings(formData: FormData) {
  await requireAdminPage("/admin/settings");

  const siteName = (formData.get("siteName") as string)?.trim();

  if (!siteName) return ;

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { siteName },
    create: {
      id: "singleton",
      siteName,
    },
  });

}