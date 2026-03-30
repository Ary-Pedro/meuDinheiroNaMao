import { type AccountType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export class AccountsRepository {
  async listByUser(userId: string) {
    return prisma.financialAccount.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(input: {
    userId: string;
    name: string;
    type: AccountType;
    institution?: string;
    currency: string;
    initialBalance: number;
  }) {
    return prisma.financialAccount.create({
      data: {
        userId: input.userId,
        name: input.name,
        type: input.type,
        institution: input.institution,
        currency: input.currency,
        initialBalance: new Prisma.Decimal(input.initialBalance),
      },
    });
  }

  async update(input: {
    userId: string;
    accountId: string;
    name: string;
    type: AccountType;
    institution?: string;
    currency: string;
    initialBalance: number;
  }) {
    return prisma.financialAccount.update({
      where: { id: input.accountId },
      data: {
        name: input.name,
        type: input.type,
        institution: input.institution,
        currency: input.currency,
        initialBalance: new Prisma.Decimal(input.initialBalance),
      },
    });
  }

  async findById(userId: string, accountId: string) {
    return prisma.financialAccount.findFirst({
      where: { id: accountId, userId },
      select: {
        id: true,
        name: true,
        currency: true,
        isArchived: true,
      },
    });
  }

  async deleteOrArchive(userId: string, accountId: string) {
    const [transactionCount, investmentOpsCount, accountInvestmentsCount] = await prisma.$transaction([
      prisma.transaction.count({
        where: { userId, accountId },
      }),
      prisma.investmentOperation.count({
        where: { userId, accountId },
      }),
      prisma.accountInvestment.count({
        where: { userId, accountId },
      }),
    ]);

    if (transactionCount > 0 || investmentOpsCount > 0 || accountInvestmentsCount > 0) {
      await prisma.financialAccount.update({
        where: { id: accountId },
        data: { isArchived: true },
      });

      return { mode: "archived" as const };
    }

    await prisma.financialAccount.delete({
      where: { id: accountId },
    });

    return { mode: "deleted" as const };
  }

  async existsById(userId: string, accountId: string) {
    const account = await prisma.financialAccount.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });

    return Boolean(account);
  }
}
