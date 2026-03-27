import { decimalToString } from "@/modules/shared/utils/decimal";
import type { ListTransactionsFilters } from "../../dto/transaction-dto";
import type { FinanceDashboardResponse } from "../../models/finance-types";
import { buildDashboardResponse, serializeTransaction } from "../../models/serializers";
import { TransactionsRepository } from "../../repositories/transactions-repository";

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function endOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function startOfDayOneYearBefore(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear() - 1, date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
}

function resolveDashboardRange(filters: ListTransactionsFilters) {
  const now = new Date();
  const todayEnd = endOfDay(now);

  const to = filters.to ? endOfDay(filters.to) : todayEnd;
  const safeTo = to > todayEnd ? todayEnd : to;

  let from = filters.from ? startOfDay(filters.from) : startOfDayOneYearBefore(safeTo);

  if (from > safeTo) {
    from = startOfDayOneYearBefore(safeTo);
  }

  return { from, to: safeTo };
}

export class GetFinanceDashboardService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute(userId: string, filters: ListTransactionsFilters = {}): Promise<FinanceDashboardResponse> {
    const { from, to } = resolveDashboardRange(filters);
    const transactions = await this.transactionsRepository.listByUser(userId, { ...filters, from, to });

    const totals: { incomes: number; expenses: number; transfer: number } = {
      incomes: 0,
      expenses: 0,
      transfer: 0,
    };

    for (const transaction of transactions) {
      const amount = Number(transaction.amount.toString());

      if (transaction.type === "INCOME") {
        totals.incomes += amount;
      } else if (transaction.type === "EXPENSE") {
        totals.expenses += amount;
      } else {
        totals.transfer += amount;
      }
    }

    const activityByAccount = new Map<
      string,
      {
        accountId: string;
        accountName: string;
        transactionCount: number;
            incomesTotal: number;
            expensesTotal: number;
            transferTotal: number;
      }
    >();

    for (const transaction of transactions) {
      const key = transaction.account.id;
      const existing =
        activityByAccount.get(key) ?? {
          accountId: transaction.account.id,
          accountName: transaction.account.name,
          transactionCount: 0,
              incomesTotal: 0,
              expensesTotal: 0,
              transferTotal: 0,
        };

      existing.transactionCount += 1;
          if (transaction.type === "INCOME") {
            existing.incomesTotal += Number(transaction.amount.toString());
          } else if (transaction.type === "EXPENSE") {
            existing.expensesTotal += Number(transaction.amount.toString());
          } else {
            existing.transferTotal += Number(transaction.amount.toString());
          }
      activityByAccount.set(key, existing);
    }

    const topActiveAccounts = Array.from(activityByAccount.values())
      .sort((left, right) => {
        if (right.transactionCount !== left.transactionCount) {
          return right.transactionCount - left.transactionCount;
        }

            const rightMoved = right.incomesTotal + right.expensesTotal + right.transferTotal;
            const leftMoved = left.incomesTotal + left.expensesTotal + left.transferTotal;
            return rightMoved - leftMoved;
      })
      .slice(0, 2)
      .map((item) => ({
        accountId: item.accountId,
        accountName: item.accountName,
        transactionCount: item.transactionCount,
            incomesTotal: decimalToString(item.incomesTotal),
            expensesTotal: decimalToString(item.expensesTotal),
            netTotal: decimalToString(item.incomesTotal - item.expensesTotal),
      }));

    const balance = totals.incomes - totals.expenses;

    return buildDashboardResponse({
      from,
      to,
      incomes: decimalToString(totals.incomes),
      expenses: decimalToString(totals.expenses),
      transfer: decimalToString(totals.transfer),
      balance: decimalToString(balance),
      transactionCount: transactions.length,
      topActiveAccounts,
      latestTransactions: transactions.slice(0, 5).map(serializeTransaction),
    });
  }
}
