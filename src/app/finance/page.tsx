import { FinanceChart } from "@/modules/finance/components/finance-chart";
import { DashboardPeriodFilter } from "@/modules/finance/components/dashboard-period-filter";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { dateInputToUtcEnd, dateInputToUtcStart, formatDateUtc, getTodayInputValue } from "@/modules/shared/utils/date";
import { decimalToNumber } from "@/modules/shared/utils/decimal";
import { financeComposition } from "@/server/composition/finance";

export const dynamic = "force-dynamic";

type SearchParams = {
  from?: string;
  to?: string;
};

function isDateInput(value?: string) {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toInputDate(value: string) {
  return value.slice(0, 10);
}

export default async function FinanceDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const user = await getCurrentUser();
  const todayInput = getTodayInputValue();

  const from = isDateInput(resolvedSearchParams.from)
    ? dateInputToUtcStart(resolvedSearchParams.from as string)
    : undefined;
  const to = isDateInput(resolvedSearchParams.to)
    ? dateInputToUtcEnd(resolvedSearchParams.to as string)
    : undefined;

  const dashboard = await financeComposition.getFinanceDashboardService.execute(user.id, { from, to });
  const fromInputValue = toInputDate(dashboard.period.from);
  const toInputValue = toInputDate(dashboard.period.to);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard financeiro"
        description="Resumo do período atual com foco em saldo, receitas, despesas e últimos lançamentos."
      />

      <SectionCard title="Filtro de período">
        <DashboardPeriodFilter initialFrom={fromInputValue} initialTo={toInputValue} today={todayInput} />
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo do período" value={formatCurrency(dashboard.totals.balance)} />
        <StatCard label="Receitas" value={formatCurrency(dashboard.totals.incomes)} tone="positive" />
        <StatCard label="Despesas" value={formatCurrency(dashboard.totals.expenses)} tone="negative" />
        <StatCard label="Transações" value={String(dashboard.totals.transactionCount)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Receitas vs. despesas">
          <FinanceChart
            incomes={decimalToNumber(dashboard.totals.incomes)}
            expenses={decimalToNumber(dashboard.totals.expenses)}
          />
          <p className="mt-4 text-xs text-slate-500">
            No período analisado, as transferências totalizam {formatCurrency(dashboard.totals.transfer)}.
          </p>
        </SectionCard>

        <SectionCard title="Período analisado">
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>De</dt>
              <dd>{formatDateUtc(dashboard.period.from)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Até</dt>
              <dd>{formatDateUtc(dashboard.period.to)}</dd>
            </div>
          </dl>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="mb-2 text-sm font-medium text-slate-700">Contas principais</p>
            {dashboard.topActiveAccounts.length ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {dashboard.topActiveAccounts.map((item) => (
                  <li key={item.accountId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-slate-800">{item.accountName}</p>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {item.transactionCount} transação(ões)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-500">Receitas</p>
                        <p className="font-medium text-emerald-700">{formatCurrency(item.incomesTotal)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Despesas</p>
                        <p className="font-medium text-rose-700">{formatCurrency(item.expensesTotal)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Saldo</p>
                        <p className="font-medium text-slate-800">{formatCurrency(item.netTotal)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Sem transações no período para estimar contas principais.</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Com base na frequência de transações, estas são suas contas principais no período.
            </p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Últimas transações">
        {dashboard.latestTransactions.length ? (
          <div className="space-y-3">
            {dashboard.latestTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-1 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{transaction.description || transaction.category.name}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.account.name} • {transaction.category.name}
                    {transaction.subcategory ? ` • ${transaction.subcategory.name}` : ""} • {formatDateUtc(transaction.occurredAt)}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-emerald-600"
                      : transaction.type === "EXPENSE"
                        ? "text-rose-600"
                        : "text-slate-600"
                  }`}
                >
                  {formatCurrency(transaction.amount, transaction.account.currency)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sem transações no período"
            description="Cadastre uma conta, uma categoria e lance a primeira transação para iniciar o dashboard."
          />
        )}
      </SectionCard>
    </div>
  );
}
