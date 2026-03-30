export type ReviewQueueItemResponse = {
  id: string;
  kind: string;
  status: string;
  reason: string | null;
  createdAt: string;
  importedEntry: {
    id: string;
    rawDescription: string | null;
    rawAmount: string;
    rawOccurredAt: string | null;
    status: string;
    batchFileName: string | null;
    suggestedCategoryId: string | null;
    suggestedCategoryName: string | null;
  } | null;
};

export type ImportBatchResponse = {
  id: string;
  fileName: string | null;
  sourceType: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  totalEntries: number;
  reviewRequiredEntries: number;
};

export type ReviewOverviewResponse = {
  totals: {
    openItems: number;
    resolvedItems: number;
    reviewRequiredEntries: number;
    reviewRequiredBatches: number;
    completedBatches: number;
  };
  queue: ReviewQueueItemResponse[];
  batches: ImportBatchResponse[];
};
