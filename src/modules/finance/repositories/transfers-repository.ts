import { Prisma, TransactionSource, TransactionStatus, TransactionType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

type PersistedTransferInput = {
  userId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  sourceCurrency: string;
  destinationCurrency: string;
  sourceAmountNative: number;
  destinationAmountNative: number;
  sourceAmountBrlSnapshot: number;
  destinationAmountBrlSnapshot: number;
  fxRateApplied?: number;
  fxReferenceAt?: Date | null;
  occurredAt: Date;
  description?: string;
  notes?: string;
};

export class TransfersRepository {
  async listByUser(userId: string, filters?: { from?: Date; to?: Date; accountId?: string }) {
    return prisma.transferGroup.findMany({
      where: {
        userId,
        occurredAt:
          filters?.from || filters?.to
            ? {
                gte: filters?.from,
                lte: filters?.to,
              }
            : undefined,
        OR: filters?.accountId
          ? [{ sourceAccountId: filters.accountId }, { destinationAccountId: filters.accountId }]
          : undefined,
      },
      include: {
        sourceAccount: { select: { id: true, name: true, currency: true } },
        destinationAccount: { select: { id: true, name: true, currency: true } },
      },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async findById(userId: string, transferGroupId: string) {
    return prisma.transferGroup.findFirst({
      where: { id: transferGroupId, userId },
      include: {
        sourceAccount: { select: { id: true, name: true, currency: true } },
        destinationAccount: { select: { id: true, name: true, currency: true } },
        transactions: {
          select: {
            id: true,
            accountId: true,
            transferDirection: true,
          },
        },
      },
    });
  }

  async create(input: PersistedTransferInput) {
    return prisma.$transaction(async (tx) => {
      const group = await tx.transferGroup.create({
        data: {
          userId: input.userId,
          sourceAccountId: input.sourceAccountId,
          destinationAccountId: input.destinationAccountId,
          sourceAmountNative: new Prisma.Decimal(input.sourceAmountNative),
          destinationAmountNative: new Prisma.Decimal(input.destinationAmountNative),
          sourceCurrency: input.sourceCurrency,
          destinationCurrency: input.destinationCurrency,
          sourceAmountBrlSnapshot: new Prisma.Decimal(input.sourceAmountBrlSnapshot),
          destinationAmountBrlSnapshot: new Prisma.Decimal(input.destinationAmountBrlSnapshot),
          fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : undefined,
          fxReferenceAt: input.fxReferenceAt ?? undefined,
          occurredAt: input.occurredAt,
          description: input.description,
          notes: input.notes,
        },
      });

      await tx.transaction.createMany({
        data: [
          {
            userId: input.userId,
            accountId: input.sourceAccountId,
            type: TransactionType.TRANSFER,
            amount: new Prisma.Decimal(input.sourceAmountNative),
            amountNative: new Prisma.Decimal(input.sourceAmountNative),
            currency: input.sourceCurrency,
            amountBrlSnapshot: new Prisma.Decimal(input.sourceAmountBrlSnapshot),
            fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : null,
            fxReferenceAt: input.fxReferenceAt ?? null,
            description: input.description,
            occurredAt: input.occurredAt,
            source: TransactionSource.MANUAL,
            status: TransactionStatus.CONFIRMED,
            transferGroupId: group.id,
            transferDirection: "OUT",
          },
          {
            userId: input.userId,
            accountId: input.destinationAccountId,
            type: TransactionType.TRANSFER,
            amount: new Prisma.Decimal(input.destinationAmountNative),
            amountNative: new Prisma.Decimal(input.destinationAmountNative),
            currency: input.destinationCurrency,
            amountBrlSnapshot: new Prisma.Decimal(input.destinationAmountBrlSnapshot),
            fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : null,
            fxReferenceAt: input.fxReferenceAt ?? null,
            description: input.description,
            occurredAt: input.occurredAt,
            source: TransactionSource.MANUAL,
            status: TransactionStatus.CONFIRMED,
            transferGroupId: group.id,
            transferDirection: "IN",
          },
        ],
      });

      return tx.transferGroup.findUniqueOrThrow({
        where: { id: group.id },
        include: {
          sourceAccount: { select: { id: true, name: true, currency: true } },
          destinationAccount: { select: { id: true, name: true, currency: true } },
        },
      });
    });
  }

  async update(transferGroupId: string, input: PersistedTransferInput) {
    return prisma.$transaction(async (tx) => {
      await tx.transferGroup.update({
        where: { id: transferGroupId },
        data: {
          sourceAccountId: input.sourceAccountId,
          destinationAccountId: input.destinationAccountId,
          sourceAmountNative: new Prisma.Decimal(input.sourceAmountNative),
          destinationAmountNative: new Prisma.Decimal(input.destinationAmountNative),
          sourceCurrency: input.sourceCurrency,
          destinationCurrency: input.destinationCurrency,
          sourceAmountBrlSnapshot: new Prisma.Decimal(input.sourceAmountBrlSnapshot),
          destinationAmountBrlSnapshot: new Prisma.Decimal(input.destinationAmountBrlSnapshot),
          fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : null,
          fxReferenceAt: input.fxReferenceAt ?? null,
          occurredAt: input.occurredAt,
          description: input.description,
          notes: input.notes,
        },
      });

      const legs = await tx.transaction.findMany({
        where: { transferGroupId },
        select: { id: true, transferDirection: true },
      });

      for (const leg of legs) {
        const isOut = leg.transferDirection === "OUT";
        await tx.transaction.update({
          where: { id: leg.id },
          data: {
            accountId: isOut ? input.sourceAccountId : input.destinationAccountId,
            amount: new Prisma.Decimal(isOut ? input.sourceAmountNative : input.destinationAmountNative),
            amountNative: new Prisma.Decimal(isOut ? input.sourceAmountNative : input.destinationAmountNative),
            currency: isOut ? input.sourceCurrency : input.destinationCurrency,
            amountBrlSnapshot: new Prisma.Decimal(
              isOut ? input.sourceAmountBrlSnapshot : input.destinationAmountBrlSnapshot
            ),
            fxRateApplied: input.fxRateApplied ? new Prisma.Decimal(input.fxRateApplied) : null,
            fxReferenceAt: input.fxReferenceAt ?? null,
            description: input.description,
            occurredAt: input.occurredAt,
          },
        });
      }

      return tx.transferGroup.findUniqueOrThrow({
        where: { id: transferGroupId },
        include: {
          sourceAccount: { select: { id: true, name: true, currency: true } },
          destinationAccount: { select: { id: true, name: true, currency: true } },
        },
      });
    });
  }

  async deleteById(transferGroupId: string) {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { transferGroupId } }),
      prisma.transferGroup.delete({ where: { id: transferGroupId } }),
    ]);
  }
}
