import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { Inter, Prompt } from "next/font/google";
import "./globals.css";

export const revalidate = 60;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const prompt = Prompt({ subsets: ["thai", "latin"], variable: "--font-thai", weight: ["300", "400", "500", "600", "700"], display: "swap" });

async function getCompanySettings() {
  return prisma.companySettings.findUnique({ where: { id: 1 } });
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  const name = settings?.companyName ?? "ADEO Solution";

  return {
    title: {
      default: `${name} | Enterprise IT & Cloud Services`,
      template: `%s | ${name}`,
    },
    description: settings?.description ?? "ADEO Solution delivers enterprise-grade IT Solutions and Cloud Services.",
    keywords: ["IT Solutions", "Cloud Services", "Software Development", "Network", "Cloud Migration", name],
    authors: [{ name }],
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getCompanySettings();
  const faviconUrl = settings?.faviconUrl ?? "/favicon.svg";
  const timestamp = settings?.updatedAt ? new Date(settings.updatedAt).getTime() : Date.now();

  return (
    <html lang="en" className={`${inter.variable} ${prompt.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href={`${faviconUrl}?v=${timestamp}`} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
