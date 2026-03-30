import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateAccountService } from "../../services/accounts/update-account-service";
import { updateAccountSchema } from "../../validations/account-validation";

export class UpdateAccountController {
  constructor(private readonly updateAccountService: UpdateAccountService) {}

  async handle(request: Request, accountId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateAccountSchema.parse(await request.json());
    const account = await this.updateAccountService.execute({ userId: user.id, accountId, ...payload });
    return { status: 200, body: account };
  }
}
