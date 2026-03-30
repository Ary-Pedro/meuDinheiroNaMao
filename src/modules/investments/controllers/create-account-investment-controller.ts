import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { CreateAccountInvestmentService } from "../services/create-account-investment-service";
import { createAccountInvestmentSchema } from "../validations/account-investment-validation";

export class CreateAccountInvestmentController {
  constructor(private readonly createAccountInvestmentService: CreateAccountInvestmentService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createAccountInvestmentSchema.parse(await request.json());
    const investment = await this.createAccountInvestmentService.execute(user.id, payload);
    return { status: 201, body: investment };
  }
}
