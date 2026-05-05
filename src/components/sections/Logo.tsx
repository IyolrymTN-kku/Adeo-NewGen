import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  invert?: boolean;
  className?: string;
  companyName?: string;
};

export function Logo({ invert = false, className, companyName = "ADEO Solution" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", "bg-[#FFFFFF]")}>
        <Image src="/logo.svg" alt="ADEO Logo" width={28} height={28} />
      </div>
      <span className={cn("text-lg font-bold tracking-tight", invert ? "text-white" : "text-slate-900")}>
        {companyName}
      </span>
    </div>
  );
}