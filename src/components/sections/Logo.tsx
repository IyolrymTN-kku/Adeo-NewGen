import { cn } from "@/lib/utils";

type LogoProps = {
  invert?: boolean;
  className?: string;
};

export function Logo({ invert = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          invert ? "bg-[#0066ff]" : "bg-[#0a1628]"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          invert ? "text-white" : "text-slate-900"
        )}
      >
        ADEO Solution
      </span>
    </div>
  );
}
