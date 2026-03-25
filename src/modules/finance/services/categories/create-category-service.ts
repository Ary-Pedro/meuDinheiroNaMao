import type { CreateCategoryDto } from "../../dto/category-dto";
import type { CategoryResponse } from "../../models/finance-types";
import { serializeCategory } from "../../models/serializers";
import { CategoriesRepository } from "../../repositories/categories-repository";

export class CreateCategoryService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(input: CreateCategoryDto & { userId: string }): Promise<CategoryResponse> {
    const category = await this.categoriesRepository.create({
      userId: input.userId,
      name: input.name.trim(),
      kind: input.kind,
      subcategories: input.subcategories?.map((sub) => sub.trim()).filter(Boolean),
    });

    return serializeCategory(category);
  }
}
