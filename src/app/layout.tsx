import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { Inter, Prompt } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminThemeInitScript } from "@/components/admin/AdminThemeInitScript";
import { AdminThemeSync } from "@/components/admin/AdminThemeSync";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import "react-phone-number-input/style.css";

export const revalidate = 60;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  weight: ["400", "600", "700"],
  display: "swap",
});

async function getSettings() {
  try {
    return await prisma.companySettings.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings?.companyName ?? "ADEO Solution";
  return {
    title: {
      default: `${name} | Enterprise IT & Cloud Services`,
      template: `%s | ${name}`,
    },
    description:
      settings?.description ??
      "ADEO Solution delivers enterprise-grade IT Solutions and Cloud Services — from software development and IT support to cloud migration and network infrastructure.",
    keywords: [
      "IT Solutions",
      "Cloud Services",
      "Software Development",
      "Network",
      "Cloud Migration",
      name,
    ],
    authors: [{ name }],
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const faviconUrl = settings?.faviconUrl ?? "/favicon.svg";
  const timestamp = settings?.updatedAt
    ? new Date(settings.updatedAt).getTime()
    : Date.now();

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${prompt.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={`${faviconUrl}?v=${timestamp}`} />
        {/* เพิ่ม 3 บรรทัดนี้ */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.adeo.co.th" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AdminThemeInitScript />
        <AdminThemeSync />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}