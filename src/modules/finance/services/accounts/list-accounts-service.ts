import { Prisma, TransferDirection, TransactionType } from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type { AccountResponse } from "../../models/finance-types";
import { serializeAccount } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";
import { TransactionsRepository } from "../../repositories/transactions-repository";
import { AccountInvestmentsRepository } from "@/modules/investments/repositories/account-investments-repository";
import { convertAmount, getRatesInBrl, normalizeCurrency } from "../exchange-rates/exchange-rate-provider";

export class ListAccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountInvestmentsRepository: AccountInvestmentsRepository
  ) {}

  async execute(userId: string): Promise<AccountResponse[]> {
    const [accounts, transactions, accountInvestments, currentQuote] = await Promise.all([
      this.accountsRepository.listByUser(userId),
      this.transactionsRepository.listForAccountSummary(userId),
      this.accountInvestmentsRepository.listByUser(userId),
      getRatesInBrl(),
    ]);

    const accountSummaryMap = new Map<
      string,
      {
        incomes: Prisma.Decimal;
        expenses: Prisma.Decimal;
        transferIn: Prisma.Decimal;
        transferOut: Prisma.Decimal;
        transactionCount: number;
        lastTransactionAt: Date | null;
      }
    >();

    for (const transaction of transactions) {
      const existing =
        accountSummaryMap.get(transaction.accountId) ?? {
          incomes: new Prisma.Decimal(0),
          expenses: new Prisma.Decimal(0),
          transferIn: new Prisma.Decimal(0),
          transferOut: new Prisma.Decimal(0),
          transactionCount: 0,
          lastTransactionAt: null,
        };

      const amount = new Prisma.Decimal(transaction.amountNative);

      if (transaction.type === TransactionType.INCOME) {
        existing.incomes = existing.incomes.plus(amount);
      } else if (transaction.type === TransactionType.EXPENSE) {
        existing.expenses = existing.expenses.plus(amount);
      } else if (transaction.transferDirection === TransferDirection.IN) {
        existing.transferIn = existing.transferIn.plus(amount);
      } else {
        existing.transferOut = existing.transferOut.plus(amount);
      }

      existing.transactionCount += 1;
      if (!existing.lastTransactionAt || transaction.occurredAt > existing.lastTransactionAt) {
        existing.lastTransactionAt = transaction.occurredAt;
      }

      accountSummaryMap.set(transaction.accountId, existing);
    }

    const investmentByAccount = new Map<
      string,
      {
        principal: Prisma.Decimal;
        current: Prisma.Decimal;
      }
    >();

    for (const investment of accountInvestments) {
      const existing =
        investmentByAccount.get(investment.accountId) ?? {
          principal: new Prisma.Decimal(0),
          current: new Prisma.Decimal(0),
        };

      existing.principal = existing.principal.plus(investment.principalAmount);
      existing.current = existing.current.plus(investment.currentValue);
      investmentByAccount.set(investment.accountId, existing);
    }

    return accounts.map((account) => {
      const summary =
        accountSummaryMap.get(account.id) ?? {
          incomes: new Prisma.Decimal(0),
          expenses: new Prisma.Decimal(0),
          transferIn: new Prisma.Decimal(0),
          transferOut: new Prisma.Decimal(0),
          transactionCount: 0,
          lastTransactionAt: null,
        };

      const invested =
        investmentByAccount.get(account.id) ?? {
          principal: new Prisma.Decimal(0),
          current: new Prisma.Decimal(0),
        };

      const operationalBalance = new Prisma.Decimal(account.initialBalance)
        .plus(summary.incomes)
        .minus(summary.expenses)
        .plus(summary.transferIn)
        .minus(summary.transferOut);

      const availableBalance = operationalBalance.minus(invested.principal);
      const totalBalance = availableBalance.plus(invested.current);
      const consolidatedBalanceBrl = convertAmount(
        Number(totalBalance.toString()),
        normalizeCurrency(account.currency),
        "BRL",
        currentQuote.ratesInBrl
      );

      return serializeAccount(account, {
        availableBalance: decimalToString(availableBalance),
        investedBalance: decimalToString(invested.current),
        totalBalance: decimalToString(totalBalance),
        consolidatedBalanceBrl: decimalToString(consolidatedBalanceBrl),
        incomesTotal: decimalToString(summary.incomes),
        expensesTotal: decimalToString(summary.expenses),
        transferInTotal: decimalToString(summary.transferIn),
        transferOutTotal: decimalToString(summary.transferOut),
        transactionCount: summary.transactionCount,
        lastTransactionAt: summary.lastTransactionAt,
      });
    });
  }
}
