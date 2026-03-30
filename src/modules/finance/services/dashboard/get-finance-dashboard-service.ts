import { decimalToString } from "@/modules/shared/utils/decimal";
import type { ListTransactionsFilters } from "../../dto/transaction-dto";
import type { FinanceDashboardResponse } from "../../models/finance-types";
import { buildDashboardResponse, serializeTransaction, serializeTransfer } from "../../models/serializers";
import { TransactionsRepository } from "../../repositories/transactions-repository";
import { TransfersRepository } from "../../repositories/transfers-repository";
import { ListAccountsService } from "../accounts/list-accounts-service";

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function endOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function startOfDayOneYearBefore(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear() - 1, date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
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
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly transfersRepository: TransfersRepository,
    private readonly listAccountsService: ListAccountsService
  ) {}

  async execute(userId: string, filters: ListTransactionsFilters = {}): Promise<FinanceDashboardResponse> {
    const { from, to } = resolveDashboardRange(filters);
    const [transactions, transfers, accounts] = await Promise.all([
      this.transactionsRepository.listOperationalByUser(userId, { ...filters, from, to }),
      this.transfersRepository.listByUser(userId, { from, to }),
      this.listAccountsService.execute(userId),
    ]);

    const totals = transactions.reduce(
      (acc, transaction) => {
        const valueBrl = Number(transaction.amountBrlSnapshot.toString());

        if (transaction.type === "INCOME") {
          acc.incomesBrl += valueBrl;
        } else {
          acc.expensesBrl += valueBrl;
        }

        return acc;
      },
      { incomesBrl: 0, expensesBrl: 0 }
    );

    const transferVolumeBrl = transfers.reduce(
      (sum, transfer) => sum + Number(transfer.sourceAmountBrlSnapshot.toString()),
      0
    );

    const incomeByCategory = new Map<string, number>();
    const expenseByCategory = new Map<string, number>();

    for (const transaction of transactions) {
      const label = transaction.category?.name ?? (transaction.type === "INCOME" ? "Receitas" : "Despesas");
      const value = Number(transaction.amountBrlSnapshot.toString());

      if (transaction.type === "INCOME") {
        incomeByCategory.set(label, (incomeByCategory.get(label) ?? 0) + value);
      } else {
        expenseByCategory.set(label, (expenseByCategory.get(label) ?? 0) + value);
      }
    }

    const balanceBrl = totals.incomesBrl - totals.expensesBrl;

    const sankeyNodes = [
      ...Array.from(incomeByCategory.entries()).map(([label, value]) => ({
        id: `income:${label}`,
        label,
        value: decimalToString(value),
        tone: "income" as const,
      })),
      {
        id: "pool:receitas",
        label: "Entradas do período",
        value: decimalToString(totals.incomesBrl),
        tone: "income" as const,
      },
      ...Array.from(expenseByCategory.entries()).map(([label, value]) => ({
        id: `expense:${label}`,
        label,
        value: decimalToString(value),
        tone: "expense" as const,
      })),
      {
        id: "pool:saldo",
        label: "Saldo restante",
        value: decimalToString(Math.max(balanceBrl, 0)),
        tone: "balance" as const,
      },
    ];

    const sankeyLinks = [
      ...Array.from(incomeByCategory.entries()).map(([label, value]) => ({
        id: `income-link:${label}`,
        from: `income:${label}`,
        to: "pool:receitas",
        value: decimalToString(value),
        tone: "income" as const,
      })),
      ...Array.from(expenseByCategory.entries()).map(([label, value]) => ({
        id: `expense-link:${label}`,
        from: "pool:receitas",
        to: `expense:${label}`,
        value: decimalToString(value),
        tone: "expense" as const,
      })),
      {
        id: "balance-link",
        from: "pool:receitas",
        to: "pool:saldo",
        value: decimalToString(Math.max(balanceBrl, 0)),
        tone: "balance" as const,
      },
    ];

    return buildDashboardResponse({
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      totals: {
        balanceBrl: decimalToString(balanceBrl),
        incomesBrl: decimalToString(totals.incomesBrl),
        expensesBrl: decimalToString(totals.expensesBrl),
        transferVolumeBrl: decimalToString(transferVolumeBrl),
        transactionCount: transactions.length,
        transferCount: transfers.length,
      },
      accounts: accounts.slice(0, 4).map((account) => ({
        accountId: account.id,
        accountName: account.name,
        currency: account.currency,
        availableBalance: account.availableBalance,
        investedBalance: account.investedBalance,
        totalBalance: account.totalBalance,
        consolidatedBalanceBrl: account.consolidatedBalanceBrl,
      })),
      latestTransactions: transactions.slice(0, 5).map(serializeTransaction),
      latestTransfers: transfers.slice(0, 4).map(serializeTransfer),
      sankey: {
        nodes: sankeyNodes,
        links: sankeyLinks,
      },
    });
  }
}
