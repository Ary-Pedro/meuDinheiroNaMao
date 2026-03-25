import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { dashboardFiltersSchema } from "../../validations/transaction-validation";
import { GetFinanceDashboardService } from "../../services/dashboard/get-finance-dashboard-service";

export class GetFinanceDashboardController {
  constructor(private readonly getFinanceDashboardService: GetFinanceDashboardService) {}

  async handle(url: URL): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const filters = dashboardFiltersSchema.parse(Object.fromEntries(url.searchParams.entries()));
    const dashboard = await this.getFinanceDashboardService.execute(user.id, filters);
    return { status: 200, body: dashboard };
  }
}
