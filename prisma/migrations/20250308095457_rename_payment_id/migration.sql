/*
  Warnings:

  - The primary key for the `PaymentMethod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `payment_id` on the `PaymentMethod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_paymentId_fkey";

-- AlterTable
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_pkey",
DROP COLUMN "payment_id",
ADD COLUMN     "paymentId" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("paymentId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentMethod"("paymentId") ON DELETE RESTRICT ON UPDATE CASCADE;
