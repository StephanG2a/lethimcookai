/*
  Warnings:

  - You are about to drop the column `priceMax` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `Service` table. All the data in the column will be lost.
  - Added the required column `lowerPrice` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upperPrice` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('IRL', 'ONLINE', 'MIXED');

-- CreateEnum
CREATE TYPE "ConsumptionType" AS ENUM ('INSTANT', 'PERIODIC', 'PRESTATION');

-- CreateEnum
CREATE TYPE "BillingPlan" AS ENUM ('UNIT', 'USAGE', 'MINUTE', 'MENSUAL', 'ANNUAL', 'PROJECT');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CREDIT', 'EUR', 'USD', 'GBP', 'CRYPTO');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "priceMax",
DROP COLUMN "priceMin",
ADD COLUMN     "billingPlan" "BillingPlan" NOT NULL DEFAULT 'PROJECT',
ADD COLUMN     "consumptionType" "ConsumptionType" NOT NULL DEFAULT 'PRESTATION',
ADD COLUMN     "lowerPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mainMedia" TEXT,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'EUR',
ADD COLUMN     "serviceType" "ServiceType" NOT NULL DEFAULT 'MIXED',
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "upperPrice" DOUBLE PRECISION NOT NULL;
