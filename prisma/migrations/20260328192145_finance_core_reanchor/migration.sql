-- CreateEnum
CREATE TYPE "TransferDirection" AS ENUM ('OUT', 'IN');

-- CreateEnum
CREATE TYPE "AccountInvestmentType" AS ENUM ('CAIXINHA', 'CDB', 'FUND', 'STOCK', 'CRYPTO', 'CASH_EQUIVALENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountInvestmentScopeMode" AS ENUM ('TOTAL', 'INCOME_ONLY');

-- AlterTable
ALTER TABLE "SimulationScenario" ADD COLUMN     "targetAmount" DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amountBrlSnapshot" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "amountNative" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BRL',
ADD COLUMN     "fxRateApplied" DECIMAL(18,8),
ADD COLUMN     "fxReferenceAt" TIMESTAMP(3),
ADD COLUMN     "transferDirection" "TransferDirection",
ADD COLUMN     "transferGroupId" TEXT,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TransferGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceAccountId" TEXT NOT NULL,
    "destinationAccountId" TEXT NOT NULL,
    "sourceAmountNative" DECIMAL(18,2) NOT NULL,
    "destinationAmountNative" DECIMAL(18,2) NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "destinationCurrency" TEXT NOT NULL,
    "sourceAmountBrlSnapshot" DECIMAL(18,2) NOT NULL,
    "destinationAmountBrlSnapshot" DECIMAL(18,2) NOT NULL,
    "fxRateApplied" DECIMAL(18,8),
    "fxReferenceAt" TIMESTAMP(3),
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountInvestment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "investmentType" "AccountInvestmentType" NOT NULL DEFAULT 'OTHER',
    "principalAmount" DECIMAL(18,2) NOT NULL,
    "currentValue" DECIMAL(18,2) NOT NULL,
    "incomeAmount" DECIMAL(18,2) NOT NULL,
    "scopeMode" "AccountInvestmentScopeMode" NOT NULL DEFAULT 'TOTAL',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationParticipant" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expectedContribution" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "actualContribution" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationCost" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferGroup_userId_occurredAt_idx" ON "TransferGroup"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "TransferGroup_sourceAccountId_occurredAt_idx" ON "TransferGroup"("sourceAccountId", "occurredAt");

-- CreateIndex
CREATE INDEX "TransferGroup_destinationAccountId_occurredAt_idx" ON "TransferGroup"("destinationAccountId", "occurredAt");

-- CreateIndex
CREATE INDEX "AccountInvestment_userId_startedAt_idx" ON "AccountInvestment"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "AccountInvestment_accountId_startedAt_idx" ON "AccountInvestment"("accountId", "startedAt");

-- CreateIndex
CREATE INDEX "SimulationParticipant_scenarioId_idx" ON "SimulationParticipant"("scenarioId");

-- CreateIndex
CREATE INDEX "SimulationCost_scenarioId_idx" ON "SimulationCost"("scenarioId");

-- CreateIndex
CREATE INDEX "Transaction_transferGroupId_idx" ON "Transaction"("transferGroupId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferGroupId_fkey" FOREIGN KEY ("transferGroupId") REFERENCES "TransferGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferGroup" ADD CONSTRAINT "TransferGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferGroup" ADD CONSTRAINT "TransferGroup_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferGroup" ADD CONSTRAINT "TransferGroup_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountInvestment" ADD CONSTRAINT "AccountInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountInvestment" ADD CONSTRAINT "AccountInvestment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationParticipant" ADD CONSTRAINT "SimulationParticipant_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SimulationScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationCost" ADD CONSTRAINT "SimulationCost_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SimulationScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
