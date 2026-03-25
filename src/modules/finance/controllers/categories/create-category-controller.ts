import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { createCategorySchema } from "../../validations/category-validation";
import { CreateCategoryService } from "../../services/categories/create-category-service";

export class CreateCategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createCategorySchema.parse(await request.json());
    const category = await this.createCategoryService.execute({ userId: user.id, ...payload });
    return { status: 201, body: category };
  }
}
