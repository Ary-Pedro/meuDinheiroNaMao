export type InvestmentPositionResponse = {
  id: string;
  assetName: string;
  assetType: string;
  broker: string | null;
  quantity: string;
  averagePrice: string;
  investedValue: string;
  currentValue: string;
  profitLoss: string;
  currency: string;
};

export type InvestmentOperationResponse = {
  id: string;
  type: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  fees: string;
  occurredAt: string;
  asset: {
    id: string;
    tickerOrName: string;
    assetType: string;
    currency: string;
  };
  account: {
    id: string;
    name: string;
  } | null;
};

export type PortfolioHistoryPointResponse = {
  referenceDate: string;
  totalInvested: string;
  totalCurrentValue: string;
  totalProfitLoss: string;
};

export type InvestmentsOverviewResponse = {
  totals: {
    invested: string;
    currentValue: string;
    profitLoss: string;
    positionsCount: number;
    operationsCount: number;
  };
  allocationByType: {
    assetType: string;
    currentValue: string;
    share: number;
  }[];
  topPositions: InvestmentPositionResponse[];
  recentOperations: InvestmentOperationResponse[];
  history: PortfolioHistoryPointResponse[];
};
