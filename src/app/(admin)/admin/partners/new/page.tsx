import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { PartnerForm } from "../PartnerForm";
import { createPartnerAction } from "../actions";

export const metadata: Metadata = { title: "New Partner" };

export default async function NewPartnerPage() {
  await requireAdminPage("/admin/partners/new");

  return (
    <>
      <PageHeader
        title="New partner"
        description="Add a technology or service partner."
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/partners", label: "Partners" },
          { href: "/admin/partners/new", label: "New" },
        ]}
      />
      <PageBody>
        <PartnerForm
          action={createPartnerAction}
          submitLabel="Create Partner"
          pendingLabel="Creating…"
          isCreate
        />
      </PageBody>
    </>
  );
}
