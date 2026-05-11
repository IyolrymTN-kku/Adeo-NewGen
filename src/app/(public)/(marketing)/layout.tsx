import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { prisma } from "@/lib/db";
import { getLocale } from "next-intl/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const companyName = settings?.companyName ?? "ADEO Solution";
  const locale = await getLocale();

  return (
    <>
      <Header companyName={companyName} logoUrl={settings?.logoUrl} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}