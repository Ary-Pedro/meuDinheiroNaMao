import { executeRoute } from "@/server/core/http/execute-route";
import { investmentsComposition } from "@/server/composition/investments";

export async function GET() {
  return executeRoute(() => investmentsComposition.getAccountInvestmentsOverviewController.handle());
}

export async function POST(request: Request) {
  return executeRoute(() => investmentsComposition.createAccountInvestmentController.handle(request));
}
