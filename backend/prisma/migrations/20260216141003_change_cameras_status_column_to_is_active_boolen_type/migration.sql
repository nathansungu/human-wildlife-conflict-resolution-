/*
  Warnings:

  - You are about to drop the column `status` on the `Cameras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cameras" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
