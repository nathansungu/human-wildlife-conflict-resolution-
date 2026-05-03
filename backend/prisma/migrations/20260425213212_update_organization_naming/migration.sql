/*
  Warnings:

  - You are about to drop the column `validUntil` on the `Organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "validUntil",
ADD COLUMN     "subscriptionValidUntil" TIMESTAMP(3);
