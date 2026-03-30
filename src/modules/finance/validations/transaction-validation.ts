import { TransactionSource, TransactionStatus, TransactionType } from "@prisma/client";
import { z } from "zod";

const optionalSubcategorySchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();
  return normalized.length ? normalized : undefined;
}, z.string().optional());

export const createTransactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  subcategoryId: optionalSubcategorySchema,
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
  amountNative: z.coerce.number().positive(),
  description: z.string().optional(),
  occurredAt: z.coerce.date(),
  source: z.nativeEnum(TransactionSource).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
});

export const updateTransactionSchema = createTransactionSchema;

export const createTransferSchema = z.object({
  sourceAccountId: z.string().min(1),
  destinationAccountId: z.string().min(1),
  sourceAmountNative: z.coerce.number().positive(),
  description: z.string().optional(),
  occurredAt: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateTransferSchema = createTransferSchema;

export const listTransactionsFiltersSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]).optional(),
});

export const dashboardFiltersSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
