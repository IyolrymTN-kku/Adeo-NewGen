import { prisma } from "@/lib/db";

export async function getSEOConfig() {
  const settings = await prisma.companySettings.findUnique({
    where: { id: 1 },
    select: {
      companyName: true,
    },
  });

  return {
    siteName: settings?.companyName ?? "Default Site",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    defaultTitle: `${settings?.companyName ?? "Site"} | IT Services`,
    defaultDescription:
      `${settings?.companyName ?? "Site"} provides enterprise IT and cloud solutions.`,
    defaultImage: "/og-image.jpg",
  };
}