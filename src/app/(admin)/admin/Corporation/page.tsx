import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { CorporationForm } from "./CorporationForm";

export const revalidate = 0;

export default async function CorporationPage() {
  await requireAdminPage("/admin/corporation");

  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <PageHeader
        title="Corporation Settings"
        description="Manage Company Name, Logo, and Organization Information"
      />
      <PageBody>
        <CorporationForm settings={settings} />
      </PageBody>
    </>
  );
}