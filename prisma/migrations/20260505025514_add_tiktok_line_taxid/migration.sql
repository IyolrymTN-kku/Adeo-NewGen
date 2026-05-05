/*
  Warnings:

  - You are about to drop the column `metaDescription` on the `company_settings` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `company_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company_settings" DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle";
