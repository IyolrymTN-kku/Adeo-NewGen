import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { ServiceForm } from "../ServiceForm";
import { createServiceAction } from "../actions";

export const metadata: Metadata = { title: "New Service" };

export default async function NewServicePage() {
  await requireAdminPage("/admin/services/new");

  return (
    <>
      <PageHeader
        title="New service"
        description="Add a new IT or Cloud service offering."
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/services", label: "Services" },
          { href: "/admin/services/new", label: "New" },
        ]}
      />
      <PageBody>
        <ServiceForm
          action={createServiceAction}
          submitLabel="Create Service"
          pendingLabel="Creating…"
        />
      </PageBody>
    </>
  );
}
