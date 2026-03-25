import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import type { CreateTransactionDto, ListTransactionsFilters } from "../dto/transaction-dto";

function buildDateFilter(filters: ListTransactionsFilters) {
  if (!filters.from && !filters.to) {
    return undefined;
  }

  return {
    gte: filters.from,
    lte: filters.to,
  };
}

export class TransactionsRepository {
  async listByUser(userId: string, filters: ListTransactionsFilters = {}) {
    return prisma.transaction.findMany({
      where: {
        userId,
        accountId: filters.accountId,
        categoryId: filters.categoryId,
        type: filters.type,
        occurredAt: buildDateFilter(filters),
      },
      include: {
        account: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, kind: true } },
        subcategory: { select: { id: true, name: true } },
      },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async create(input: CreateTransactionDto & { userId: string }) {
    return prisma.transaction.create({
      data: {
        userId: input.userId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId,
        type: input.type,
        amount: new Prisma.Decimal(input.amount),
        description: input.description,
        occurredAt: input.occurredAt,
        source: input.source,
        status: input.status,
      },
      include: {
        account: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, kind: true } },
        subcategory: { select: { id: true, name: true } },
      },
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
      },
    });
  }
}
