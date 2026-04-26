"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

type DeleteButtonProps = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmMessage: string;
  size?: "sm" | "md";
  variant?: "icon" | "text";
  className?: string;
};

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmMessage,
  size = "sm",
  variant = "text",
  className,
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (typeof window === "undefined") return;
    if (!window.confirm(confirmMessage)) return;
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await action(fd);
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
        size === "md" && "px-4 py-2 text-sm",
        className
      )}
    >
      {isPending ? "Deleting…" : label}
    </button>
  );
}
