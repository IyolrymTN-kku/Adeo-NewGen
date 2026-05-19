import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
<<<<<<< HEAD
import { ThemeSettings } from "@/components/theme-settings";
=======
import "react-phone-number-input/style.css";
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6

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
    <div className="min-h-screen bg-white text-slate-950">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
        newSubmissions={newSubmissions}
        companyName={settings?.companyName ?? "ADEO Solution"}
        logoUrl={settings?.logoUrl}
      />

      <div className="min-h-screen bg-white lg:pl-64">
        <main className="min-h-screen bg-white">{children}</main>
      </div>

      <ThemeSettings />
    </div>
  );
}