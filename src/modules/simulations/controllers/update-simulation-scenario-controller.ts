import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateSimulationScenarioService } from "../services/update-simulation-scenario-service";
import { updateSimulationScenarioSchema } from "../validations/simulation-scenario-validation";

export class UpdateSimulationScenarioController {
  constructor(private readonly updateSimulationScenarioService: UpdateSimulationScenarioService) {}

  async handle(request: Request, scenarioId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateSimulationScenarioSchema.parse(await request.json());
    const scenario = await this.updateSimulationScenarioService.execute(user.id, scenarioId, payload);
    return { status: 200, body: scenario };
  }
}
