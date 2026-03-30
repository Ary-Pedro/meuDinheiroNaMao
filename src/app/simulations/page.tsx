import { SimulationScenarioForm } from "@/modules/simulations/components/simulation-scenario-form";
import { SimulationScenarioRowActions } from "@/modules/simulations/components/simulation-scenario-row-actions";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { formatDateUtc } from "@/modules/shared/utils/date";
import { FinanceSankey } from "@/modules/finance/components/finance-sankey";
import { simulationsComposition } from "@/server/composition/simulations";

export const dynamic = "force-dynamic";

export default async function SimulationsPage() {
  const user = await getCurrentUser();
  const overview = await simulationsComposition.getSimulationsOverviewService.execute(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulações isoladas"
        description="Monte cenários com parceiros, custos e meta total sem contaminar o financeiro real."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cenários" value={String(overview.totals.scenariosCount)} />
        <StatCard label="Meta agregada" value={formatCurrency(overview.totals.totalTargetAmount)} />
        <StatCard label="Contribuições" value={formatCurrency(overview.totals.totalContributions)} />
        <StatCard label="Custos" value={formatCurrency(overview.totals.totalCosts)} />
      </div>

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <SectionCard title="Nova simulação">
          <SimulationScenarioForm />
        </SectionCard>

        <SectionCard title="Cenários ativos">
          {overview.scenarios.length ? (
            <div className="space-y-4">
              {overview.scenarios.map((scenario) => {
                const nodes = [
                  ...scenario.sankey.incomes.map((item) => ({
                    id: `income-${item.id}`,
                    label: item.label,
                    value: item.value,
                    tone: "income" as const,
                  })),
                  ...scenario.sankey.costs.map((item) => ({
                    id: `expense-${item.id}`,
                    label: item.label,
                    value: item.value,
                    tone: "expense" as const,
                  })),
                  {
                    id: `balance-${scenario.id}`,
                    label: "Saldo / diferença",
                    value: scenario.sankey.balance,
                    tone: "balance" as const,
                  },
                ];

                const links = [
                  ...scenario.sankey.incomes.map((item) => ({
                    id: `link-income-${item.id}`,
                    from: `income-${item.id}`,
                    to: `balance-${scenario.id}`,
                    value: item.value,
                    tone: "income" as const,
                  })),
                  ...scenario.sankey.costs.map((item) => ({
                    id: `link-cost-${item.id}`,
                    from: `balance-${scenario.id}`,
                    to: `expense-${item.id}`,
                    value: item.value,
                    tone: "expense" as const,
                  })),
                ];

                return (
                  <article key={scenario.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{scenario.name}</h3>
                        <p className="text-sm text-slate-500">{scenario.description || "Sem descrição detalhada."}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-slate-900">
                          Meta: {formatCurrency(scenario.targetAmount ?? scenario.totals.totalCosts)}
                        </p>
                        <p className="text-slate-500">Atualizado em {formatDateUtc(scenario.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Esperado</p>
                        <p className="font-medium text-slate-900">{formatCurrency(scenario.totals.expectedContribution)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Realizado</p>
                        <p className="font-medium text-slate-900">{formatCurrency(scenario.totals.actualContribution)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Custos</p>
                        <p className="font-medium text-slate-900">{formatCurrency(scenario.totals.totalCosts)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Falta para meta</p>
                        <p className="font-medium text-slate-900">{formatCurrency(scenario.totals.remainingToTarget)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Participantes</p>
                          <div className="mt-2 space-y-2">
                            {scenario.participants.map((participant) => (
                              <div key={participant.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-medium text-slate-900">{participant.name}</p>
                                  <p className="text-slate-500">Diferença: {formatCurrency(participant.gapAmount)}</p>
                                </div>
                                <p className="mt-1 text-slate-600">
                                  Esperado {formatCurrency(participant.expectedContribution)} • Pago{" "}
                                  {formatCurrency(participant.actualContribution)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Custos</p>
                          <div className="mt-2 space-y-2">
                            {scenario.costs.map((cost) => (
                              <div key={cost.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-medium text-slate-900">{cost.name}</p>
                                  <p className="text-slate-600">{formatCurrency(cost.amount)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <FinanceSankey nodes={nodes} links={links} />
                        <SimulationScenarioRowActions scenario={scenario} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Sem cenários"
              description="Crie uma simulação para acompanhar meta, diferenças entre parceiros e o fluxo tipo Sankey."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
