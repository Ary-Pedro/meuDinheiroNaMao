import { FinanceChart } from "@/modules/finance/components/finance-chart";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { decimalToNumber } from "@/modules/shared/utils/decimal";
import { financeComposition } from "@/server/composition/finance";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export default async function FinanceDashboardPage() {
  const user = await getCurrentUser();
  const dashboard = await financeComposition.getFinanceDashboardService.execute(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard financeiro"
        description="Resumo do período atual com foco em saldo, receitas, despesas e últimos lançamentos."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo do período" value={formatCurrency(dashboard.totals.balance)} />
        <StatCard label="Receitas" value={formatCurrency(dashboard.totals.incomes)} tone="positive" />
        <StatCard label="Despesas" value={formatCurrency(dashboard.totals.expenses)} tone="negative" />
        <StatCard label="Transações" value={String(dashboard.totals.transactionCount)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Receitas vs despesas">
          <FinanceChart
            incomes={decimalToNumber(dashboard.totals.incomes)}
            expenses={decimalToNumber(dashboard.totals.expenses)}
          />
          <p className="mt-4 text-xs text-slate-500">
            Transferências ficam separadas neste incremento e somam {formatCurrency(dashboard.totals.transfer)}.
          </p>
        </SectionCard>

        <SectionCard title="Período analisado">
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>De</dt>
              <dd>{formatDate(dashboard.period.from)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Até</dt>
              <dd>{formatDate(dashboard.period.to)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Transferências</dt>
              <dd>{formatCurrency(dashboard.totals.transfer)}</dd>
            </div>
          </dl>
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
                    {transaction.account.name} • {transaction.category.name} • {formatDate(transaction.occurredAt)}
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
                  {formatCurrency(transaction.amount)}
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
