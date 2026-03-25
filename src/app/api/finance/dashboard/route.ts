import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

export async function GET(request: Request) {
  return executeRoute(() => financeComposition.getFinanceDashboardController.handle(new URL(request.url)));
}
