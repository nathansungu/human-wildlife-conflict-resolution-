/*
  Warnings:

  - The `conservationStatus` column on the `Animals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `alertPriority` column on the `Animals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `speciesId` on the `DailyReports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,speciesName,cameraId]` on the table `DailyReports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `speciesName` to the `DailyReports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConservationStatus" AS ENUM ('endangered', 'vulnerable', 'protected');

-- CreateEnum
CREATE TYPE "AlertPriority" AS ENUM ('low', 'medium', 'high');

-- DropForeignKey
ALTER TABLE "DailyReports" DROP CONSTRAINT "DailyReports_speciesId_fkey";

-- DropIndex
DROP INDEX "DailyReports_date_speciesId_cameraId_key";

-- AlterTable
ALTER TABLE "Animals" DROP COLUMN "conservationStatus",
ADD COLUMN     "conservationStatus" "ConservationStatus" NOT NULL DEFAULT 'endangered',
DROP COLUMN "alertPriority",
ADD COLUMN     "alertPriority" "AlertPriority" NOT NULL DEFAULT 'high';

-- AlterTable
ALTER TABLE "DailyReports" DROP COLUMN "speciesId",
ADD COLUMN     "speciesName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyReports_date_speciesName_cameraId_key" ON "DailyReports"("date", "speciesName", "cameraId");

-- AddForeignKey
ALTER TABLE "DailyReports" ADD CONSTRAINT "DailyReports_speciesName_fkey" FOREIGN KEY ("speciesName") REFERENCES "Animals"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
