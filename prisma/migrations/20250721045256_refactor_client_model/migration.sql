/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "registrationNumber",
ADD COLUMN     "rcNumber" TEXT;
