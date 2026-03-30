import { AppError } from "@/server/core/errors/app-error";
import { SimulationsRepository } from "../repositories/simulations-repository";

export class DeleteSimulationScenarioService {
  constructor(private readonly simulationsRepository: SimulationsRepository) {}

  async execute(userId: string, scenarioId: string) {
    const existing = await this.simulationsRepository.findById(userId, scenarioId);
    if (!existing) {
      throw new AppError("Simulação não encontrada.", 404);
    }

    await this.simulationsRepository.deleteById(userId, scenarioId);
    return { ok: true };
  }
}
