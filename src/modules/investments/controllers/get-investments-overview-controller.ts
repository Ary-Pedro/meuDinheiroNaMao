import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { GetInvestmentsOverviewService } from "../services/get-investments-overview-service";

export class GetInvestmentsOverviewController {
  constructor(private readonly getInvestmentsOverviewService: GetInvestmentsOverviewService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const overview = await this.getInvestmentsOverviewService.execute(user.id);
    return { status: 200, body: overview };
  }
}
