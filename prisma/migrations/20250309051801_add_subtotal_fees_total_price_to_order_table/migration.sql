-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fees" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
