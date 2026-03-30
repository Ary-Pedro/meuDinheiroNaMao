import Link from "next/link";
import { FinanceChart } from "@/modules/finance/components/finance-chart";
import { FinanceSankey } from "@/modules/finance/components/finance-sankey";
import { DashboardPeriodFilter } from "@/modules/finance/components/dashboard-period-filter";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { dateInputToUtcEnd, dateInputToUtcStart, formatDateUtc, getTodayInputValue } from "@/modules/shared/utils/date";
import { financeComposition } from "@/server/composition/finance";
import { investmentsComposition } from "@/server/composition/investments";
import { reviewComposition } from "@/server/composition/review";
import { simulationsComposition } from "@/server/composition/simulations";

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

  const [dashboard, investmentsOverview, simulationsOverview, reviewOverview] = await Promise.all([
    financeComposition.getFinanceDashboardService.execute(user.id, { from, to }),
    investmentsComposition.getAccountInvestmentsOverviewService.execute(user.id),
    simulationsComposition.getSimulationsOverviewService.execute(user.id),
    reviewComposition.getReviewOverviewService.execute(user.id),
  ]);

  const fromInputValue = toInputDate(dashboard.period.from);
  const toInputValue = toInputDate(dashboard.period.to);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel financeiro"
        description="Resumo operacional do período, contas por moeda, últimos lançamentos e fluxo consolidado em BRL."
      />

      <SectionCard title="Filtro de período">
        <DashboardPeriodFilter
          key={`${fromInputValue}:${toInputValue}`}
          initialFrom={fromInputValue}
          initialTo={toInputValue}
          today={todayInput}
        />
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo consolidado (BRL)" value={formatCurrency(dashboard.totals.balanceBrl)} />
        <StatCard label="Receitas consolidadas" value={formatCurrency(dashboard.totals.incomesBrl)} tone="positive" />
        <StatCard label="Despesas consolidadas" value={formatCurrency(dashboard.totals.expensesBrl)} tone="negative" />
        <StatCard label="Transferências" value={String(dashboard.totals.transferCount)} />
      </div>

      <SectionCard title="Contas e saldos">
        {dashboard.accounts.length ? (
          <div className="grid gap-4 xl:grid-cols-4">
            {dashboard.accounts.map((account) => (
              <div key={account.accountId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{account.accountName}</p>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">{account.currency}</span>
                </div>
                <dl className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <dt>Disponível</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(account.availableBalance, account.currency)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt>Investido</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(account.investedBalance, account.currency)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt>Total patrimonial</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(account.totalBalance, account.currency)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt>Consolidado em BRL</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(account.consolidatedBalanceBrl)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Sem contas ainda" description="Cadastre as contas principais para começar a controlar disponível e patrimônio." />
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Últimos lançamentos">
          {dashboard.latestTransactions.length ? (
            <div className="space-y-3">
              {dashboard.latestTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-1 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{transaction.description || transaction.category?.name || "Lançamento"}</p>
                    <p className="text-sm text-slate-500">
                      {transaction.account.name} • {transaction.category?.name || "Sem categoria"}
                      {transaction.subcategory ? ` • ${transaction.subcategory.name}` : ""} • {formatDateUtc(transaction.occurredAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {formatCurrency(transaction.amountNative, transaction.currency)}
                    </p>
                    <p className="text-xs text-slate-500">Consolidado: {formatCurrency(transaction.amountBrlSnapshot)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem lançamentos no período"
              description="Cadastre receitas e despesas para alimentar o fluxo operacional."
            />
          )}
        </SectionCard>

        <SectionCard title="Últimas transferências">
          {dashboard.latestTransfers.length ? (
            <div className="space-y-3">
              {dashboard.latestTransfers.map((transfer) => (
                <div key={transfer.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{transfer.description || "Transferência interna"}</p>
                    <p className="text-sm font-semibold text-slate-900">{formatDateUtc(transfer.occurredAt)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {transfer.sourceAccount.name} → {transfer.destinationAccount.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Saída: {formatCurrency(transfer.sourceAmountNative, transfer.sourceAccount.currency)} • Entrada:{" "}
                    {formatCurrency(transfer.destinationAmountNative, transfer.destinationAccount.currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem transferências" description="Movimentações entre bancos e moedas aparecerão aqui." />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Receitas vs despesas">
          <FinanceChart incomes={Number(dashboard.totals.incomesBrl)} expenses={Number(dashboard.totals.expensesBrl)} />
          <p className="mt-4 text-xs text-slate-500">
            O gráfico usa o snapshot consolidado em BRL salvo em cada lançamento.
          </p>
        </SectionCard>

        <SectionCard title="Fluxo do período (Sankey)">
          <FinanceSankey nodes={dashboard.sankey.nodes} links={dashboard.sankey.links} />
        </SectionCard>
      </div>

      <SectionCard title="Status complementar do produto">
        <div className="grid gap-4 xl:grid-cols-3">
          <Link
            href="/review"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
          >
            <p className="text-sm font-semibold text-slate-900">Importação e conciliação</p>
            <p className="mt-1 text-sm text-slate-600">
              {reviewOverview.totals.openItems} item(ns) aguardando validação antes de entrar no financeiro real.
            </p>
          </Link>
          <Link
            href="/investments"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
          >
            <p className="text-sm font-semibold text-slate-900">Investimentos</p>
            <p className="mt-1 text-sm text-slate-600">
              {investmentsOverview.totals.activeCount} registro(s) e patrimônio de {formatCurrency(investmentsOverview.totals.currentValue)}.
            </p>
          </Link>
          <Link
            href="/simulations"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
          >
            <p className="text-sm font-semibold text-slate-900">Simulações</p>
            <p className="mt-1 text-sm text-slate-600">
              {simulationsOverview.totals.scenariosCount} cenário(s) isolados com leitura própria de meta e diferenças.
            </p>
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
