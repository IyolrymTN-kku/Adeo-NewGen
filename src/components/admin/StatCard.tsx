import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  accent?: "blue" | "navy" | "amber" | "emerald";
};

const accents: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-primary/10 text-primary",
  navy: "bg-secondary/10 text-secondary",
  amber: "bg-[color:var(--admin-accent)]/10 text-[var(--admin-accent)]",
  emerald: "bg-[color:var(--admin-success)]/10 text-[var(--admin-success)]",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
          {label}
        </p>

        {icon && (
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              accents[accent]
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>

      {hint && <p className="mt-1 text-xs text-foreground/60">{hint}</p>}
    </div>
  );
}