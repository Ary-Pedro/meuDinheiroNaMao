import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteSimulationScenarioService } from "../services/delete-simulation-scenario-service";

export class DeleteSimulationScenarioController {
  constructor(private readonly deleteSimulationScenarioService: DeleteSimulationScenarioService) {}

  async handle(scenarioId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteSimulationScenarioService.execute(user.id, scenarioId);
    return { status: 200, body: result };
  }
}
