/*
  Warnings:

  - You are about to drop the column `endDate` on the `Organizations` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Subscribers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,organizationId]` on the table `Subscribers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone,organizationId]` on the table `Subscribers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Subscribers` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Subscribers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "endDate";

-- AlterTable
ALTER TABLE "Subscribers" DROP COLUMN "isVerified",
ADD COLUMN     "PhoneVerificationCode" TEXT,
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscribers_email_organizationId_key" ON "Subscribers"("email", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribers_phone_organizationId_key" ON "Subscribers"("phone", "organizationId");
