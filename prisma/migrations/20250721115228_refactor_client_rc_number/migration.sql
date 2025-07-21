/*
  Warnings:

  - A unique constraint covering the columns `[rcNumber]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_rcNumber_key" ON "clients"("rcNumber");
