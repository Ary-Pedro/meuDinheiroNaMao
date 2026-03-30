import { decimalToString } from "@/modules/shared/utils/decimal";
import type { ReviewOverviewResponse } from "../models/review-types";
import { ReviewRepository } from "../repositories/review-repository";

export class GetReviewOverviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(userId: string): Promise<ReviewOverviewResponse> {
    const { reviewItems, importedEntries, batches } = await this.reviewRepository.getOverviewData(userId);
    const importedEntriesMap = new Map(importedEntries.map((entry) => [entry.id, entry]));

    return {
      totals: {
        openItems: reviewItems.filter((item) => item.status === "OPEN").length,
        resolvedItems: reviewItems.filter((item) => item.status === "RESOLVED").length,
        reviewRequiredEntries: batches.reduce(
          (sum, batch) => sum + batch.entries.filter((entry) => entry.status === "REVIEW_REQUIRED").length,
          0
        ),
        reviewRequiredBatches: batches.filter((batch) => batch.status === "REVIEW_REQUIRED").length,
        completedBatches: batches.filter((batch) => batch.status === "COMPLETED").length,
      },
      queue: reviewItems.map((item) => {
        const importedEntry = importedEntriesMap.get(item.referenceId);

        return {
          id: item.id,
          kind: item.kind,
          status: item.status,
          reason: item.reason,
          createdAt: item.createdAt.toISOString(),
          importedEntry: importedEntry
            ? {
                id: importedEntry.id,
                rawDescription: importedEntry.rawDescription,
                rawAmount: decimalToString(importedEntry.rawAmount),
                rawOccurredAt: importedEntry.rawOccurredAt ? importedEntry.rawOccurredAt.toISOString() : null,
                status: importedEntry.status,
                batchFileName: importedEntry.batch.fileName,
                suggestedCategoryId: importedEntry.suggestedCategory?.id ?? null,
                suggestedCategoryName: importedEntry.suggestedCategory?.name ?? null,
              }
            : null,
        };
      }),
      batches: batches.map((batch) => ({
        id: batch.id,
        fileName: batch.fileName,
        sourceType: batch.sourceType,
        status: batch.status,
        startedAt: batch.startedAt.toISOString(),
        finishedAt: batch.finishedAt ? batch.finishedAt.toISOString() : null,
        totalEntries: batch.entries.length,
        reviewRequiredEntries: batch.entries.filter((entry) => entry.status === "REVIEW_REQUIRED").length,
      })),
    };
  }
}
