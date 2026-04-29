import { cn } from "@/lib/utils";
import { path } from "framer-motion/m";

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
          invert ? "bg-[#EAEDF1]" : "bg-[#F5F7F9]"
        )}
      >
      <img
      src="https://www.adeo.co.th/assets/global/images/logo_header.png"
      alt="ADEO Solution"
      className="h-9 w-auto object-contain"
    />
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
