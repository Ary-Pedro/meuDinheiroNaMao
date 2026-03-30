import { executeRoute } from "@/server/core/http/execute-route";
import { simulationsComposition } from "@/server/composition/simulations";

export async function GET() {
  return executeRoute(() => simulationsComposition.getSimulationsOverviewController.handle());
}

export async function POST(request: Request) {
  return executeRoute(() => simulationsComposition.createSimulationScenarioController.handle(request));
}
