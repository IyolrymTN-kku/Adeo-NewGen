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
  deleteServiceAction,
  toggleServiceActiveAction,
} from "./actions";
import { categoryLabel } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const session = await requireAdminPage("/admin/services");
  const isFullAdmin = session.user.role === "ADMIN";

  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      icon: true,
      isActive: true,
      sortOrder: true,
      updatedAt: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Services"
        description="Add, edit, or hide service offerings shown across the public site."
        actions={
          <ButtonLink href="/admin/services/new">+ New Service</ButtonLink>
        }
      />
      <PageBody>
        {services.length === 0 ? (
          <EmptyState
            title="No services yet"
            description="Create the first service to populate the public site."
            action={
              <ButtonLink href="/admin/services/new">
                Add a service
              </ButtonLink>
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Service</TH>
                <TH>Category</TH>
                <TH>Order</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {services.map((s) => (
                <TR key={s.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {s.icon ? (
                        <Image
                          src={s.icon}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-md bg-slate-50 object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold uppercase text-[#0066ff]">
                          {s.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {s.title}
                        </p>
                        <p className="font-mono text-xs text-slate-500">
                          /{s.slug}
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <span className="text-xs text-slate-600">
                      {categoryLabel(s.category)}
                    </span>
                  </TD>
                  <TD>
                    <span className="font-mono text-xs text-slate-500">
                      {s.sortOrder}
                    </span>
                  </TD>
                  <TD>
                    <ActiveBadge active={s.isActive} />
                  </TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <form action={toggleServiceActiveAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <button
                          type="submit"
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {s.isActive ? "Hide" : "Show"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/services/${s.id}/edit`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0066ff] hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      {isFullAdmin && (
                        <DeleteButton
                          action={deleteServiceAction}
                          id={s.id}
                          confirmMessage={`Delete "${s.title}"? This cannot be undone.`}
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
