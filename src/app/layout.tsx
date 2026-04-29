import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  keywords: ["IT Solutions", "Cloud Services", "Software Development", "Network", "Cloud Migration", "ADEO"],
  authors: [{ name: "ADEO Solution" }],
  robots: { index: true, follow: true },

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
