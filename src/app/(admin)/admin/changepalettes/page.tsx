import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { ThemeSettingsPage } from "@/components/theme-settings";

export const metadata: Metadata = {
  title: "Change Palettes",
};

export const dynamic = "force-dynamic";

export default async function ChangePalettesPage() {
  await requireAdminPage("/admin/changepalettes");

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <ThemeSettingsPage />
    </div>
  );
}