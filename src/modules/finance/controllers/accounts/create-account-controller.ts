import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { createAccountSchema } from "../../validations/account-validation";
import { CreateAccountService } from "../../services/accounts/create-account-service";

export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createAccountSchema.parse(await request.json());
    const account = await this.createAccountService.execute({ userId: user.id, ...payload });
    return { status: 201, body: account };
  }
}
