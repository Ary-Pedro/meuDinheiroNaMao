import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { GetSimulationsOverviewService } from "../services/get-simulations-overview-service";

export class GetSimulationsOverviewController {
  constructor(private readonly getSimulationsOverviewService: GetSimulationsOverviewService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const overview = await this.getSimulationsOverviewService.execute(user.id);
    return { status: 200, body: overview };
  }
}
