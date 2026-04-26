import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { PartnerForm } from "../../PartnerForm";
import { updatePartnerAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Partner" };

type Params = Promise<{ id: string }>;

export default async function EditPartnerPage({ params }: { params: Params }) {
  const { id } = await params;
  await requireAdminPage(`/admin/partners/${id}/edit`);

  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  const action = updatePartnerAction.bind(null, id);

  return (
    <>
      <PageHeader
        title={`Edit · ${partner.name}`}
        description="Update partner details, logo, or visibility."
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/partners", label: "Partners" },
          { href: `/admin/partners/${id}/edit`, label: "Edit" },
        ]}
      />
      <PageBody>
        <PartnerForm
          action={action}
          submitLabel="Save Changes"
          pendingLabel="Saving…"
          defaults={{
            name: partner.name,
            websiteUrl: partner.websiteUrl,
            category: partner.category,
            isActive: partner.isActive,
            sortOrder: partner.sortOrder,
            logoUrl: partner.logoUrl,
          }}
        />
      </PageBody>
    </>
  );
}
