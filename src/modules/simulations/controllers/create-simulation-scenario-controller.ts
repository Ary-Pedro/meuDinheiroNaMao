import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { CreateSimulationScenarioService } from "../services/create-simulation-scenario-service";
import { createSimulationScenarioSchema } from "../validations/simulation-scenario-validation";

export class CreateSimulationScenarioController {
  constructor(private readonly createSimulationScenarioService: CreateSimulationScenarioService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createSimulationScenarioSchema.parse(await request.json());
    const scenario = await this.createSimulationScenarioService.execute(user.id, payload);
    return { status: 201, body: scenario };
  }
}
