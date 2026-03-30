export type SimulationParticipantResponse = {
  id: string;
  name: string;
  expectedContribution: string;
  actualContribution: string;
  gapAmount: string;
};

export type SimulationCostResponse = {
  id: string;
  name: string;
  amount: string;
};

export type SimulationScenarioResponse = {
  id: string;
  name: string;
  description: string | null;
  targetAmount: string | null;
  status: string;
  updatedAt: string;
  totals: {
    expectedContribution: string;
    actualContribution: string;
    totalCosts: string;
    remainingToTarget: string;
    gapToCosts: string;
  };
  participants: SimulationParticipantResponse[];
  costs: SimulationCostResponse[];
  sankey: {
    incomes: { id: string; label: string; value: string }[];
    costs: { id: string; label: string; value: string }[];
    balance: string;
  };
};

export type SimulationsOverviewResponse = {
  totals: {
    scenariosCount: number;
    calculatedCount: number;
    totalTargetAmount: string;
    totalContributions: string;
    totalCosts: string;
  };
  scenarios: SimulationScenarioResponse[];
};
