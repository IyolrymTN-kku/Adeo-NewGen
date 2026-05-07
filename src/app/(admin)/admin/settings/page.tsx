import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { updateSiteSettings } from "./actions";

export default async function SettingsPage() {
  await requireAdminPage("/admin/settings");

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage global site configuration"
      />

      <PageBody>
        <form action={updateSiteSettings} className="max-w-md space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Company name
            </label>

            <input
              name="siteName"
              defaultValue={settings?.siteName ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Enter company name..."
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0066ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc]"
          >
            Save
          </button>
        </form>
      </PageBody>
    </>
  );
}