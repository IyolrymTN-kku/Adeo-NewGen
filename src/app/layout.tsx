import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const name = settings?.companyName ?? "ADEO Solution";
  const faviconUrl = settings?.faviconUrl
    ? settings.faviconUrl.startsWith("/")
      ? settings.faviconUrl
      : `/${settings.faviconUrl}`
    : "/favicon.svg";

  return {
    title: {
      default: `${name} | Enterprise IT & Cloud Services`,
      template: `%s | ${name}`,
    },
    description: settings?.description ?? "ADEO Solution delivers enterprise-grade IT Solutions and Cloud Services.",
    keywords: ["IT Solutions", "Cloud Services", "Software Development", "Network", "Cloud Migration", name],
    authors: [{ name }],
    robots: { index: true, follow: true },
    icons: { icon: faviconUrl },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
