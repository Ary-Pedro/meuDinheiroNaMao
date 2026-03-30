import type {
  Category,
  FinancialAccount,
  Subcategory,
  Transaction,
  TransferGroup,
} from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type {
  AccountResponse,
  FinanceDashboardResponse,
  TransactionResponse,
  TransferResponse,
} from "./finance-types";

export type AccountSummaryInput = {
  availableBalance: string;
  investedBalance: string;
  totalBalance: string;
  consolidatedBalanceBrl: string;
  incomesTotal: string;
  expensesTotal: string;
  transferInTotal: string;
  transferOutTotal: string;
  transactionCount: number;
  lastTransactionAt: Date | null;
};

type TransactionWithRelations = Transaction & {
  account: Pick<FinancialAccount, "id" | "name" | "currency">;
  category: Pick<Category, "id" | "name" | "kind"> | null;
  subcategory: Pick<Subcategory, "id" | "name"> | null;
};

type TransferGroupWithRelations = TransferGroup & {
  sourceAccount: Pick<FinancialAccount, "id" | "name" | "currency">;
  destinationAccount: Pick<FinancialAccount, "id" | "name" | "currency">;
};

export function serializeAccount(account: FinancialAccount, summary?: AccountSummaryInput): AccountResponse {
  const resolvedSummary =
    summary ??
    {
      availableBalance: decimalToString(account.initialBalance),
      investedBalance: decimalToString(0),
      totalBalance: decimalToString(account.initialBalance),
      consolidatedBalanceBrl: decimalToString(account.initialBalance),
      incomesTotal: decimalToString(0),
      expensesTotal: decimalToString(0),
      transferInTotal: decimalToString(0),
      transferOutTotal: decimalToString(0),
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
    availableBalance: resolvedSummary.availableBalance,
    investedBalance: resolvedSummary.investedBalance,
    totalBalance: resolvedSummary.totalBalance,
    consolidatedBalanceBrl: resolvedSummary.consolidatedBalanceBrl,
    incomesTotal: resolvedSummary.incomesTotal,
    expensesTotal: resolvedSummary.expensesTotal,
    transferInTotal: resolvedSummary.transferInTotal,
    transferOutTotal: resolvedSummary.transferOutTotal,
    transactionCount: resolvedSummary.transactionCount,
    lastTransactionAt: resolvedSummary.lastTransactionAt ? resolvedSummary.lastTransactionAt.toISOString() : null,
    isArchived: account.isArchived,
  };
}

export function serializeCategory(
  category: Category & { subcategories: Pick<Subcategory, "id" | "name">[] }
) {
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
    amountNative: decimalToString(transaction.amountNative),
    currency: transaction.currency,
    amountBrlSnapshot: decimalToString(transaction.amountBrlSnapshot),
    description: transaction.description,
    occurredAt: transaction.occurredAt.toISOString(),
    source: transaction.source,
    status: transaction.status,
    fxRateApplied: transaction.fxRateApplied ? decimalToString(transaction.fxRateApplied) : null,
    fxReferenceAt: transaction.fxReferenceAt ? transaction.fxReferenceAt.toISOString() : null,
    transferGroupId: transaction.transferGroupId,
    transferDirection: transaction.transferDirection,
    account: transaction.account,
    category: transaction.category,
    subcategory: transaction.subcategory,
  };
}

export function serializeTransfer(group: TransferGroupWithRelations): TransferResponse {
  return {
    id: group.id,
    occurredAt: group.occurredAt.toISOString(),
    description: group.description,
    notes: group.notes,
    fxRateApplied: group.fxRateApplied ? decimalToString(group.fxRateApplied) : null,
    fxReferenceAt: group.fxReferenceAt ? group.fxReferenceAt.toISOString() : null,
    sourceAccount: group.sourceAccount,
    destinationAccount: group.destinationAccount,
    sourceAmountNative: decimalToString(group.sourceAmountNative),
    destinationAmountNative: decimalToString(group.destinationAmountNative),
    sourceAmountBrlSnapshot: decimalToString(group.sourceAmountBrlSnapshot),
    destinationAmountBrlSnapshot: decimalToString(group.destinationAmountBrlSnapshot),
  };
}

export function buildDashboardResponse(input: FinanceDashboardResponse): FinanceDashboardResponse {
  return input;
}
