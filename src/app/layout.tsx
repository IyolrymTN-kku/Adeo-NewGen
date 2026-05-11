import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminThemeInitScript } from "@/components/admin/AdminThemeInitScript";
import { AdminThemeSync } from "@/components/admin/AdminThemeSync";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AdminThemeInitScript />
        <AdminThemeSync />

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}