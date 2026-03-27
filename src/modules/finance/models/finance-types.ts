export type AccountResponse = {
  id: string;
  name: string;
  type: string;
  institution: string | null;
  currency: string;
  initialBalance: string;
  currentBalance: string;
  incomesTotal: string;
  expensesTotal: string;
  transferTotal: string;
  transactionCount: number;
  lastTransactionAt: string | null;
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
  account: { id: string; name: string; currency: string };
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
  topActiveAccounts: {
    accountId: string;
    accountName: string;
    transactionCount: number;
    incomesTotal: string;
    expensesTotal: string;
    netTotal: string;
  }[];
  latestTransactions: TransactionResponse[];
};
