export type AccountInvestmentResponse = {
  id: string;
  name: string;
  investmentType: string;
  principalAmount: string;
  currentValue: string;
  incomeAmount: string;
  scopeMode: string;
  startedAt: string;
  notes: string | null;
  account: {
    id: string;
    name: string;
    currency: string;
  };
};

export type AccountInvestmentsOverviewResponse = {
  totals: {
    principal: string;
    currentValue: string;
    incomeAmount: string;
    activeCount: number;
  };
  byAccount: {
    accountId: string;
    accountName: string;
    currency: string;
    principal: string;
    currentValue: string;
    incomeAmount: string;
  }[];
  investments: AccountInvestmentResponse[];
};
