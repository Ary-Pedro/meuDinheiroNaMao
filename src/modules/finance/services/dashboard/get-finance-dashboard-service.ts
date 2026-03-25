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

    const balance = totals.incomes.minus(totals.expenses);

    return buildDashboardResponse({
      from,
      to,
      incomes: decimalToString(totals.incomes),
      expenses: decimalToString(totals.expenses),
      transfer: decimalToString(totals.transfer),
      balance: decimalToString(balance),
      transactionCount: transactions.length,
      latestTransactions: transactions.slice(0, 5).map(serializeTransaction),
    });
  }
}
