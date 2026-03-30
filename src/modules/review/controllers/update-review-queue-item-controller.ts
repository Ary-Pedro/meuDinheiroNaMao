import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DismissReviewItemService } from "../services/dismiss-review-item-service";
import { ResolveReviewItemService } from "../services/resolve-review-item-service";
import { reviewQueueActionSchema } from "../validations/review-validation";

export class UpdateReviewQueueItemController {
  constructor(
    private readonly resolveReviewItemService: ResolveReviewItemService,
    private readonly dismissReviewItemService: DismissReviewItemService
  ) {}

  async handle(request: Request, reviewItemId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = reviewQueueActionSchema.parse(await request.json());

    if (payload.action === "resolve") {
      const result = await this.resolveReviewItemService.execute(user.id, reviewItemId, payload);
      return { status: 200, body: result };
    }

    const result = await this.dismissReviewItemService.execute(user.id, reviewItemId, payload);
    return { status: 200, body: result };
  }
}
