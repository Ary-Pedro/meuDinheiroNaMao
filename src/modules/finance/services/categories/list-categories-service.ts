import type { CategoryResponse } from "../../models/finance-types";
import { serializeCategory } from "../../models/serializers";
import { CategoriesRepository } from "../../repositories/categories-repository";

export class ListCategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(userId: string): Promise<CategoryResponse[]> {
    const categories = await this.categoriesRepository.listByUser(userId);
    return categories.map(serializeCategory);
  }
}
