import {
  ImportBatchStatus,
  ImportedEntryStatus,
  Prisma,
  ReviewItemStatus,
  TransactionSource,
  TransactionStatus,
  type CategoryKind,
} from "@prisma/client";
import { buildCurrencySnapshot, normalizeCurrency } from "@/modules/finance/services/exchange-rates/exchange-rate-provider";
import { prisma } from "@/server/db/prisma";

export class ReviewRepository {
  async getOverviewData(userId: string) {
    const reviewItems = await prisma.reviewItem.findMany({
      where: { userId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    const importedEntryIds = reviewItems
      .filter((item) => item.kind === "IMPORTED_ENTRY")
      .map((item) => item.referenceId);

    const [importedEntries, batches] = await prisma.$transaction([
      prisma.importedEntry.findMany({
        where: {
          userId,
          id: { in: importedEntryIds.length ? importedEntryIds : ["__none__"] },
        },
        include: {
          batch: {
            select: {
              id: true,
              fileName: true,
            },
          },
          suggestedCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.importBatch.findMany({
        where: { userId },
        include: {
          entries: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return {
      reviewItems,
      importedEntries,
      batches,
    };
  }

  async findReviewQueueItemById(userId: string, reviewItemId: string) {
    const reviewItem = await prisma.reviewItem.findFirst({
      where: { id: reviewItemId, userId },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    if (!reviewItem || reviewItem.kind !== "IMPORTED_ENTRY") {
      return null;
    }

    const importedEntry = await prisma.importedEntry.findFirst({
      where: { id: reviewItem.referenceId, userId },
      include: {
        batch: {
          select: {
            id: true,
            fileName: true,
            status: true,
          },
        },
        suggestedCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...reviewItem,
      importedEntry,
    };
  }

  async resolveImportedEntryToTransaction(input: {
    userId: string;
    reviewItemId: string;
    importedEntryId: string;
    accountId: string;
    categoryId: string;
    subcategoryId?: string;
    type: CategoryKind;
  }) {
    return prisma.$transaction(async (tx) => {
      const importedEntry = await tx.importedEntry.findFirst({
        where: {
          id: input.importedEntryId,
          userId: input.userId,
        },
        include: {
          batch: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!importedEntry) {
        throw new Error("Imported entry not found");
      }

      const account = await tx.financialAccount.findFirst({
        where: { id: input.accountId, userId: input.userId },
        select: { currency: true },
      });

      if (!account) {
        throw new Error("Account not found");
      }

      const occurredAt = importedEntry.rawOccurredAt ?? new Date();
      const amountNative = Number(importedEntry.rawAmount.toString());
      const snapshot = await buildCurrencySnapshot(amountNative, normalizeCurrency(account.currency), occurredAt);

      const transaction = await tx.transaction.create({
        data: {
          userId: input.userId,
          accountId: input.accountId,
          categoryId: input.categoryId,
          subcategoryId: input.subcategoryId,
          type: input.type,
          amount: new Prisma.Decimal(amountNative),
          amountNative: new Prisma.Decimal(amountNative),
          currency: snapshot.currency,
          amountBrlSnapshot: new Prisma.Decimal(snapshot.amountBrlSnapshot),
          fxRateApplied: new Prisma.Decimal(snapshot.fxRateApplied),
          fxReferenceAt: snapshot.fxReferenceAt,
          description: importedEntry.rawDescription?.trim() || "Lançamento importado",
          occurredAt,
          source: TransactionSource.IMPORT,
          status: TransactionStatus.CONFIRMED,
        },
      });

      await tx.importedEntry.update({
        where: { id: importedEntry.id },
        data: {
          matchedTransactionId: transaction.id,
          suggestedCategoryId: input.categoryId,
          status: ImportedEntryStatus.IMPORTED,
        },
      });

      await tx.reviewItem.update({
        where: { id: input.reviewItemId },
        data: {
          status: ReviewItemStatus.RESOLVED,
          reason: "Importado para o financeiro real após revisão manual.",
        },
      });

      await this.syncBatchStatusTx(tx, importedEntry.batchId);

      return {
        ok: true,
        reviewItemId: input.reviewItemId,
        transactionId: transaction.id,
      };
    });
  }

  async dismissImportedEntry(input: {
    userId: string;
    reviewItemId: string;
    importedEntryId: string;
    reason?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const importedEntry = await tx.importedEntry.findFirst({
        where: {
          id: input.importedEntryId,
          userId: input.userId,
        },
        select: {
          id: true,
          batchId: true,
        },
      });

      if (!importedEntry) {
        throw new Error("Imported entry not found");
      }

      await tx.importedEntry.update({
        where: { id: importedEntry.id },
        data: {
          status: ImportedEntryStatus.DISCARDED,
        },
      });

      await tx.reviewItem.update({
        where: { id: input.reviewItemId },
        data: {
          status: ReviewItemStatus.DISMISSED,
          reason: input.reason?.trim() || "Item descartado após revisão manual.",
        },
      });

      await this.syncBatchStatusTx(tx, importedEntry.batchId);

      return {
        ok: true,
        reviewItemId: input.reviewItemId,
      };
    });
  }

  private async syncBatchStatusTx(tx: Prisma.TransactionClient, batchId: string) {
    const reviewRequiredCount = await tx.importedEntry.count({
      where: {
        batchId,
        status: ImportedEntryStatus.REVIEW_REQUIRED,
      },
    });

    await tx.importBatch.update({
      where: { id: batchId },
      data: {
        status: reviewRequiredCount > 0 ? ImportBatchStatus.REVIEW_REQUIRED : ImportBatchStatus.COMPLETED,
        finishedAt: reviewRequiredCount > 0 ? null : new Date(),
      },
    });
  }
}
