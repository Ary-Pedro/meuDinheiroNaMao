import { Prisma, TransactionType } from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type { AccountResponse } from "../../models/finance-types";
import { serializeAccount } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";
import { TransactionsRepository } from "../../repositories/transactions-repository";

export class ListAccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async execute(userId: string): Promise<AccountResponse[]> {
    const [accounts, transactions] = await Promise.all([
      this.accountsRepository.listByUser(userId),
      this.transactionsRepository.listForAccountSummary(userId),
    ]);

    const accountSummaryMap = new Map<
      string,
      {
        incomes: Prisma.Decimal;
        expenses: Prisma.Decimal;
        transfer: Prisma.Decimal;
        transactionCount: number;
        lastTransactionAt: Date | null;
      }
    >();

    for (const transaction of transactions) {
      const existing =
        accountSummaryMap.get(transaction.accountId) ?? {
          incomes: new Prisma.Decimal(0),
          expenses: new Prisma.Decimal(0),
          transfer: new Prisma.Decimal(0),
          transactionCount: 0,
          lastTransactionAt: null,
        };

      const amount = new Prisma.Decimal(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        existing.incomes = existing.incomes.plus(amount);
      } else if (transaction.type === TransactionType.EXPENSE) {
        existing.expenses = existing.expenses.plus(amount);
      } else {
        existing.transfer = existing.transfer.plus(amount);
      }

      existing.transactionCount += 1;
      if (!existing.lastTransactionAt || transaction.occurredAt > existing.lastTransactionAt) {
        existing.lastTransactionAt = transaction.occurredAt;
      }

      accountSummaryMap.set(transaction.accountId, existing);
    }

    return accounts.map((account) => {
      const summary =
        accountSummaryMap.get(account.id) ?? {
          incomes: new Prisma.Decimal(0),
          expenses: new Prisma.Decimal(0),
          transfer: new Prisma.Decimal(0),
          transactionCount: 0,
          lastTransactionAt: null,
        };

      const currentBalance = new Prisma.Decimal(account.initialBalance)
        .plus(summary.incomes)
        .minus(summary.expenses);

      return serializeAccount(account, {
        currentBalance: decimalToString(currentBalance),
        incomesTotal: decimalToString(summary.incomes),
        expensesTotal: decimalToString(summary.expenses),
        transferTotal: decimalToString(summary.transfer),
        transactionCount: summary.transactionCount,
        lastTransactionAt: summary.lastTransactionAt,
      });
    });
  }
}
