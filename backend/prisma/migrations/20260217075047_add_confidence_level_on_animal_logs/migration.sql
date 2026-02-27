/*
  Warnings:

  - Added the required column `confidence` to the `AnimalLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnimalLogs" ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL;
