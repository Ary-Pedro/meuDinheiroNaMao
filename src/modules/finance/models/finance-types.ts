export type AccountResponse = {
  id: string;
  name: string;
  type: string;
  institution: string | null;
  currency: string;
  initialBalance: string;
  isArchived: boolean;
};

export type CategoryResponse = {
  id: string;
  name: string;
  kind: string;
  subcategories: { id: string; name: string }[];
};

export type TransactionResponse = {
  id: string;
  type: string;
  amount: string;
  description: string | null;
  occurredAt: string;
  source: string;
  status: string;
  account: { id: string; name: string };
  category: { id: string; name: string; kind: string };
  subcategory: { id: string; name: string } | null;
};

export type FinanceDashboardResponse = {
  period: {
    from: string;
    to: string;
  };
  totals: {
    balance: string;
    incomes: string;
    expenses: string;
    transfer: string;
    transactionCount: number;
  };
  latestTransactions: TransactionResponse[];
};
