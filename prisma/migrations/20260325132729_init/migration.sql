-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING', 'SAVINGS', 'CASH', 'CREDIT', 'INVESTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CategoryKind" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionSource" AS ENUM ('MANUAL', 'IMPORT', 'CLIENT_SERVICE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('CONFIRMED', 'PENDING_REVIEW', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ImportSourceType" AS ENUM ('FILE', 'MANUAL_UPLOAD', 'CLIENT_SERVICE');

-- CreateEnum
CREATE TYPE "ImportBatchStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'REVIEW_REQUIRED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ImportedEntryStatus" AS ENUM ('PENDING', 'MATCHED', 'REVIEW_REQUIRED', 'IMPORTED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "ReviewItemKind" AS ENUM ('IMPORTED_ENTRY', 'TRANSACTION', 'INVESTMENT_OPERATION');

-- CreateEnum
CREATE TYPE "ReviewItemStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'ETF', 'FII', 'BOND', 'CRYPTO', 'CASH_EQUIVALENT', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentOperationType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "SimulationBaseContext" AS ENUM ('FINANCE', 'INVESTMENT', 'MIXED');

-- CreateEnum
CREATE TYPE "SimulationScenarioStatus" AS ENUM ('DRAFT', 'CALCULATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SimulationValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "institution" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "initialBalance" DECIMAL(18,2) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "CategoryKind" NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "source" "TransactionSource" NOT NULL DEFAULT 'MANUAL',
    "status" "TransactionStatus" NOT NULL DEFAULT 'CONFIRMED',
    "externalRef" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" "ImportSourceType" NOT NULL,
    "fileName" TEXT,
    "status" "ImportBatchStatus" NOT NULL DEFAULT 'RECEIVED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportedEntry" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rawDescription" TEXT,
    "rawAmount" DECIMAL(18,2) NOT NULL,
    "rawOccurredAt" TIMESTAMP(3),
    "rawPayload" JSONB NOT NULL,
    "suggestedCategoryId" TEXT,
    "matchedTransactionId" TEXT,
    "status" "ImportedEntryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportedEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ReviewItemKind" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "status" "ReviewItemStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tickerOrName" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "broker" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentOperation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "accountId" TEXT,
    "type" "InvestmentOperationType" NOT NULL,
    "quantity" DECIMAL(18,8) NOT NULL,
    "unitPrice" DECIMAL(18,8) NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "fees" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentPosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" DECIMAL(18,8) NOT NULL,
    "averagePrice" DECIMAL(18,8) NOT NULL,
    "currentValue" DECIMAL(18,2),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "totalInvested" DECIMAL(18,2) NOT NULL,
    "totalCurrentValue" DECIMAL(18,2) NOT NULL,
    "totalProfitLoss" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationScenario" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseContext" "SimulationBaseContext" NOT NULL,
    "status" "SimulationScenarioStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationInput" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" "SimulationValueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DECIMAL(18,4) NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "FinancialAccount_userId_idx" ON "FinancialAccount"("userId");

-- CreateIndex
CREATE INDEX "FinancialAccount_userId_type_idx" ON "FinancialAccount"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialAccount_userId_name_key" ON "FinancialAccount"("userId", "name");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Category_userId_kind_idx" ON "Category"("userId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_kind_name_key" ON "Category"("userId", "kind", "name");

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_categoryId_name_key" ON "Subcategory"("categoryId", "name");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_userId_occurredAt_idx" ON "Transaction"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_accountId_occurredAt_idx" ON "Transaction"("accountId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_occurredAt_idx" ON "Transaction"("categoryId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_source_idx" ON "Transaction"("source");

-- CreateIndex
CREATE INDEX "ImportBatch_userId_idx" ON "ImportBatch"("userId");

-- CreateIndex
CREATE INDEX "ImportBatch_userId_status_idx" ON "ImportBatch"("userId", "status");

-- CreateIndex
CREATE INDEX "ImportedEntry_batchId_idx" ON "ImportedEntry"("batchId");

-- CreateIndex
CREATE INDEX "ImportedEntry_userId_status_idx" ON "ImportedEntry"("userId", "status");

-- CreateIndex
CREATE INDEX "ReviewItem_userId_status_idx" ON "ReviewItem"("userId", "status");

-- CreateIndex
CREATE INDEX "ReviewItem_kind_referenceId_idx" ON "ReviewItem"("kind", "referenceId");

-- CreateIndex
CREATE INDEX "Asset_userId_assetType_idx" ON "Asset"("userId", "assetType");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_userId_tickerOrName_key" ON "Asset"("userId", "tickerOrName");

-- CreateIndex
CREATE INDEX "InvestmentOperation_userId_occurredAt_idx" ON "InvestmentOperation"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "InvestmentOperation_assetId_occurredAt_idx" ON "InvestmentOperation"("assetId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentPosition_userId_assetId_key" ON "InvestmentPosition"("userId", "assetId");

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_userId_referenceDate_idx" ON "PortfolioSnapshot"("userId", "referenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSnapshot_userId_referenceDate_key" ON "PortfolioSnapshot"("userId", "referenceDate");

-- CreateIndex
CREATE INDEX "SimulationScenario_userId_status_idx" ON "SimulationScenario"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationScenario_userId_name_key" ON "SimulationScenario"("userId", "name");

-- CreateIndex
CREATE INDEX "SimulationInput_scenarioId_idx" ON "SimulationInput"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationInput_scenarioId_key_key" ON "SimulationInput"("scenarioId", "key");

-- CreateIndex
CREATE INDEX "SimulationResult_scenarioId_idx" ON "SimulationResult"("scenarioId");

-- CreateIndex
CREATE INDEX "SimulationResult_scenarioId_generatedAt_idx" ON "SimulationResult"("scenarioId", "generatedAt");

-- AddForeignKey
ALTER TABLE "FinancialAccount" ADD CONSTRAINT "FinancialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedEntry" ADD CONSTRAINT "ImportedEntry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedEntry" ADD CONSTRAINT "ImportedEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedEntry" ADD CONSTRAINT "ImportedEntry_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOperation" ADD CONSTRAINT "InvestmentOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOperation" ADD CONSTRAINT "InvestmentOperation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOperation" ADD CONSTRAINT "InvestmentOperation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentPosition" ADD CONSTRAINT "InvestmentPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentPosition" ADD CONSTRAINT "InvestmentPosition_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationScenario" ADD CONSTRAINT "SimulationScenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationInput" ADD CONSTRAINT "SimulationInput_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SimulationScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SimulationScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
