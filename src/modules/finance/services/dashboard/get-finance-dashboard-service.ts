import { Prisma, TransactionType } from "@prisma/client";
import { decimalToString } from "@/modules/shared/utils/decimal";
import type { ListTransactionsFilters } from "../../dto/transaction-dto";
import type { FinanceDashboardResponse } from "../../models/finance-types";
import { buildDashboardResponse, serializeTransaction } from "../../models/serializers";
import { TransactionsRepository } from "../../repositories/transactions-repository";

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export class GetFinanceDashboardService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute(userId: string, filters: ListTransactionsFilters = {}): Promise<FinanceDashboardResponse> {
    const from = filters.from ?? startOfMonth();
    const to = filters.to ?? endOfMonth();
    const transactions = await this.transactionsRepository.listByUser(userId, { ...filters, from, to });

    const totals = transactions.reduce(
      (acc, transaction) => {
        const amount = new Prisma.Decimal(transaction.amount);

        if (transaction.type === TransactionType.INCOME) {
          acc.incomes = acc.incomes.plus(amount);
        } else if (transaction.type === TransactionType.EXPENSE) {
          acc.expenses = acc.expenses.plus(amount);
        } else {
          acc.transfer = acc.transfer.plus(amount);
        }

        return acc;
      },
      {
        incomes: new Prisma.Decimal(0),
        expenses: new Prisma.Decimal(0),
        transfer: new Prisma.Decimal(0),
      }
    );

    const transferByAccount = new Map<
      string,
      {
        accountId: string;
        accountName: string;
        transferCount: number;
        transferTotal: Prisma.Decimal;
      }
    >();

    for (const transaction of transactions) {
      if (transaction.type !== TransactionType.TRANSFER) {
        continue;
      }

      const key = transaction.account.id;
      const existing =
        transferByAccount.get(key) ?? {
          accountId: transaction.account.id,
          accountName: transaction.account.name,
          transferCount: 0,
          transferTotal: new Prisma.Decimal(0),
        };

      existing.transferCount += 1;
      existing.transferTotal = existing.transferTotal.plus(new Prisma.Decimal(transaction.amount));
      transferByAccount.set(key, existing);
    }

    const topTransferAccounts = Array.from(transferByAccount.values())
      .sort((left, right) => {
        if (right.transferCount !== left.transferCount) {
          return right.transferCount - left.transferCount;
        }

        return right.transferTotal.comparedTo(left.transferTotal);
      })
      .slice(0, 2)
      .map((item) => ({
        accountId: item.accountId,
        accountName: item.accountName,
        transferCount: item.transferCount,
        transferTotal: decimalToString(item.transferTotal),
      }));

    const balance = totals.incomes.minus(totals.expenses);

    return buildDashboardResponse({
      from,
      to,
      incomes: decimalToString(totals.incomes),
      expenses: decimalToString(totals.expenses),
      transfer: decimalToString(totals.transfer),
      balance: decimalToString(balance),
      transactionCount: transactions.length,
      topTransferAccounts,
      latestTransactions: transactions.slice(0, 5).map(serializeTransaction),
    });
  }
}
