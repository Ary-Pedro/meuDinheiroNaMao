import { decimalToNumber, decimalToString } from "@/modules/shared/utils/decimal";
import type { SimulationsOverviewResponse } from "../models/simulations-types";
import { SimulationsRepository } from "../repositories/simulations-repository";

export class GetSimulationsOverviewService {
  constructor(private readonly simulationsRepository: SimulationsRepository) {}

  async execute(userId: string): Promise<SimulationsOverviewResponse> {
    const scenarios = await this.simulationsRepository.listByUser(userId);

    const parsed = scenarios.map((scenario) => {
      const expectedContribution = scenario.participants.reduce(
        (sum, participant) => sum + decimalToNumber(participant.expectedContribution),
        0
      );
      const actualContribution = scenario.participants.reduce(
        (sum, participant) => sum + decimalToNumber(participant.actualContribution),
        0
      );
      const totalCosts = scenario.costs.reduce((sum, cost) => sum + decimalToNumber(cost.amount), 0);
      const targetAmount = scenario.targetAmount ? decimalToNumber(scenario.targetAmount) : totalCosts;
      const remainingToTarget = Math.max(targetAmount - actualContribution, 0);
      const gapToCosts = actualContribution - totalCosts;

      return {
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        targetAmount: scenario.targetAmount ? decimalToString(scenario.targetAmount) : null,
        status: scenario.status,
        updatedAt: scenario.updatedAt.toISOString(),
        totals: {
          expectedContribution: decimalToString(expectedContribution),
          actualContribution: decimalToString(actualContribution),
          totalCosts: decimalToString(totalCosts),
          remainingToTarget: decimalToString(remainingToTarget),
          gapToCosts: decimalToString(gapToCosts),
        },
        participants: scenario.participants.map((participant) => ({
          id: participant.id,
          name: participant.name,
          expectedContribution: decimalToString(participant.expectedContribution),
          actualContribution: decimalToString(participant.actualContribution),
          gapAmount: decimalToString(
            decimalToNumber(participant.expectedContribution) - decimalToNumber(participant.actualContribution)
          ),
        })),
        costs: scenario.costs.map((cost) => ({
          id: cost.id,
          name: cost.name,
          amount: decimalToString(cost.amount),
        })),
        sankey: {
          incomes: scenario.participants.map((participant) => ({
            id: participant.id,
            label: participant.name,
            value: decimalToString(participant.actualContribution),
          })),
          costs: scenario.costs.map((cost) => ({
            id: cost.id,
            label: cost.name,
            value: decimalToString(cost.amount),
          })),
          balance: decimalToString(Math.max(actualContribution - totalCosts, 0)),
        },
      };
    });

    return {
      totals: {
        scenariosCount: parsed.length,
        calculatedCount: parsed.filter((scenario) => scenario.status === "CALCULATED").length,
        totalTargetAmount: decimalToString(
          parsed.reduce((sum, scenario) => sum + Number(scenario.targetAmount ?? scenario.totals.totalCosts), 0)
        ),
        totalContributions: decimalToString(
          parsed.reduce((sum, scenario) => sum + Number(scenario.totals.actualContribution), 0)
        ),
        totalCosts: decimalToString(parsed.reduce((sum, scenario) => sum + Number(scenario.totals.totalCosts), 0)),
      },
      scenarios: parsed,
    };
  }
}
