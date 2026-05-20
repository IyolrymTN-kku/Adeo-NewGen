"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variantClasses: Record<NonNullable<SubmitButtonProps["variant"]>, string> = {
  primary:   "bg-[var(--admin-primary)] text-white hover:opacity-90",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  outline:   "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50",
  ghost:     "bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizeClasses: Record<NonNullable<SubmitButtonProps["size"]>, string> = {
  sm: "h-8  px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  size = "md",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
