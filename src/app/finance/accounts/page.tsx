import { AccountType } from "@prisma/client";
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas financeiras"
        description="Cadastre as contas reais que participam do controle financeiro."
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <SectionCard title="Nova conta">
          <AccountsForm accountTypes={toAccountTypeOptions(Object.values(AccountType))} />
        </SectionCard>

        <SectionCard title="Contas cadastradas">
          {accounts.length ? (
            <>
              <MobileList>
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{account.name}</p>
                    <p className="text-sm text-slate-500">
                      {getAccountTypeLabel(account.type)} • {account.institution || "Sem instituição"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatCurrency(account.initialBalance)}
                    </p>
                  </div>
                ))}
              </MobileList>

              <DataTable headers={["Conta", "Tipo", "Instituição", "Saldo inicial"]}>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-900">{account.name}</td>
                    <td className="px-3 py-3 text-slate-600">{getAccountTypeLabel(account.type)}</td>
                    <td className="px-3 py-3 text-slate-600">{account.institution || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{formatCurrency(account.initialBalance)}</td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <EmptyState
              title="Nenhuma conta cadastrada"
              description="Crie pelo menos uma conta para começar a lançar receitas e despesas."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}