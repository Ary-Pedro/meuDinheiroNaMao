import { TransactionStatus, TransactionSource, TransactionType } from "@prisma/client";
import { z } from "zod";

export const createTransactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional(),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  occurredAt: z.coerce.date(),
  source: z.nativeEnum(TransactionSource).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
});

export const listTransactionsFiltersSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
});

export const dashboardFiltersSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
