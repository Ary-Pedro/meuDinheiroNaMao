import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteAccountInvestmentService } from "../services/delete-account-investment-service";

export class DeleteAccountInvestmentController {
  constructor(private readonly deleteAccountInvestmentService: DeleteAccountInvestmentService) {}

  async handle(investmentId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteAccountInvestmentService.execute(user.id, investmentId);
    return { status: 200, body: result };
  }
}
