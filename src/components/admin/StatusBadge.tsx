import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "info";

const STYLES: Record<Variant, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-blue-50 text-[#0066ff] ring-blue-200",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ContactStatusBadge({
  status,
}: {
  status: "NEW" | "READ" | "REPLIED";
}) {
  if (status === "NEW") return <Badge variant="info">New</Badge>;
  if (status === "READ") return <Badge variant="warning">Read</Badge>;
  return <Badge variant="success">Replied</Badge>;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="neutral">Hidden</Badge>
  );
}
