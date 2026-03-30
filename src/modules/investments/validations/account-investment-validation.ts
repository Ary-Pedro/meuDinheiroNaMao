import { AccountInvestmentScopeMode, AccountInvestmentType } from "@prisma/client";
import { z } from "zod";

export const createAccountInvestmentSchema = z.object({
  accountId: z.string().min(1),
  name: z.string().min(1),
  investmentType: z.nativeEnum(AccountInvestmentType),
  principalAmount: z.coerce.number().nonnegative(),
  currentValue: z.coerce.number().nonnegative(),
  incomeAmount: z.coerce.number(),
  scopeMode: z.nativeEnum(AccountInvestmentScopeMode),
  startedAt: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateAccountInvestmentSchema = createAccountInvestmentSchema;
