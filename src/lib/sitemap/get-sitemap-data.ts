import { prisma } from "@/lib/db";

export async function getSitemapData() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      title: true,
      slug: true,
      category: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  const cloudCategories = [
    "CLOUD_NATIVE",
    "MIGRATION",
    "CONNECTIVITY",
    "BACKUP_DR",
  ];

  const cloudServices = services.filter((s) =>
    cloudCategories.includes(s.category)
  );

  const itServices = services.filter(
    (s) => !cloudCategories.includes(s.category)
  );

  return {
    services: itServices,
    cloudServices,
  };
}