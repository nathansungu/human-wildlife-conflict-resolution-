/*
  Warnings:

  - You are about to drop the column `animalId` on the `Alerts` table. All the data in the column will be lost.
  - Added the required column `animalName` to the `Alerts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_animalId_fkey";

-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "animalId",
ADD COLUMN     "animalName" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SENT';

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_animalName_fkey" FOREIGN KEY ("animalName") REFERENCES "Animals"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
