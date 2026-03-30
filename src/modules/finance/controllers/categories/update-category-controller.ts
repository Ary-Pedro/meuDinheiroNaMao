import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateCategoryService } from "../../services/categories/update-category-service";
import { updateCategorySchema } from "../../validations/category-validation";

export class UpdateCategoryController {
  constructor(private readonly updateCategoryService: UpdateCategoryService) {}

  async handle(request: Request, categoryId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateCategorySchema.parse(await request.json());
    const category = await this.updateCategoryService.execute({ userId: user.id, categoryId, ...payload });
    return { status: 200, body: category };
  }
}
