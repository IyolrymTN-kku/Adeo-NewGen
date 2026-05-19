import { prisma } from "@/lib/db";
import type { Metadata } from "next";
<<<<<<< HEAD
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminThemeInitScript } from "@/components/admin/AdminThemeInitScript";
import { AdminThemeSync } from "@/components/admin/AdminThemeSync";
=======
import { Inter, Prompt } from "next/font/google";
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
import "./globals.css";
import "react-phone-number-input/style.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const revalidate = 60;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const prompt = Prompt({ 
  subsets: ["thai", "latin"], 
  variable: "--font-thai", 
  weight: ["300", "400", "500", "600", "700"], 
  display: "swap" 
});

<<<<<<< HEAD
export const metadata: Metadata = {
  title: {
    default: "ADEO Solution | Enterprise IT & Cloud Services",
    template: "%s | ADEO Solution",
  },
  description:
    "ADEO Solution delivers enterprise-grade IT Solutions and Cloud Services — from software development and IT support to cloud migration and network infrastructure.",
  keywords: [
    "IT Solutions",
    "Cloud Services",
    "Software Development",
    "Network",
    "Cloud Migration",
    "ADEO",
  ],
  authors: [{ name: "ADEO Solution" }],
  robots: { index: true, follow: true },
  icons: {
    icon: "https://www.adeo.co.th/assets/global/images/logo_header.png",
  },
};
=======
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
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
  const settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
  const faviconUrl = settings?.faviconUrl ?? "/favicon.svg";
  const timestamp = settings?.updatedAt ? new Date(settings.updatedAt).getTime() : Date.now();
  
  const locale = await getLocale();
  const messages = await getMessages();
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6

  return (
<<<<<<< HEAD
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AdminThemeInitScript />
        <AdminThemeSync />

        <ThemeProvider>{children}</ThemeProvider>
=======
    <html lang={locale} className={`${inter.variable} ${prompt.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href={`${faviconUrl}?v=${timestamp}`} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
>>>>>>> 1dd17df8279a93c927c9920523a51e34766cbcc6
      </body>
    </html>
  );
}