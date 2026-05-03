/*
  Warnings:

  - Added the required column `organizationId` to the `Cameras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cameras" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cameras" ADD CONSTRAINT "Cameras_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
