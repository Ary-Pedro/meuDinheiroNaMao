import { AppError } from "@/server/core/errors/app-error";
import { CategoriesRepository } from "../../repositories/categories-repository";

export class DeleteCategoryService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(userId: string, categoryId: string) {
    const existing = await this.categoriesRepository.findById(userId, categoryId);

    if (!existing) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    const result = await this.categoriesRepository.deleteById(userId, categoryId);

    if (result.blocked) {
      throw new AppError("Não é possível excluir uma categoria já usada por transações/importações.", 409);
    }

    return { ok: true };
  }
}
