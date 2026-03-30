import { ReviewQueueActions } from "@/modules/review/components/review-queue-actions";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { formatDateUtc } from "@/modules/shared/utils/date";
import { getImportBatchStatusLabel, getImportedEntryStatusLabel, getReviewItemStatusLabel } from "@/modules/shared/utils/labels";
import { financeComposition } from "@/server/composition/finance";
import { reviewComposition } from "@/server/composition/review";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await getCurrentUser();
  const [overview, accounts, categories] = await Promise.all([
    reviewComposition.getReviewOverviewService.execute(user.id),
    financeComposition.listAccountsService.execute(user.id),
    financeComposition.listCategoriesService.execute(user.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importação / conciliação"
        description="Área secundária para tratar entradas importadas antes de elas entrarem no fluxo financeiro real."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Itens abertos" value={String(overview.totals.openItems)} />
        <StatCard label="Resolvidos" value={String(overview.totals.resolvedItems)} />
        <StatCard label="Entradas em revisão" value={String(overview.totals.reviewRequiredEntries)} />
        <StatCard label="Lotes em revisão" value={String(overview.totals.reviewRequiredBatches)} />
        <StatCard label="Lotes concluídos" value={String(overview.totals.completedBatches)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Fila de conciliação">
          {overview.queue.length ? (
            <>
              <MobileList>
                {overview.queue.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">
                        {item.importedEntry?.rawDescription || "Item sem origem importada"}
                      </p>
                      <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">
                        {getReviewItemStatusLabel(item.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.reason || "Sem justificativa detalhada."}</p>
                    {item.importedEntry ? (
                      <>
                        <p className="mt-2 text-sm text-slate-600">
                          {formatCurrency(item.importedEntry.rawAmount)} •{" "}
                          {item.importedEntry.rawOccurredAt ? formatDateUtc(item.importedEntry.rawOccurredAt) : "Sem data"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.importedEntry.batchFileName || "Sem lote"} •{" "}
                          {getImportedEntryStatusLabel(item.importedEntry.status)}
                        </p>
                        {item.status === "OPEN" ? (
                          <ReviewQueueActions
                            reviewItemId={item.id}
                            importedEntry={{ suggestedCategoryId: item.importedEntry.suggestedCategoryId }}
                            accounts={accounts.map((account) => ({ id: account.id, name: account.name }))}
                            categories={categories.map((category) => ({
                              id: category.id,
                              name: category.name,
                              kind: category.kind,
                              subcategories: category.subcategories,
                            }))}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ))}
              </MobileList>

              <DataTable headers={["Origem", "Motivo", "Valor", "Data", "Sugestão", "Status"]}>
                {overview.queue.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 text-slate-600">
                      {item.importedEntry?.rawDescription || item.kind}
                      <p className="text-xs text-slate-400">{item.importedEntry?.batchFileName || "Sem lote"}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{item.reason || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {item.importedEntry ? formatCurrency(item.importedEntry.rawAmount) : "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {item.importedEntry?.rawOccurredAt ? formatDateUtc(item.importedEntry.rawOccurredAt) : "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{item.importedEntry?.suggestedCategoryName || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">
                      <div className="space-y-2">
                        <p>{getReviewItemStatusLabel(item.status)}</p>
                        {item.status === "OPEN" && item.importedEntry ? (
                          <ReviewQueueActions
                            reviewItemId={item.id}
                            importedEntry={{ suggestedCategoryId: item.importedEntry.suggestedCategoryId }}
                            accounts={accounts.map((account) => ({ id: account.id, name: account.name }))}
                            categories={categories.map((category) => ({
                              id: category.id,
                              name: category.name,
                              kind: category.kind,
                              subcategories: category.subcategories,
                            }))}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <EmptyState title="Nenhum item pendente" description="Quando houver inconsistências de importação, elas aparecerão aqui." />
          )}
        </SectionCard>

        <SectionCard title="Lotes de importação">
          {overview.batches.length ? (
            <div className="space-y-3">
              {overview.batches.map((batch) => (
                <div key={batch.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{batch.fileName || "Importação manual"}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">
                      {getImportBatchStatusLabel(batch.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Iniciado em {formatDateUtc(batch.startedAt)}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {batch.totalEntries} entrada(s) • {batch.reviewRequiredEntries} em revisão
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem lotes" description="Os lotes importados aparecerão aqui." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
