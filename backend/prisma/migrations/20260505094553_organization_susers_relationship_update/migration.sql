/*
  Warnings:

  - You are about to drop the column `userId` on the `Organizations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_userId_fkey";

-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
