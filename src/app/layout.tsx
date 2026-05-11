import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const name = settings?.companyName ?? "ADEO Solution";

  return {
    title: {
      default: `${name} | Enterprise IT & Cloud Services`,
      template: `%s | ${name}`,
    },
    description: settings?.description ?? "ADEO Solution delivers enterprise-grade IT Solutions and Cloud Services.",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const faviconUrl = settings?.faviconUrl ?? "/favicon.svg";
  const timestamp = settings?.updatedAt ? new Date(settings.updatedAt).getTime() : Date.now();
  
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link rel="icon" href={`${faviconUrl}?v=${timestamp}`} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
