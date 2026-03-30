import { Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import type { CreateTransactionDto, ListTransactionsFilters, UpdateTransactionDto } from "../dto/transaction-dto";

function buildDateFilter(filters: ListTransactionsFilters) {
  if (!filters.from && !filters.to) {
    return undefined;
  }

  return {
    gte: filters.from,
    lte: filters.to,
  };
}

function transactionInclude() {
  return {
    account: { select: { id: true, name: true, currency: true } },
    category: { select: { id: true, name: true, kind: true } },
    subcategory: { select: { id: true, name: true } },
  } satisfies Prisma.TransactionInclude;
}

export class TransactionsRepository {
  async listForAccountSummary(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      select: {
        accountId: true,
        type: true,
        amountNative: true,
        amountBrlSnapshot: true,
        transferDirection: true,
        occurredAt: true,
      },
    });
  }

  async listByUser(userId: string, filters: ListTransactionsFilters = {}) {
    return prisma.transaction.findMany({
      where: {
        userId,
        accountId: filters.accountId,
        categoryId: filters.categoryId,
        type: filters.type,
        occurredAt: buildDateFilter(filters),
        transferGroupId: null,
      },
      include: transactionInclude(),
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async listOperationalByUser(userId: string, filters: ListTransactionsFilters = {}) {
    return prisma.transaction.findMany({
      where: {
        userId,
        accountId: filters.accountId,
        categoryId: filters.categoryId,
        occurredAt: buildDateFilter(filters),
        type: filters.type ?? { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
        transferGroupId: null,
      },
      include: transactionInclude(),
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async create(
    input: CreateTransactionDto & {
      userId: string;
      currency: string;
      amountBrlSnapshot: number;
      fxRateApplied?: number;
      fxReferenceAt?: Date | null;
    }
  ) {
    return prisma.transaction.create({
      data: {
        userId: input.userId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId,
        type: input.type,
        amount: new Prisma.Decimal(input.amountNative),
        amountNative: new Prisma.Decimal(input.amountNative),
        currency: input.currency,
        amountBrlSnapshot: new Prisma.Decimal(input.amountBrlSnapshot),
        fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : undefined,
        fxReferenceAt: input.fxReferenceAt ?? undefined,
        description: input.description,
        occurredAt: input.occurredAt,
        source: input.source,
        status: input.status,
      },
      include: transactionInclude(),
    });
  }

  async findById(userId: string, transactionId: string) {
    return prisma.transaction.findFirst({
      where: { id: transactionId, userId, transferGroupId: null },
      include: transactionInclude(),
    });
  }

  async update(
    input: UpdateTransactionDto & {
      userId: string;
      transactionId: string;
      currency: string;
      amountBrlSnapshot: number;
      fxRateApplied?: number;
      fxReferenceAt?: Date | null;
    }
  ) {
    return prisma.transaction.update({
      where: { id: input.transactionId },
      data: {
        accountId: input.accountId,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId,
        type: input.type,
        amount: new Prisma.Decimal(input.amountNative),
        amountNative: new Prisma.Decimal(input.amountNative),
        currency: input.currency,
        amountBrlSnapshot: new Prisma.Decimal(input.amountBrlSnapshot),
        fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : null,
        fxReferenceAt: input.fxReferenceAt ?? null,
        description: input.description,
        occurredAt: input.occurredAt,
        source: input.source,
        status: input.status,
      },
      include: transactionInclude(),
    });
  }

  async deleteById(userId: string, transactionId: string) {
    await prisma.transaction.deleteMany({
      where: { id: transactionId, userId, transferGroupId: null },
    });
  }

  async countByUser(userId: string, filters: ListTransactionsFilters = {}) {
    return prisma.transaction.count({
      where: {
        userId,
        accountId: filters.accountId,
        categoryId: filters.categoryId,
        type: filters.type,
        occurredAt: buildDateFilter(filters),
        transferGroupId: null,
      },
    });
  }

  async sumBalanceBrlByUser(userId: string) {
    const result = await prisma.transaction.findMany({
      where: { userId, transferGroupId: null, type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] } },
      select: { type: true, amountBrlSnapshot: true },
    });

    return result.reduce((acc, item) => {
      const value = Number(item.amountBrlSnapshot.toString());
      return item.type === TransactionType.INCOME ? acc + value : acc - value;
    }, 0);
  }
}
