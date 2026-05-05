import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  invert?: boolean;
  className?: string;
  showText?: boolean;
  siteName?: string;
};

export function Logo({ invert = false, className, showText = true, siteName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          "bg-[#FFFFFF]"
        )}
      >
        <Image
          src="/logo.svg"   // หรือ logo.png
          alt="ADEO Logo"
          width={28}
          height={28}
        />
      </div>

      {showText && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            invert ? "text-white" : "text-slate-900"
          )}
        >
          {siteName ?? "ADEO Solution"}
        </span>
      )}
    </div>
  );
}
