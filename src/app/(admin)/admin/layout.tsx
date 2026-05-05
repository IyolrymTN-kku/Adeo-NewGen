import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSettings } from "@/components/theme-settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // OWASP A01: enforce auth + role at the layout boundary in addition to
  // the middleware route matcher. Defence in depth.
  const session = await requireAdminPage("/admin");

  const newSubmissions = await prisma.contactSubmission.count({
    where: { status: "NEW" },
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        <AdminSidebar
          user={{
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          }}
          newSubmissions={newSubmissions}
        />

        <div className="lg:pl-64">
          <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
            {children}
          </main>
        </div>

      </div>
    </ThemeProvider>
  );
}