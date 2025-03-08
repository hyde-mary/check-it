-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Preparing', 'OutForDelivery', 'Delivered', 'Canceled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Pending';
