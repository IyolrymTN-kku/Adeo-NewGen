/*
  Warnings:

  - You are about to drop the `companySettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "companySettings";

-- CreateTable
CREATE TABLE "company_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "companyName" TEXT NOT NULL DEFAULT 'ADEO Solution',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);
