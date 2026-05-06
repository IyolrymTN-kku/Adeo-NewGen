import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminPage("/admin");
  const [newSubmissions, settings] = await Promise.all([
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.companySettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
        newSubmissions={newSubmissions}
        companyName={settings?.companyName ?? "ADEO Solution"}
      />
      <div className="lg:pl-64">
        <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}