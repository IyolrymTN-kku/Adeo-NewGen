import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "info";

const STYLES: Record<Variant, string> = {
  neutral:
    "bg-muted text-muted-foreground ring-border",

  success:
    "bg-[color-mix(in_srgb,var(--admin-success)_12%,white)] text-[var(--admin-success)] ring-[color-mix(in_srgb,var(--admin-success)_25%,white)]",

  warning:
    "bg-[color-mix(in_srgb,var(--admin-accent)_14%,white)] text-[var(--admin-accent)] ring-[color-mix(in_srgb,var(--admin-accent)_28%,white)]",

  danger:
    "bg-red-50 text-red-700 ring-red-200",

  info:
    "bg-primary/10 text-primary ring-primary/20",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset transition-colors",
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