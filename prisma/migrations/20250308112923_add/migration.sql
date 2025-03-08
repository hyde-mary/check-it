-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Cash', 'Card');

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'Cash',
ALTER COLUMN "cardNumber" DROP NOT NULL,
ALTER COLUMN "cardCv" DROP NOT NULL,
ALTER COLUMN "expirationDate" DROP NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL,
ALTER COLUMN "cardholderName" DROP NOT NULL;
