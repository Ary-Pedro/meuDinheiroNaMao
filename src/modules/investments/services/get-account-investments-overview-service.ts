import { decimalToNumber, decimalToString } from "@/modules/shared/utils/decimal";
import type { AccountInvestmentsOverviewResponse } from "../models/account-investments-types";
import { serializeAccountInvestment } from "../models/serializers";
import { AccountInvestmentsRepository } from "../repositories/account-investments-repository";

export class GetAccountInvestmentsOverviewService {
  constructor(private readonly accountInvestmentsRepository: AccountInvestmentsRepository) {}

  async execute(userId: string): Promise<AccountInvestmentsOverviewResponse> {
    const investments = await this.accountInvestmentsRepository.listByUser(userId);

    const byAccount = new Map<
      string,
      {
        accountId: string;
        accountName: string;
        currency: string;
        principal: number;
        currentValue: number;
        incomeAmount: number;
      }
    >();

    for (const investment of investments) {
      const current =
        byAccount.get(investment.accountId) ?? {
          accountId: investment.accountId,
          accountName: investment.account.name,
          currency: investment.account.currency,
          principal: 0,
          currentValue: 0,
          incomeAmount: 0,
        };

      current.principal += decimalToNumber(investment.principalAmount);
      current.currentValue += decimalToNumber(investment.currentValue);
      current.incomeAmount += decimalToNumber(investment.incomeAmount);
      byAccount.set(investment.accountId, current);
    }

    const principal = investments.reduce((sum, item) => sum + decimalToNumber(item.principalAmount), 0);
    const currentValue = investments.reduce((sum, item) => sum + decimalToNumber(item.currentValue), 0);
    const incomeAmount = investments.reduce((sum, item) => sum + decimalToNumber(item.incomeAmount), 0);

    return {
      totals: {
        principal: decimalToString(principal),
        currentValue: decimalToString(currentValue),
        incomeAmount: decimalToString(incomeAmount),
        activeCount: investments.length,
      },
      byAccount: Array.from(byAccount.values()).map((item) => ({
        ...item,
        principal: decimalToString(item.principal),
        currentValue: decimalToString(item.currentValue),
        incomeAmount: decimalToString(item.incomeAmount),
      })),
      investments: investments.map(serializeAccountInvestment),
    };
  }
}
