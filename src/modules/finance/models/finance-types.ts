export type AccountResponse = {
  id: string;
  name: string;
  type: string;
  institution: string | null;
  currency: string;
  initialBalance: string;
  availableBalance: string;
  investedBalance: string;
  totalBalance: string;
  consolidatedBalanceBrl: string;
  incomesTotal: string;
  expensesTotal: string;
  transferInTotal: string;
  transferOutTotal: string;
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
  amountNative: string;
  currency: string;
  amountBrlSnapshot: string;
  description: string | null;
  occurredAt: string;
  source: string;
  status: string;
  fxRateApplied: string | null;
  fxReferenceAt: string | null;
  transferGroupId: string | null;
  transferDirection: string | null;
  account: { id: string; name: string; currency: string };
  category: { id: string; name: string; kind: string } | null;
  subcategory: { id: string; name: string } | null;
};

export type TransferResponse = {
  id: string;
  occurredAt: string;
  description: string | null;
  notes: string | null;
  fxRateApplied: string | null;
  fxReferenceAt: string | null;
  sourceAccount: { id: string; name: string; currency: string };
  destinationAccount: { id: string; name: string; currency: string };
  sourceAmountNative: string;
  destinationAmountNative: string;
  sourceAmountBrlSnapshot: string;
  destinationAmountBrlSnapshot: string;
};

export type SankeyNode = {
  id: string;
  label: string;
  value: string;
  tone?: "income" | "expense" | "balance";
};

export type SankeyLink = {
  id: string;
  from: string;
  to: string;
  value: string;
  tone?: "income" | "expense" | "balance";
};

export type FinanceDashboardResponse = {
  period: {
    from: string;
    to: string;
  };
  totals: {
    balanceBrl: string;
    incomesBrl: string;
    expensesBrl: string;
    transferVolumeBrl: string;
    transactionCount: number;
    transferCount: number;
  };
  accounts: {
    accountId: string;
    accountName: string;
    currency: string;
    availableBalance: string;
    investedBalance: string;
    totalBalance: string;
    consolidatedBalanceBrl: string;
  }[];
  latestTransactions: TransactionResponse[];
  latestTransfers: TransferResponse[];
  sankey: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
};
