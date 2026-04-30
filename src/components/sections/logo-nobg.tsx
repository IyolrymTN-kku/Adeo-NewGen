import { cn } from "@/lib/utils";

type LogoProps = {
  invert?: boolean;
  className?: string;
};

export function Logo({ invert = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="https://www.adeo.co.th/assets/global/images/logo_header.png"
        alt="ADEO Solution"
        className="h-13 w-auto object-contain"
      />
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