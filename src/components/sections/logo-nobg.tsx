import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const finalLogoUrl =
    logoUrl ?? "https://www.adeo.co.th/assets/global/images/logo_header.png";

  const displayName = siteName !== "ADEO Solution" ? siteName : companyName;

  const inner = (
    <>
      <img
        src={finalLogoUrl}
        alt={displayName}
        className="h-13 w-auto object-contain"
      />
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
      <div className={cn("flex items-center gap-2", className)}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-current transition hover:opacity-90",
        className
      )}
      aria-label={`Go to ${displayName}`}
    >
      {inner}
    </Link>
  );
}
