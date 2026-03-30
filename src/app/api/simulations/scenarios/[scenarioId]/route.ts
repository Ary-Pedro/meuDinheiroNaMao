import { executeRoute } from "@/server/core/http/execute-route";
import { simulationsComposition } from "@/server/composition/simulations";

type Params = {
  scenarioId: string;
};

export async function PATCH(request: Request, { params }: { params: Promise<Params> }) {
  const { scenarioId } = await params;
  return executeRoute(() => simulationsComposition.updateSimulationScenarioController.handle(request, scenarioId));
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const { scenarioId } = await params;
  return executeRoute(() => simulationsComposition.deleteSimulationScenarioController.handle(scenarioId));
}
