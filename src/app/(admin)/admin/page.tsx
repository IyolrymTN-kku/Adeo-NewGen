import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ContactStatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await requireAdminPage("/admin");

  const [
    totalServices,
    activeServices,
    totalPartners,
    activePartners,
    newSubmissions,
    totalSubmissions,
    recentSubmissions,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.partner.count(),
    prisma.partner.count({ where: { isActive: true } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session.user.name?.split(" ")[0] ?? "Admin"}`}
        description="At-a-glance health of services, partners, and customer enquiries."
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Services"
            value={totalServices}
            hint={`${activeServices} active`}
            accent="blue"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 12h18M12 3v18" />
              </svg>
            }
          />
          <StatCard
            label="Partners"
            value={totalPartners}
            hint={`${activePartners} active`}
            accent="navy"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <circle cx="17" cy="11" r="3" />
              </svg>
            }
          />
          <StatCard
            label="New enquiries"
            value={newSubmissions}
            hint={newSubmissions > 0 ? "Awaiting reply" : "All caught up"}
            accent={newSubmissions > 0 ? "amber" : "emerald"}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            }
          />
          <StatCard
            label="Total enquiries"
            value={totalSubmissions}
            hint="All time"
            accent="emerald"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 4 5-5" />
              </svg>
            }
          />
        </div>

        {/* Recent submissions */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Latest enquiries
              </h2>
              <p className="text-sm text-slate-500">
                The five most recent contact submissions.
              </p>
            </div>
            <Link
              href="/admin/inbox"
              className="text-sm font-semibold text-[#0066ff] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No submissions yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {recentSubmissions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/inbox/${s.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {s.name}
                        </p>
                        <ContactStatusBadge status={s.status} />
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {s.email}
                        {s.company ? ` · ${s.company}` : ""}
                      </p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-slate-400"
                      dateTime={s.createdAt.toISOString()}
                    >
                      {formatRelative(s.createdAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </PageBody>
    </>
  );
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
