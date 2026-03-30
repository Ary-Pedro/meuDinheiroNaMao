import { AppError } from "@/server/core/errors/app-error";
import type { UpdateSimulationScenarioDto } from "../dto/simulation-scenario-dto";
import type { SimulationScenarioResponse } from "../models/simulations-types";
import { SimulationsRepository } from "../repositories/simulations-repository";
import { GetSimulationsOverviewService } from "./get-simulations-overview-service";

export class UpdateSimulationScenarioService {
  constructor(
    private readonly simulationsRepository: SimulationsRepository,
    private readonly getSimulationsOverviewService: GetSimulationsOverviewService
  ) {}

  async execute(userId: string, scenarioId: string, input: UpdateSimulationScenarioDto): Promise<SimulationScenarioResponse> {
    const existing = await this.simulationsRepository.findById(userId, scenarioId);
    if (!existing) {
      throw new AppError("Simulação não encontrada.", 404);
    }

    await this.simulationsRepository.update(userId, scenarioId, input);
    const overview = await this.getSimulationsOverviewService.execute(userId);
    return overview.scenarios.find((item) => item.id === scenarioId)!;
  }
}
