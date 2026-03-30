import { AppError } from "@/server/core/errors/app-error";
import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import { CategoriesRepository } from "@/modules/finance/repositories/categories-repository";
import { ReviewRepository } from "../repositories/review-repository";
import type { ResolveReviewItemDto } from "../dto/review-action-dto";

export class ResolveReviewItemService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async execute(userId: string, reviewItemId: string, input: ResolveReviewItemDto) {
    const queueItem = await this.reviewRepository.findReviewQueueItemById(userId, reviewItemId);

    if (!queueItem || queueItem.kind !== "IMPORTED_ENTRY" || !queueItem.importedEntry) {
      throw new AppError("Item de revisão não encontrado.", 404);
    }

    if (queueItem.status !== "OPEN") {
      throw new AppError("Somente itens abertos podem ser aprovados.", 409);
    }

    const accountExists = await this.accountsRepository.existsById(userId, input.accountId);
    if (!accountExists) {
      throw new AppError("Conta financeira inválida.", 404);
    }

    const category = await this.categoriesRepository.findById(userId, input.categoryId);
    if (!category) {
      throw new AppError("Categoria inválida.", 404);
    }

    if (input.subcategoryId) {
      const belongs = await this.categoriesRepository.subcategoryBelongsToCategory(input.subcategoryId, input.categoryId);
      if (!belongs) {
        throw new AppError("A subcategoria não pertence à categoria informada.");
      }
    }

    return this.reviewRepository.resolveImportedEntryToTransaction({
      userId,
      reviewItemId,
      importedEntryId: queueItem.importedEntry.id,
      accountId: input.accountId,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      type: category.kind,
    });
  }
}
