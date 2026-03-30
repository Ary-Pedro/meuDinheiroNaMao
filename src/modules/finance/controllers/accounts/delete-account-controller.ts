import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteAccountService } from "../../services/accounts/delete-account-service";

export class DeleteAccountController {
  constructor(private readonly deleteAccountService: DeleteAccountService) {}

  async handle(accountId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteAccountService.execute(user.id, accountId);
    return { status: 200, body: result };
  }
}
