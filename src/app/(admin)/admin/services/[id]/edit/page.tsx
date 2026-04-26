import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { ServiceForm } from "../../ServiceForm";
import { updateServiceAction } from "../../actions";
import { parseFeatures } from "@/lib/services";

export const metadata: Metadata = { title: "Edit Service" };

type Params = Promise<{ id: string }>;

export default async function EditServicePage({ params }: { params: Params }) {
  const { id } = await params;
  await requireAdminPage(`/admin/services/${id}/edit`);

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  // Bind the service id to the update action so the form can call it directly.
  const action = updateServiceAction.bind(null, id);

  return (
    <>
      <PageHeader
        title={`Edit · ${service.title}`}
        description="Update copy, features, visibility, or icon."
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/services", label: "Services" },
          { href: `/admin/services/${id}/edit`, label: "Edit" },
        ]}
      />
      <PageBody>
        <ServiceForm
          action={action}
          submitLabel="Save Changes"
          pendingLabel="Saving…"
          defaults={{
            id: service.id,
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription,
            description: service.description,
            category: service.category,
            features: parseFeatures(service.features),
            isActive: service.isActive,
            sortOrder: service.sortOrder,
            icon: service.icon,
          }}
        />
      </PageBody>
    </>
  );
}
