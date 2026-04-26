import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader, PageBody } from "@/components/admin/PageHeader";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/Table";
import { EmptyState } from "@/components/admin/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  deletePartnerAction,
  togglePartnerActiveAction,
} from "./actions";

export const metadata: Metadata = { title: "Partners" };

const CATEGORY_LABEL: Record<string, string> = {
  NETWORK: "Network",
  CLOUD: "Cloud",
  SECURITY: "Security",
  HARDWARE: "Hardware",
};

export default async function AdminPartnersPage() {
  const session = await requireAdminPage("/admin/partners");
  const isFullAdmin = session.user.role === "ADMIN";

  const partners = await prisma.partner.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      name: true,
      logoUrl: true,
      websiteUrl: true,
      category: true,
      isActive: true,
      sortOrder: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Partners"
        description="Manage technology partner logos shown on the home page."
        actions={
          <ButtonLink href="/admin/partners/new">+ New Partner</ButtonLink>
        }
      />
      <PageBody>
        {partners.length === 0 ? (
          <EmptyState
            title="No partners yet"
            description="Add your first technology partner."
            action={<ButtonLink href="/admin/partners/new">Add a partner</ButtonLink>}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Partner</TH>
                <TH>Category</TH>
                <TH>Order</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {partners.map((p) => (
                <TR key={p.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {p.logoUrl.startsWith("/uploads/") ? (
                        <div className="flex h-10 w-16 items-center justify-center rounded-md border border-slate-200 bg-white p-1">
                          <Image
                            src={p.logoUrl}
                            alt=""
                            width={56}
                            height={32}
                            className="max-h-8 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-16 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold uppercase text-[#0066ff]">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {p.name}
                        </p>
                        {p.websiteUrl && (
                          <a
                            href={p.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-[#0066ff] hover:underline"
                          >
                            {p.websiteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <span className="text-xs text-slate-600">
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </span>
                  </TD>
                  <TD>
                    <span className="font-mono text-xs text-slate-500">
                      {p.sortOrder}
                    </span>
                  </TD>
                  <TD>
                    <ActiveBadge active={p.isActive} />
                  </TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <form action={togglePartnerActiveAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {p.isActive ? "Hide" : "Show"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/partners/${p.id}/edit`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0066ff] hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      {isFullAdmin && (
                        <DeleteButton
                          action={deletePartnerAction}
                          id={p.id}
                          confirmMessage={`Delete "${p.name}"? This cannot be undone.`}
                          variant="icon"
                        />
                      )}
                    </div>
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
