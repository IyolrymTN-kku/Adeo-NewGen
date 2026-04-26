import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  accent?: "blue" | "navy" | "amber" | "emerald";
};

const accents: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-blue-50 text-[#0066ff]",
  navy: "bg-slate-100 text-[#0a1628]",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              accents[accent]
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
