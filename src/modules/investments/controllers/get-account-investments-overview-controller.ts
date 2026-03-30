import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { GetAccountInvestmentsOverviewService } from "../services/get-account-investments-overview-service";

export class GetAccountInvestmentsOverviewController {
  constructor(private readonly getAccountInvestmentsOverviewService: GetAccountInvestmentsOverviewService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const overview = await this.getAccountInvestmentsOverviewService.execute(user.id);
    return { status: 200, body: overview };
  }
}
