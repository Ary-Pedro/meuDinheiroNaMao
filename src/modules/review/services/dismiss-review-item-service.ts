import { AppError } from "@/server/core/errors/app-error";
import { ReviewRepository } from "../repositories/review-repository";
import type { DismissReviewItemDto } from "../dto/review-action-dto";

export class DismissReviewItemService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(userId: string, reviewItemId: string, input: DismissReviewItemDto = {}) {
    const queueItem = await this.reviewRepository.findReviewQueueItemById(userId, reviewItemId);

    if (!queueItem || queueItem.kind !== "IMPORTED_ENTRY" || !queueItem.importedEntry) {
      throw new AppError("Item de revisão não encontrado.", 404);
    }

    if (queueItem.status !== "OPEN") {
      throw new AppError("Somente itens abertos podem ser descartados.", 409);
    }

    return this.reviewRepository.dismissImportedEntry({
      userId,
      reviewItemId,
      importedEntryId: queueItem.importedEntry.id,
      reason: input.reason,
    });
  }
}
