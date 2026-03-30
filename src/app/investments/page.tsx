import { AccountInvestmentScopeMode } from "@prisma/client";
import { AccountInvestmentForm } from "@/modules/investments/components/account-investment-form";
import { AccountInvestmentRowActions } from "@/modules/investments/components/account-investment-row-actions";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { formatDateUtc } from "@/modules/shared/utils/date";
import { getAssetTypeLabel } from "@/modules/shared/utils/labels";
import { financeComposition } from "@/server/composition/finance";
import { investmentsComposition } from "@/server/composition/investments";

export const dynamic = "force-dynamic";

function getScopeModeLabel(value: string) {
  return value === AccountInvestmentScopeMode.INCOME_ONLY ? "Apenas renda" : "Total";
}

export default async function InvestmentsPage() {
  const user = await getCurrentUser();
  const [overview, accounts] = await Promise.all([
    investmentsComposition.getAccountInvestmentsOverviewService.execute(user.id),
    financeComposition.listAccountsService.execute(user.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investimentos vinculados à conta"
        description="Registre patrimônio preso à conta sem transformar isso em despesa comum no fluxo financeiro."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aplicado" value={formatCurrency(overview.totals.principal)} />
        <StatCard label="Valor atual" value={formatCurrency(overview.totals.currentValue)} />
        <StatCard label="Rendimento" value={formatCurrency(overview.totals.incomeAmount)} />
        <StatCard label="Registros ativos" value={String(overview.totals.activeCount)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Novo investimento">
          <AccountInvestmentForm
            accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
          />
        </SectionCard>

        <SectionCard title="Patrimônio por conta">
          {overview.byAccount.length ? (
            <div className="space-y-3">
              {overview.byAccount.map((item) => (
                <div key={item.accountId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.accountName}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">{item.currency}</span>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-slate-500">Aplicado</p>
                      <p className="font-medium text-slate-900">{formatCurrency(item.principal, item.currency)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Atual</p>
                      <p className="font-medium text-slate-900">{formatCurrency(item.currentValue, item.currency)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Rendimento</p>
                      <p className="font-medium text-slate-900">{formatCurrency(item.incomeAmount, item.currency)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem patrimônio preso"
              description="Registre caixinhas, fundos e outros investimentos vinculados às suas contas."
            />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Investimentos ativos">
        {overview.investments.length ? (
          <>
            <MobileList>
              {overview.investments.map((investment) => (
                <div key={investment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{investment.name}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">
                      {getAssetTypeLabel(investment.investmentType)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {investment.account.name} • {formatDateUtc(investment.startedAt)}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>Aplicado: {formatCurrency(investment.principalAmount, investment.account.currency)}</p>
                    <p>Atual: {formatCurrency(investment.currentValue, investment.account.currency)}</p>
                    <p>Rendimento: {formatCurrency(investment.incomeAmount, investment.account.currency)}</p>
                    <p>Contabilização: {getScopeModeLabel(investment.scopeMode)}</p>
                  </div>
                  <div className="mt-3">
                    <AccountInvestmentRowActions
                      investment={investment}
                      accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                    />
                  </div>
                </div>
              ))}
            </MobileList>

            <DataTable headers={["Nome", "Conta", "Tipo", "Aplicado", "Atual", "Rendimento", "Modo", "Ações"]}>
              {overview.investments.map((investment) => (
                <tr key={investment.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-900">{investment.name}</td>
                  <td className="px-3 py-3 text-slate-600">{investment.account.name}</td>
                  <td className="px-3 py-3 text-slate-600">{getAssetTypeLabel(investment.investmentType)}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {formatCurrency(investment.principalAmount, investment.account.currency)}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{formatCurrency(investment.currentValue, investment.account.currency)}</td>
                  <td className="px-3 py-3 text-slate-600">{formatCurrency(investment.incomeAmount, investment.account.currency)}</td>
                  <td className="px-3 py-3 text-slate-600">{getScopeModeLabel(investment.scopeMode)}</td>
                  <td className="px-3 py-3 text-slate-600">
                    <AccountInvestmentRowActions
                      investment={investment}
                      accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </>
        ) : (
          <EmptyState
            title="Sem investimentos"
            description="Os investimentos cadastrados aqui vão compor o bloco de patrimônio das contas."
          />
        )}
      </SectionCard>
    </div>
  );
}
