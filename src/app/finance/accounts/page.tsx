import { AccountType } from "@prisma/client";
import { AccountRowActions } from "@/modules/finance/components/account-row-actions";
import { AccountsForm } from "@/modules/finance/components/accounts-form";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { getAccountTypeLabel, toAccountTypeOptions } from "@/modules/shared/utils/labels";
import { financeComposition } from "@/server/composition/finance";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const user = await getCurrentUser();
  const accounts = await financeComposition.listAccountsService.execute(user.id);
  const accountTypeOptions = toAccountTypeOptions(Object.values(AccountType));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas financeiras"
        description="Acompanhe o disponível, o investido e o total patrimonial de cada conta."
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <SectionCard title="Nova conta">
          <AccountsForm accountTypes={accountTypeOptions} />
        </SectionCard>

        <SectionCard title="Contas cadastradas">
          {accounts.length ? (
            <>
              <MobileList>
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{account.name}</p>
                    <p className="text-sm text-slate-500">
                      {getAccountTypeLabel(account.type)} • {account.institution || "Sem instituição informada"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Moeda {account.currency} • {account.transactionCount} transação(ões)
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="font-semibold text-slate-900">
                        Disponível: {formatCurrency(account.availableBalance, account.currency)}
                      </p>
                      <p className="text-slate-600">Investido: {formatCurrency(account.investedBalance, account.currency)}</p>
                      <p className="text-slate-600">Total: {formatCurrency(account.totalBalance, account.currency)}</p>
                      <p className="text-slate-600">Consolidado BRL: {formatCurrency(account.consolidatedBalanceBrl)}</p>
                    </div>
                    <div className="mt-3">
                      <AccountRowActions account={account} accountTypes={accountTypeOptions} />
                    </div>
                  </div>
                ))}
              </MobileList>

              <DataTable headers={["Conta", "Tipo", "Instituição", "Transações", "Disponível", "Investido", "Total", "Ações"]}>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-900">{account.name}</td>
                    <td className="px-3 py-3 text-slate-600">{getAccountTypeLabel(account.type)}</td>
                    <td className="px-3 py-3 text-slate-600">{account.institution || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{account.transactionCount} transação(ões)</td>
                    <td className="px-3 py-3 text-slate-600">{formatCurrency(account.availableBalance, account.currency)}</td>
                    <td className="px-3 py-3 text-slate-600">{formatCurrency(account.investedBalance, account.currency)}</td>
                    <td className="px-3 py-3 text-slate-600">{formatCurrency(account.totalBalance, account.currency)}</td>
                    <td className="px-3 py-3 text-slate-600">
                      <AccountRowActions account={account} accountTypes={accountTypeOptions} />
                    </td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <EmptyState
              title="Nenhuma conta cadastrada ainda"
              description="Cadastre sua primeira conta para começar a lançar receitas, despesas e transferências."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
