import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { GetReviewOverviewService } from "../services/get-review-overview-service";

export class GetReviewOverviewController {
  constructor(private readonly getReviewOverviewService: GetReviewOverviewService) {}

  async handle(): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const overview = await this.getReviewOverviewService.execute(user.id);
    return { status: 200, body: overview };
  }
}
