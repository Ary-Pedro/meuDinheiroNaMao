import { executeRoute } from "@/server/core/http/execute-route";
import { reviewComposition } from "@/server/composition/review";

type Params = {
  params: Promise<{
    reviewItemId: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { reviewItemId } = await params;
  return executeRoute(() => reviewComposition.updateReviewQueueItemController.handle(request, reviewItemId));
}
