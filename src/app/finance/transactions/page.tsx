import { TransactionType } from "@prisma/client";
import { TransactionsFilterForm } from "@/modules/finance/components/transactions-filter-form";
import { TransactionsForm } from "@/modules/finance/components/transactions-form";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { dateInputToUtcEnd, dateInputToUtcStart, formatDateUtc } from "@/modules/shared/utils/date";
import {
  getTransactionStatusLabel,
  getTransactionTypeLabel,
  toTransactionTypeOptions,
} from "@/modules/shared/utils/labels";
import { financeComposition } from "@/server/composition/finance";

export const dynamic = "force-dynamic";

type SearchParams = {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const user = await getCurrentUser();
  const accounts = await financeComposition.listAccountsService.execute(user.id);
  const categories = await financeComposition.listCategoriesService.execute(user.id);
  const transactionTypeOptions = toTransactionTypeOptions(Object.values(TransactionType));

  const transactions = await financeComposition.listTransactionsService.execute(user.id, {
    from: resolvedSearchParams.from ? dateInputToUtcStart(resolvedSearchParams.from) : undefined,
    to: resolvedSearchParams.to ? dateInputToUtcEnd(resolvedSearchParams.to) : undefined,
    accountId: resolvedSearchParams.accountId,
    categoryId: resolvedSearchParams.categoryId,
    type: resolvedSearchParams.type,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações"
        description="Cadastre lançamentos manuais e acompanhe a lista consolidada do período."
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(380px,460px)_minmax(0,1fr)]">
        <SectionCard title="Nova transação">
          <TransactionsForm
            accounts={accounts.map((account) => ({ id: account.id, name: account.name }))}
            categories={categories}
            transactionTypes={transactionTypeOptions}
          />
        </SectionCard>

        <SectionCard title="Lista de transações">
          <div className="space-y-4">
            <TransactionsFilterForm
              filters={resolvedSearchParams}
              accounts={accounts.map((account) => ({ id: account.id, name: account.name }))}
              categories={categories.map((category) => ({
                id: category.id,
                name: category.name,
                kind: category.kind,
              }))}
              types={transactionTypeOptions}
            />

            {transactions.length ? (
              <>
                <MobileList>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-slate-900">
                          {transaction.description || transaction.category.name}
                        </p>
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">
                          {getTransactionStatusLabel(transaction.status)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{transaction.account.name} • {transaction.category.name}</p>
                      <p className="text-sm text-slate-500">{formatDateUtc(transaction.occurredAt)}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </MobileList>

                <DataTable headers={["Data", "Descrição", "Categoria", "Conta", "Tipo", "Valor", "Status"]}>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 text-slate-600">{formatDateUtc(transaction.occurredAt)}</td>
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {transaction.description || transaction.category.name}
                      </td>
                      <td className="px-3 py-3 text-slate-600">{transaction.category.name}</td>
                      <td className="px-3 py-3 text-slate-600">{transaction.account.name}</td>
                      <td className="px-3 py-3 text-slate-600">{getTransactionTypeLabel(transaction.type)}</td>
                      <td className="px-3 py-3 text-slate-600">{formatCurrency(transaction.amount)}</td>
                      <td className="px-3 py-3 text-slate-600">{getTransactionStatusLabel(transaction.status)}</td>
                    </tr>
                  ))}
                </DataTable>
              </>
            ) : (
              <EmptyState
                title="Nenhuma transação encontrada"
                description="Cadastre a primeira transação ou ajuste os filtros para visualizar outros lançamentos."
              />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
