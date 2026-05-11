import { prisma } from "@/lib/db";
import { AboutClient } from "@/app/(public)/(marketing)/about/AboutClient";

export default async function AboutPage() {
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
  });

  return (
    <AboutClient
      companyName={settings?.companyName ?? "ADEO Solution"}
    />
  );
}