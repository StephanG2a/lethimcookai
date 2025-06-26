/*
  Warnings:

  - You are about to drop the column `requirements` on the `ServiceExecution` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `ServiceExecution` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ServiceExecution` table. All the data in the column will be lost.
  - You are about to drop the column `toolsUsed` on the `ServiceExecution` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ServiceExecution` table. All the data in the column will be lost.
  - Added the required column `aiResponse` to the `ServiceExecution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRequest` to the `ServiceExecution` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ServiceExecution_serviceId_idx";

-- DropIndex
DROP INDEX "ServiceExecution_userId_idx";

-- AlterTable
ALTER TABLE "ServiceExecution" DROP COLUMN "requirements",
DROP COLUMN "result",
DROP COLUMN "status",
DROP COLUMN "toolsUsed",
DROP COLUMN "userId",
ADD COLUMN     "aiResponse" TEXT NOT NULL,
ADD COLUMN     "executedBy" TEXT NOT NULL DEFAULT 'Chef Cuisinier IA Business',
ADD COLUMN     "responseLength" INTEGER,
ADD COLUMN     "threadId" TEXT,
ADD COLUMN     "userRequest" TEXT NOT NULL;
