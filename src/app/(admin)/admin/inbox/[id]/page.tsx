import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { ContactStatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  deleteSubmissionAction,
  updateSubmissionStatusAction,
} from "../actions";


export const metadata: Metadata = { title: "Submission" };

type Params = Promise<{ id: string }>;

export default async function SubmissionDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const session = await requireAdminPage(`/admin/inbox/${id}`);
  const isFullAdmin = session.user.role === "ADMIN";

  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  if (!submission) notFound();

  // Mark as READ on first open. Best-effort — never block render.
  if (submission.status === "NEW") {
    try {
      await prisma.contactSubmission.update({
        where: { id },
        data: { status: "READ" },
      });
      submission.status = "READ";
    } catch (err) {
      console.error("[inbox.markRead]", err);
    }
  }

  const replyHref = `mailto:${encodeURIComponent(
    submission.email
  )}?subject=${encodeURIComponent("Re: your enquiry to ADEO Solution")}`;

  return (
    <>
      <PageHeader
        title={submission.name}
        description={submission.company ?? submission.email}
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/inbox", label: "Inbox" },
          { href: `/admin/inbox/${id}`, label: "Submission" },
        ]}
        actions={<ContactStatusBadge status={submission.status} />}
      />

      <PageBody>
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Message */}
          <article className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-base font-semibold text-foreground">
                  Message
                </h2>

                <time
                  dateTime={submission.createdAt.toISOString()}
                  className="text-xs text-foreground/60"
                >
                  {submission.createdAt.toLocaleString(undefined, {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </time>
              </header>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {submission.message}
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-4">
            {/* Contact details */}
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                From
              </h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-foreground/60">Name</dt>
                  <dd className="font-medium text-foreground">
                    {submission.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-foreground/60">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${submission.email}`}
                      className="font-medium text-primary hover:text-primary/80 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </dd>
                </div>

                {submission.company && (
                  <div>
                    <dt className="text-xs text-foreground/60">Company</dt>
                    <dd className="font-medium text-foreground">
                      {submission.company}
                    </dd>
                  </div>
                )}

                {submission.phone && (
                  <div>
                    <dt className="text-xs text-foreground/60">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${submission.phone.replace(/\s+/g, "")}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {submission.phone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <a
                href={replyHref}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition hover:bg-primary/90"
              >
                Reply by email
              </a>
            </div>

            {/* Status actions */}
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Status
              </h3>

              <div className="mt-4 space-y-2">
                <StatusActionForm
                  id={submission.id}
                  status="READ"
                  label="Mark as Read"
                  disabled={submission.status === "READ"}
                />

                <StatusActionForm
                  id={submission.id}
                  status="REPLIED"
                  label="Mark as Replied"
                  disabled={submission.status === "REPLIED"}
                  primary
                />

                <StatusActionForm
                  id={submission.id}
                  status="NEW"
                  label="Re-open as New"
                  disabled={submission.status === "NEW"}
                />
              </div>
            </div>

            {/* Danger zone */}
            {isFullAdmin && (
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                  Danger zone
                </h3>

                <p className="mt-2 text-xs text-red-700/80">
                  Deletion is permanent and cannot be undone.
                </p>

                <div className="mt-4">
                  <DeleteButton
                    action={deleteSubmissionAction}
                    id={submission.id}
                    confirmMessage={`Delete this submission from ${submission.name}? This cannot be undone.`}
                    label="Delete submission"
                    size="md"
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function StatusActionForm({
  id,
  status,
  label,
  disabled,
  primary,
}: {
  id: string;
  status: "NEW" | "READ" | "REPLIED";
  label: string;
  disabled: boolean;
  primary?: boolean;
}) {
  return (
    <form action={updateSubmissionStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />

      <button
        type="submit"
        disabled={disabled}
        className={
          primary
            ? "flex w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
            : "flex w-full items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-card-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {disabled ? `✓ ${label}` : label}
      </button>
    </form>
  );
}