import { AccountInvestmentScopeMode, AccountInvestmentType } from "@prisma/client";

export type CreateAccountInvestmentDto = {
  accountId: string;
  name: string;
  investmentType: AccountInvestmentType;
  principalAmount: number;
  currentValue: number;
  incomeAmount: number;
  scopeMode: AccountInvestmentScopeMode;
  startedAt: Date;
  notes?: string;
};

export type UpdateAccountInvestmentDto = CreateAccountInvestmentDto;
