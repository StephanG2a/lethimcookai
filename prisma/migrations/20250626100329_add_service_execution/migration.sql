-- CreateTable
CREATE TABLE "ServiceExecution" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "toolsUsed" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceExecution_serviceId_idx" ON "ServiceExecution"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceExecution_userId_idx" ON "ServiceExecution"("userId");

-- AddForeignKey
ALTER TABLE "ServiceExecution" ADD CONSTRAINT "ServiceExecution_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
