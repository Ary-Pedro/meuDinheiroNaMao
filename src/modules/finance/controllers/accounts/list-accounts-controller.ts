import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { ListAccountsService } from "../../services/accounts/list-accounts-service";

export class ListAccountsController {
  constructor(private readonly listAccountsService: ListAccountsService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const accounts = await this.listAccountsService.execute(user.id);
    return { status: 200, body: accounts };
  }
}
