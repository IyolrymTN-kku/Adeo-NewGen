import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";

export const revalidate = 60;

const AboutClient = dynamic(
  () =>
    import("@/app/(public)/(marketing)/about/AboutClient").then(
      (mod) => mod.AboutClient
    ),
  { ssr: true }
);

export default async function AboutPage() {
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
    select: { companyName: true },
  });

  return (
    <AboutClient
      companyName={settings?.companyName ?? "ADEO Solution"}
    />
  );
}