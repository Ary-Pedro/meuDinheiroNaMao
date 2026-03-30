import type { CreateSimulationScenarioDto } from "../dto/simulation-scenario-dto";
import type { SimulationScenarioResponse } from "../models/simulations-types";
import { GetSimulationsOverviewService } from "./get-simulations-overview-service";
import { SimulationsRepository } from "../repositories/simulations-repository";

export class CreateSimulationScenarioService {
  constructor(
    private readonly simulationsRepository: SimulationsRepository,
    private readonly getSimulationsOverviewService: GetSimulationsOverviewService
  ) {}

  async execute(userId: string, input: CreateSimulationScenarioDto): Promise<SimulationScenarioResponse> {
    const scenario = await this.simulationsRepository.create(userId, input);
    const overview = await this.getSimulationsOverviewService.execute(userId);
    return overview.scenarios.find((item) => item.id === scenario.id)!;
  }
}
