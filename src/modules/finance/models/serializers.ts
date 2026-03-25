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

type TransactionWithRelations = Transaction & {
  account: Pick<FinancialAccount, "id" | "name">;
  category: Pick<Category, "id" | "name" | "kind">;
  subcategory: Pick<Subcategory, "id" | "name"> | null;
};

export function serializeAccount(account: FinancialAccount): AccountResponse {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    institution: account.institution,
    currency: account.currency,
    initialBalance: decimalToString(account.initialBalance),
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
    latestTransactions: input.latestTransactions,
  };
}
