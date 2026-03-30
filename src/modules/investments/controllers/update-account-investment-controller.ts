import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateAccountInvestmentService } from "../services/update-account-investment-service";
import { updateAccountInvestmentSchema } from "../validations/account-investment-validation";

export class UpdateAccountInvestmentController {
  constructor(private readonly updateAccountInvestmentService: UpdateAccountInvestmentService) {}

  async handle(request: Request, investmentId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateAccountInvestmentSchema.parse(await request.json());
    const investment = await this.updateAccountInvestmentService.execute(user.id, investmentId, payload);
    return { status: 200, body: investment };
  }
}
