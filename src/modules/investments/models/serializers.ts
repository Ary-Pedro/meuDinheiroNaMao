import type { AccountInvestment } from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type { AccountInvestmentResponse } from "./account-investments-types";

type InvestmentWithAccount = AccountInvestment & {
  account: {
    id: string;
    name: string;
    currency: string;
  };
};

export function serializeAccountInvestment(investment: InvestmentWithAccount): AccountInvestmentResponse {
  return {
    id: investment.id,
    name: investment.name,
    investmentType: investment.investmentType,
    principalAmount: decimalToString(investment.principalAmount),
    currentValue: decimalToString(investment.currentValue),
    incomeAmount: decimalToString(investment.incomeAmount),
    scopeMode: investment.scopeMode,
    startedAt: investment.startedAt.toISOString(),
    notes: investment.notes,
    account: investment.account,
  };
}
