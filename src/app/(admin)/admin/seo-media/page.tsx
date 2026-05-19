import { prisma } from "@/lib/db";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { SeoMediaForm } from "./seo-media-form";

export default async function SeoMediaPage() {
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
  });

  return (
    <>
      <PageHeader
        title="SEO & Brand Control"
        description="Manage Google search preview and social sharing image."
      />

      <PageBody className="max-w-7xl">
        <SeoMediaForm
          initialData={{
            companyName: settings?.companyName ?? "",
            description: settings?.description ?? "",
            ogImage: settings?.ogImageUrl ?? "",
            website: settings?.website ?? "",
          }}
        />
      </PageBody>
    </>
  );
}