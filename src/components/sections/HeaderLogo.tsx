import { prisma } from "@/lib/db";
import { Logo } from "@/components/sections/Logo";
import Link from "next/link";

// This is a Server Component — do NOT add "use client"
export async function HeaderLogo() {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const companyName = settings?.companyName ?? "ADEO Solution";

  return (
    <Link href="/" aria-label={`${companyName} home`}>
      <Logo companyName={companyName} />
    </Link>
  );
}