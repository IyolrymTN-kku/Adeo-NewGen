import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

async function getSiteName() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { siteName: true },
  });

  return settings?.siteName ?? "ADEO Solution";
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),

    title: {
      default: `${siteName} | Enterprise IT & Cloud Services`,
      template: `%s | ${siteName}`,
    },

    description: `${siteName} delivers enterprise IT Solutions, Cloud Services, Software Development, and Cybersecurity for modern businesses.`,

    keywords: [
      "IT Solutions",
      "Cloud Services",
      "Software Development",
      "Cybersecurity",
      "Cloud Migration",
      "Network Infrastructure",
      "ADEO",
    ],

    authors: [{ name: siteName }],

    creator: siteName,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },

    openGraph: {
      title: `${siteName} | IT & Cloud Services`,
      description:
        "Enterprise IT Solutions, Cloud Infrastructure, and Digital Transformation Services.",
      url: "/",
      siteName,
      type: "website",
      images: [
        {
          url: "/og-image.jpg", //image on website
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${siteName}`,
      description:
        "Enterprise IT & Cloud Services for modern businesses",
      images: ["/og-image.jpg"],
    },

    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
  }