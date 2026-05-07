import { prisma } from "@/lib/db";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const companyName = settings?.companyName ?? "ADEO Solution";

  return (
    <>
      <Header companyName={companyName} logoUrl={settings?.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer siteName={settings?.siteName} />
    </>
  );
}