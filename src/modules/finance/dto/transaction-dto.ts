import { TransactionSource, TransactionStatus, TransactionType } from "@prisma/client";

export type CreateTransactionDto = {
  accountId: string;
  categoryId: string;
  subcategoryId?: string;
  type: Exclude<TransactionType, "TRANSFER">;
  amountNative: number;
  description?: string;
  occurredAt: Date;
  source?: TransactionSource;
  status?: TransactionStatus;
};

export type UpdateTransactionDto = CreateTransactionDto;

export type CreateTransferDto = {
  sourceAccountId: string;
  destinationAccountId: string;
  sourceAmountNative: number;
  description?: string;
  occurredAt: Date;
  notes?: string;
};

export type UpdateTransferDto = CreateTransferDto;

export type ListTransactionsFilters = {
  from?: Date;
  to?: Date;
  accountId?: string;
  categoryId?: string;
  type?: Exclude<TransactionType, "TRANSFER">;
};
