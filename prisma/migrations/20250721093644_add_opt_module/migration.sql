/*
  Warnings:

  - You are about to drop the column `city` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otps_otp_key" ON "otps"("otp");

-- CreateIndex
CREATE UNIQUE INDEX "otps_otp_email_key" ON "otps"("otp", "email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
