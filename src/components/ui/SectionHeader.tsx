import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            "text-primary"
          )}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          invert ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            invert ? "text-slate-300" : "text-foreground/70"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}