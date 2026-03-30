import { TransactionType } from "@prisma/client";
import { TransferRowActions } from "@/modules/finance/components/transfer-row-actions";
import { TransfersForm } from "@/modules/finance/components/transfers-form";
import { TransactionsFilterForm } from "@/modules/finance/components/transactions-filter-form";
import { TransactionsForm } from "@/modules/finance/components/transactions-form";
import { TransactionRowActions } from "@/modules/finance/components/transaction-row-actions";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { dateInputToUtcEnd, dateInputToUtcStart, formatDateUtc } from "@/modules/shared/utils/date";
import { getTransactionStatusLabel, getTransactionTypeLabel, toTransactionTypeOptions } from "@/modules/shared/utils/labels";
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
  const transactionTypeOptions = toTransactionTypeOptions([TransactionType.INCOME, TransactionType.EXPENSE]);

  const [transactions, transfers] = await Promise.all([
    financeComposition.listTransactionsService.execute(user.id, {
      from: resolvedSearchParams.from ? dateInputToUtcStart(resolvedSearchParams.from) : undefined,
      to: resolvedSearchParams.to ? dateInputToUtcEnd(resolvedSearchParams.to) : undefined,
      accountId: resolvedSearchParams.accountId,
      categoryId: resolvedSearchParams.categoryId,
      type: resolvedSearchParams.type && resolvedSearchParams.type !== TransactionType.TRANSFER ? resolvedSearchParams.type : undefined,
    }),
    financeComposition.listTransfersService.execute(user.id, {
      from: resolvedSearchParams.from ? dateInputToUtcStart(resolvedSearchParams.from) : undefined,
      to: resolvedSearchParams.to ? dateInputToUtcEnd(resolvedSearchParams.to) : undefined,
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fluxo financeiro"
        description="Separe lançamentos operacionais de transferências internas para manter o extrato mais coerente."
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(380px,460px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <SectionCard title="Novo lançamento">
            <TransactionsForm
              accounts={accounts.map((account) => ({
                id: account.id,
                name: account.name,
                currency: account.currency,
              }))}
              categories={categories}
              transactionTypes={transactionTypeOptions}
            />
          </SectionCard>

          <SectionCard title="Nova transferência">
            <TransfersForm
              accounts={accounts.map((account) => ({
                id: account.id,
                name: account.name,
                currency: account.currency,
              }))}
            />
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Lançamentos">
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
                            {transaction.description || transaction.category?.name || "Lançamento"}
                          </p>
                          <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">
                            {getTransactionStatusLabel(transaction.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          {transaction.account.name} • {transaction.category?.name || "Sem categoria"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {transaction.subcategory ? `Subcategoria: ${transaction.subcategory.name}` : "Sem subcategoria"}
                        </p>
                        <p className="text-sm text-slate-500">{formatDateUtc(transaction.occurredAt)}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatCurrency(transaction.amountNative, transaction.currency)}
                        </p>
                        <p className="text-xs text-slate-500">Consolidado BRL: {formatCurrency(transaction.amountBrlSnapshot)}</p>
                        <div className="mt-3">
                          <TransactionRowActions
                            transaction={transaction}
                            transactionTypes={transactionTypeOptions}
                            accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                            categories={categories.map((category) => ({
                              id: category.id,
                              name: category.name,
                              kind: category.kind,
                              subcategories: category.subcategories,
                            }))}
                          />
                        </div>
                      </div>
                    ))}
                  </MobileList>

                  <DataTable headers={["Data", "Descrição", "Categoria", "Conta", "Tipo", "Valor nativo", "BRL", "Status", "Ações"]}>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-slate-100">
                        <td className="px-3 py-3 text-slate-600">{formatDateUtc(transaction.occurredAt)}</td>
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {transaction.description || transaction.category?.name || "Lançamento"}
                        </td>
                        <td className="px-3 py-3 text-slate-600">{transaction.category?.name || "-"}</td>
                        <td className="px-3 py-3 text-slate-600">{transaction.account.name}</td>
                        <td className="px-3 py-3 text-slate-600">{getTransactionTypeLabel(transaction.type)}</td>
                        <td className="px-3 py-3 text-slate-600">{formatCurrency(transaction.amountNative, transaction.currency)}</td>
                        <td className="px-3 py-3 text-slate-600">{formatCurrency(transaction.amountBrlSnapshot)}</td>
                        <td className="px-3 py-3 text-slate-600">{getTransactionStatusLabel(transaction.status)}</td>
                        <td className="px-3 py-3 text-slate-600">
                          <TransactionRowActions
                            transaction={transaction}
                            transactionTypes={transactionTypeOptions}
                            accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                            categories={categories.map((category) => ({
                              id: category.id,
                              name: category.name,
                              kind: category.kind,
                              subcategories: category.subcategories,
                            }))}
                          />
                        </td>
                      </tr>
                    ))}
                  </DataTable>
                </>
              ) : (
                <EmptyState
                  title="Nenhum lançamento encontrado"
                  description="Cadastre receitas e despesas ou ajuste os filtros."
                />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Transferências internas">
            {transfers.length ? (
              <>
                <MobileList>
                  {transfers.map((transfer) => (
                    <div key={transfer.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-slate-900">{transfer.description || "Transferência interna"}</p>
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600">
                          {formatDateUtc(transfer.occurredAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {transfer.sourceAccount.name} → {transfer.destinationAccount.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {formatCurrency(transfer.sourceAmountNative, transfer.sourceAccount.currency)} →{" "}
                        {formatCurrency(transfer.destinationAmountNative, transfer.destinationAccount.currency)}
                      </p>
                      <div className="mt-3">
                        <TransferRowActions
                          transfer={transfer}
                          accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                        />
                      </div>
                    </div>
                  ))}
                </MobileList>

                <DataTable headers={["Data", "Origem", "Destino", "Saída", "Entrada", "Ações"]}>
                  {transfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 text-slate-600">{formatDateUtc(transfer.occurredAt)}</td>
                      <td className="px-3 py-3 text-slate-600">{transfer.sourceAccount.name}</td>
                      <td className="px-3 py-3 text-slate-600">{transfer.destinationAccount.name}</td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatCurrency(transfer.sourceAmountNative, transfer.sourceAccount.currency)}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatCurrency(transfer.destinationAmountNative, transfer.destinationAccount.currency)}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        <TransferRowActions
                          transfer={transfer}
                          accounts={accounts.map((account) => ({ id: account.id, name: account.name, currency: account.currency }))}
                        />
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </>
            ) : (
              <EmptyState
                title="Sem transferências ainda"
                description="Transfira entre bancos e moedas usando o formulário dedicado."
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
