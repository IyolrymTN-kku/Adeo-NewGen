/*
  Warnings:

  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SiteSettings";

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL DEFAULT 'ADEO Solution',

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_theme" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "primary" TEXT NOT NULL DEFAULT '#0066FF',
    "secondary" TEXT NOT NULL DEFAULT '#0A1628',
    "accent" TEXT NOT NULL DEFAULT '#3385FF',
    "muted" TEXT NOT NULL DEFAULT '#EFF6FF',
    "success" TEXT NOT NULL DEFAULT '#22C55E',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_theme_pkey" PRIMARY KEY ("id")
);
