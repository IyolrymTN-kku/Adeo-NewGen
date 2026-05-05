import { prisma } from "@/lib/db";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <>
      <Header siteName={settings?.siteName} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
