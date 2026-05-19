import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  invert?: boolean;
  className?: string;
<<<<<<< HEAD
  siteName?: string;
  href?: string;
};

export function Logo({
  invert = false,
  className,
  siteName = "ADEO Solution",
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 text-current transition hover:opacity-90",
        className
      )}
      aria-label={`Go to ${siteName}`}
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
          alt={siteName}
          className="h-9 w-auto object-contain"
        />
      </div>

      <span className="text-lg font-bold tracking-tight text-current">
        {siteName}
=======
  companyName?: string;
  logoUrl?: string | null;
};

export function Logo({ invert = false, className, companyName = "ADEO Solution", logoUrl }: LogoProps) {
  const finalLogoUrl = logoUrl ?? "/logo.svg";
  
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", "bg-[#FFFFFF]")}>
        <Image src={finalLogoUrl} alt="ADEO Logo" width={28} height={28} priority />
      </div>
      <span className={cn("text-lg font-bold tracking-tight", invert ? "text-white" : "text-slate-900")}>
        {companyName}
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
      </span>
    </Link>
  );
}