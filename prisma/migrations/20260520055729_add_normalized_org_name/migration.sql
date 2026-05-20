/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "normalizedName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_normalizedName_key" ON "organizations"("normalizedName");
