export type SimulationParticipantInputDto = {
  name: string;
  expectedContribution: number;
  actualContribution: number;
};

export type SimulationCostInputDto = {
  name: string;
  amount: number;
};

export type CreateSimulationScenarioDto = {
  name: string;
  description?: string;
  targetAmount?: number;
  participants: SimulationParticipantInputDto[];
  costs: SimulationCostInputDto[];
};

export type UpdateSimulationScenarioDto = CreateSimulationScenarioDto;
