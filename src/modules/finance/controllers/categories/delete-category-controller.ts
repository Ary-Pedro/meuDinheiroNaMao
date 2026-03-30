import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteCategoryService } from "../../services/categories/delete-category-service";

export class DeleteCategoryController {
  constructor(private readonly deleteCategoryService: DeleteCategoryService) {}

  async handle(categoryId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteCategoryService.execute(user.id, categoryId);
    return { status: 200, body: result };
  }
}
