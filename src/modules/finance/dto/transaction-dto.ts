import { TransactionSource, TransactionStatus, TransactionType } from "@prisma/client";

export type CreateTransactionDto = {
  accountId: string;
  categoryId: string;
  subcategoryId?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  occurredAt: Date;
  source?: TransactionSource;
  status?: TransactionStatus;
};

export type ListTransactionsFilters = {
  from?: Date;
  to?: Date;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
};
