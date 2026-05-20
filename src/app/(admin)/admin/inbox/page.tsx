import type { Metadata } from "next";
import Link from "next/link";
import type { ContactStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { ContactStatusBadge } from "@/components/admin/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/Table";
import { EmptyState } from "@/components/admin/EmptyState";

export const metadata: Metadata = { title: "Inbox" };

type SearchParams = Promise<{ status?: string }>;

const FILTERS = [
  { key: undefined, label: "All" },
  { key: "NEW", label: "New" },
  { key: "READ", label: "Read" },
  { key: "REPLIED", label: "Replied" },
] as const;

export default async function InboxPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage("/admin/inbox");
  const { status } = await searchParams;

  const validStatus: ContactStatus | null =
    status === "NEW" || status === "READ" || status === "REPLIED"
      ? status
      : null;

  const where: Prisma.ContactSubmissionWhereInput = validStatus
    ? { status: validStatus }
    : {};

  const submissions = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Contact form submissions from the public site."
      />

      <PageBody>
        {/* Filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = (status ?? undefined) === f.key;
            const href = f.key ? `/admin/inbox?status=${f.key}` : "/admin/inbox";

            return (
              <Link
                key={f.label}
                href={href}
                className={
                  active
                    ? "rounded-lg border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/30"
                    : "rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {submissions.length === 0 ? (
          <EmptyState
            title={
              status ? `No ${status.toLowerCase()} submissions` : "Inbox empty"
            }
            description="New enquiries from the public contact form will appear here."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>From</TH>
                <TH>Company</TH>
                <TH>Received</TH>
                <TH>Status</TH>
                <TH className="text-right">View</TH>
              </TR>
            </THead>

            <TBody>
              {submissions.map((s) => (
                <TR key={s.id}>
                  <TD>
                    <div>
                      <p
                        className={
                          s.status === "NEW"
                            ? "font-bold text-foreground"
                            : "font-semibold text-foreground/90"
                        }
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-foreground/60">{s.email}</p>
                    </div>
                  </TD>

                  <TD>
                    <span className="text-xs text-foreground/70">
                      {s.company ?? "—"}
                    </span>
                  </TD>

                  <TD>
                    <time
                      dateTime={s.createdAt.toISOString()}
                      className="text-xs text-foreground/60"
                    >
                      {s.createdAt.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </TD>

                  <TD>
                    <ContactStatusBadge status={s.status} />
                  </TD>

                  <TD className="text-right">
                    <Link
                      href={`/admin/inbox/${s.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      Open →
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </PageBody>
    </>
  );
}