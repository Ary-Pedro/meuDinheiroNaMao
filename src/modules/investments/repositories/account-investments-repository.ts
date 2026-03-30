import { AccountInvestmentScopeMode, AccountInvestmentType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export class AccountInvestmentsRepository {
  async listByUser(userId: string) {
    return prisma.accountInvestment.findMany({
      where: { userId, isArchived: false },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
      },
      orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async create(input: {
    userId: string;
    accountId: string;
    name: string;
    investmentType: AccountInvestmentType;
    principalAmount: number;
    currentValue: number;
    incomeAmount: number;
    scopeMode: AccountInvestmentScopeMode;
    startedAt: Date;
    notes?: string;
  }) {
    return prisma.accountInvestment.create({
      data: {
        userId: input.userId,
        accountId: input.accountId,
        name: input.name,
        investmentType: input.investmentType,
        principalAmount: new Prisma.Decimal(input.principalAmount),
        currentValue: new Prisma.Decimal(input.currentValue),
        incomeAmount: new Prisma.Decimal(input.incomeAmount),
        scopeMode: input.scopeMode,
        startedAt: input.startedAt,
        notes: input.notes,
      },
      include: {
        account: { select: { id: true, name: true, currency: true } },
      },
    });
  }

  async update(input: {
    userId: string;
    investmentId: string;
    accountId: string;
    name: string;
    investmentType: AccountInvestmentType;
    principalAmount: number;
    currentValue: number;
    incomeAmount: number;
    scopeMode: AccountInvestmentScopeMode;
    startedAt: Date;
    notes?: string;
  }) {
    return prisma.accountInvestment.update({
      where: { id: input.investmentId },
      data: {
        accountId: input.accountId,
        name: input.name,
        investmentType: input.investmentType,
        principalAmount: new Prisma.Decimal(input.principalAmount),
        currentValue: new Prisma.Decimal(input.currentValue),
        incomeAmount: new Prisma.Decimal(input.incomeAmount),
        scopeMode: input.scopeMode,
        startedAt: input.startedAt,
        notes: input.notes,
      },
      include: {
        account: { select: { id: true, name: true, currency: true } },
      },
    });
  }

  async findById(userId: string, investmentId: string) {
    return prisma.accountInvestment.findFirst({
      where: { id: investmentId, userId, isArchived: false },
      include: {
        account: { select: { id: true, name: true, currency: true } },
      },
    });
  }

  async deleteById(userId: string, investmentId: string) {
    await prisma.accountInvestment.updateMany({
      where: { id: investmentId, userId },
      data: { isArchived: true },
    });
  }
}
