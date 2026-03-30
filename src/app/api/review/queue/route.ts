import { executeRoute } from "@/server/core/http/execute-route";
import { reviewComposition } from "@/server/composition/review";

export async function GET() {
  return executeRoute(() => reviewComposition.getReviewOverviewController.handle());
}
