/*
  Warnings:

  - You are about to drop the `admin_theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "admin_theme";

-- DropTable
DROP TABLE "site_settings";

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "primary" TEXT NOT NULL DEFAULT '#0066FF',
    "secondary" TEXT NOT NULL DEFAULT '#0A1628',
    "accent" TEXT NOT NULL DEFAULT '#0066FF',
    "muted" TEXT NOT NULL DEFAULT '#EFF6FF',
    "success" TEXT NOT NULL DEFAULT '#22C55E',
    "componentColors" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminTheme" (
    "id" SERIAL NOT NULL,
    "primary" TEXT NOT NULL DEFAULT '#0066FF',
    "secondary" TEXT NOT NULL DEFAULT '#0A1628',
    "accent" TEXT NOT NULL DEFAULT '#3385FF',
    "muted" TEXT NOT NULL DEFAULT '#EFF6FF',
    "success" TEXT NOT NULL DEFAULT '#22C55E',

    CONSTRAINT "AdminTheme_pkey" PRIMARY KEY ("id")
);
