import { prisma } from "@/lib/db";

export async function getSEOConfig() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: {
      siteName: true,
    },
  });

  return {
    siteName: settings?.siteName ?? "Default Site",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    defaultTitle: `${settings?.siteName ?? "Site"} | IT Services`,
    defaultDescription:
      `${settings?.siteName ?? "Site"} provides enterprise IT and cloud solutions.`,
    defaultImage: "/og-image.jpg",
  };
}