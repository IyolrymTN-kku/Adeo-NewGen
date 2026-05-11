import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeSettings } from "@/components/theme-settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminPage("/admin");

  const newSubmissions = await prisma.contactSubmission.count({
    where: { status: "NEW" },
  });

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
        newSubmissions={newSubmissions}
      />

      <div className="min-h-screen bg-white lg:pl-64">
        <main className="min-h-screen bg-white">{children}</main>
      </div>

      <ThemeSettings />
    </div>
  );
}