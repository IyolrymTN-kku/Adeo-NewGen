"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/(admin)/admin/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await logoutAction(formData);
        });
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--admin-sidebar-foreground)_18%,transparent)] bg-[color-mix(in_srgb,var(--admin-sidebar-foreground)_6%,transparent)] px-3 py-2 text-xs font-semibold text-[var(--admin-sidebar-foreground)] transition hover:bg-[color-mix(in_srgb,var(--admin-sidebar-foreground)_12%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>

        {isPending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}