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

  async existsById(userId: string, accountId: string) {
    const account = await prisma.financialAccount.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });

    return Boolean(account);
  }
}
