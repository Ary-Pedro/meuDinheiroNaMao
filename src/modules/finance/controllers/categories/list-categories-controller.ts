import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { ListCategoriesService } from "../../services/categories/list-categories-service";

export class ListCategoriesController {
  constructor(private readonly listCategoriesService: ListCategoriesService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const categories = await this.listCategoriesService.execute(user.id);
    return { status: 200, body: categories };
  }
}
