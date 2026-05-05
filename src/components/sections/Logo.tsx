import { cn } from "@/lib/utils";

type LogoProps = {
  invert?: boolean;
  className?: string;
};

export function Logo({ invert = false, className }: LogoProps) {
  return (
    <a
      href="/"
      className={cn(
        "flex items-center gap-2.5 text-current transition hover:opacity-90",
        className
      )}
      aria-label="Reload ADEO Solution home page"
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          invert
            ? "border border-white/30 bg-white"
            : "border border-slate-200 bg-white shadow-sm"
        )}
      >
        <img
          src="https://www.adeo.co.th/assets/global/images/logo_header.png"
          alt="ADEO Solution"
          className="h-9 w-auto object-contain"
        />
      </div>

      <span className="text-lg font-bold tracking-tight text-current">
        ADEO Solution
      </span>
    </a>
  );
}