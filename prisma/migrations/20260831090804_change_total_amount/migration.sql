/*
  Warnings:

  - Changed the type of `totalAmount` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "tableNumber" SET DATA TYPE TEXT,
DROP COLUMN "totalAmount",
ADD COLUMN     "totalAmount" INTEGER NOT NULL;
