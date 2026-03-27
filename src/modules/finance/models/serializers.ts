import type {
  Category,
  FinancialAccount,
  Subcategory,
  Transaction,
} from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type {
  AccountResponse,
  CategoryResponse,
  FinanceDashboardResponse,
  TransactionResponse,
} from "./finance-types";

export type AccountSummaryInput = {
  currentBalance: string;
  incomesTotal: string;
  expensesTotal: string;
  transferTotal: string;
  transactionCount: number;
  lastTransactionAt: Date | null;
};

type TransactionWithRelations = Transaction & {
  account: Pick<FinancialAccount, "id" | "name">;
  category: Pick<Category, "id" | "name" | "kind">;
  subcategory: Pick<Subcategory, "id" | "name"> | null;
};

export function serializeAccount(
  account: FinancialAccount,
  summary?: AccountSummaryInput
): AccountResponse {
  const resolvedSummary =
    summary ??
    {
      currentBalance: decimalToString(account.initialBalance),
      incomesTotal: decimalToString(0),
      expensesTotal: decimalToString(0),
      transferTotal: decimalToString(0),
      transactionCount: 0,
      lastTransactionAt: null,
    };

  return {
    id: account.id,
    name: account.name,
    type: account.type,
    institution: account.institution,
    currency: account.currency,
    initialBalance: decimalToString(account.initialBalance),
    currentBalance: resolvedSummary.currentBalance,
    incomesTotal: resolvedSummary.incomesTotal,
    expensesTotal: resolvedSummary.expensesTotal,
    transferTotal: resolvedSummary.transferTotal,
    transactionCount: resolvedSummary.transactionCount,
    lastTransactionAt: resolvedSummary.lastTransactionAt ? resolvedSummary.lastTransactionAt.toISOString() : null,
    isArchived: account.isArchived,
  };
}

export function serializeCategory(
  category: Category & { subcategories: Pick<Subcategory, "id" | "name">[] }
): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    kind: category.kind,
    subcategories: category.subcategories,
  };
}

export function serializeTransaction(transaction: TransactionWithRelations): TransactionResponse {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: decimalToString(transaction.amount),
    description: transaction.description,
    occurredAt: transaction.occurredAt.toISOString(),
    source: transaction.source,
    status: transaction.status,
    account: transaction.account,
    category: transaction.category,
    subcategory: transaction.subcategory,
  };
}

export function buildDashboardResponse(input: {
  from: Date;
  to: Date;
  incomes: string;
  expenses: string;
  transfer: string;
  balance: string;
  transactionCount: number;
  topTransferAccounts: {
    accountId: string;
    accountName: string;
    transferCount: number;
    transferTotal: string;
  }[];
  latestTransactions: TransactionResponse[];
}): FinanceDashboardResponse {
  return {
    period: {
      from: input.from.toISOString(),
      to: input.to.toISOString(),
    },
    totals: {
      balance: input.balance,
      incomes: input.incomes,
      expenses: input.expenses,
      transfer: input.transfer,
      transactionCount: input.transactionCount,
    },
    topTransferAccounts: input.topTransferAccounts,
    latestTransactions: input.latestTransactions,
  };
}
