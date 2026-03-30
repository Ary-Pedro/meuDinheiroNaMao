import { AppError } from "@/server/core/errors/app-error";
import type { UpdateCategoryDto } from "../../dto/category-dto";
import type { CategoryResponse } from "../../models/finance-types";
import { serializeCategory } from "../../models/serializers";
import { CategoriesRepository } from "../../repositories/categories-repository";

export class UpdateCategoryService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(input: UpdateCategoryDto & { userId: string; categoryId: string }): Promise<CategoryResponse> {
    const existing = await this.categoriesRepository.findById(input.userId, input.categoryId);

    if (!existing) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    try {
      const category = await this.categoriesRepository.update({
        userId: input.userId,
        categoryId: input.categoryId,
        name: input.name.trim(),
        kind: input.kind,
        subcategories: input.subcategories?.map((sub) => sub.trim()).filter(Boolean),
      });

      if (!category) {
        throw new AppError("Categoria não encontrada.", 404);
      }

      return serializeCategory(category);
    } catch (error) {
      if (error instanceof Error && error.message === "SUBCATEGORY_IN_USE") {
        throw new AppError("Não é possível remover subcategorias já utilizadas em transações.");
      }

      if (error instanceof Error && error.message === "CATEGORY_KIND_IN_USE") {
        throw new AppError("Não é possível trocar o tipo de uma categoria já usada em transações.");
      }

      throw error;
    }
  }
}
