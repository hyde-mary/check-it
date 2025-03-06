/*
  Warnings:

  - Added the required column `rating` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingsCount` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
DROP COLUMN "ratingsCount",
ADD COLUMN     "ratingsCount" INTEGER NOT NULL,
DROP COLUMN "distance",
ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
DROP COLUMN "deliveryTime",
ADD COLUMN     "deliveryTime" INTEGER NOT NULL;
