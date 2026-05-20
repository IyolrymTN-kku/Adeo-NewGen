"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  invert?: boolean;
  className?: string;
  siteName?: string;
  companyName?: string;
  logoUrl?: string | null;
  href?: string;
  noLink?: boolean;
  onClick?: () => void;
};

export function Logo({
  invert = false,
  className,
  siteName = "ADEO Solution",
  companyName = "ADEO Solution",
  logoUrl,
  href = "/",
  noLink = false,
  onClick,
}: LogoProps) {
  const finalLogoUrl = logoUrl ?? "https://www.adeo.co.th/assets/global/images/logo_header.png";
  const displayName = siteName !== "ADEO Solution" ? siteName : companyName;

  const inner = (
    <>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          invert
            ? "border border-white/30 bg-white"
            : "border border-slate-200 bg-white shadow-sm"
        )}
      >
        <Image
          src={finalLogoUrl}
          alt={displayName}
          width={28}
          height={28}
          priority
          className="h-9 w-auto object-contain"
        />
      </div>

      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          invert ? "text-white" : "text-slate-900"
        )}
      >
        {displayName}
      </span>
    </>
  );

  if (noLink) {
    return (
      <div
        className={cn("flex items-center gap-2.5 text-current", className)}
        aria-label={displayName}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 text-current transition hover:opacity-90",
        className
      )}
      aria-label={`Go to ${displayName}`}
    >
      {inner}
    </Link>
  );
}
