"use client";

import { AccountInvestmentScopeMode, AccountInvestmentType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { dateInputToUtcIso, getTodayInputValue } from "@/modules/shared/utils/date";
import { getAssetTypeLabel } from "@/modules/shared/utils/labels";

type Props = {
  accounts: { id: string; name: string; currency: string }[];
  endpoint?: string;
  method?: "POST" | "PATCH";
  submitLabel?: string;
  initialValues?: {
    accountId: string;
    name: string;
    investmentType: string;
    principalAmount: string;
    currentValue: string;
    incomeAmount: string;
    scopeMode: string;
    startedAt: string;
    notes: string;
  };
  onSuccess?: () => void;
};

export function AccountInvestmentForm({
  accounts,
  endpoint = "/api/investments/operations",
  method = "POST",
  submitLabel,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      accountId: String(formData.get("accountId") ?? ""),
      name: String(formData.get("name") ?? ""),
      investmentType: String(formData.get("investmentType") ?? AccountInvestmentType.OTHER),
      principalAmount: Number(formData.get("principalAmount") ?? 0),
      currentValue: Number(formData.get("currentValue") ?? 0),
      incomeAmount: Number(formData.get("incomeAmount") ?? 0),
      scopeMode: String(formData.get("scopeMode") ?? AccountInvestmentScopeMode.TOTAL),
      startedAt: dateInputToUtcIso(String(formData.get("startedAt") ?? getTodayInputValue())),
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao salvar investimento." }));
        setError(body.error ?? "Falha ao salvar investimento.");
        return;
      }

      form.reset();
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="investment-account" className="text-sm font-medium text-slate-700">
          Conta base
        </label>
        <select
          id="investment-account"
          name="accountId"
          defaultValue={initialValues?.accountId ?? ""}
          required
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        >
          <option value="">Selecione</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.currency})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="investment-name" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="investment-name"
            name="name"
            required
            defaultValue={initialValues?.name}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            placeholder="Ex.: Caixinha de emergência"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="investment-type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="investment-type"
            name="investmentType"
            defaultValue={initialValues?.investmentType ?? AccountInvestmentType.OTHER}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            {Object.values(AccountInvestmentType).map((value) => (
              <option key={value} value={value}>
                {getAssetTypeLabel(value)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1">
          <label htmlFor="investment-principal" className="text-sm font-medium text-slate-700">
            Valor aplicado
          </label>
          <input
            id="investment-principal"
            name="principalAmount"
            type="number"
            step="0.01"
            defaultValue={initialValues?.principalAmount ?? "0"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="investment-current" className="text-sm font-medium text-slate-700">
            Valor atual
          </label>
          <input
            id="investment-current"
            name="currentValue"
            type="number"
            step="0.01"
            defaultValue={initialValues?.currentValue ?? "0"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="investment-income" className="text-sm font-medium text-slate-700">
            Rendimento
          </label>
          <input
            id="investment-income"
            name="incomeAmount"
            type="number"
            step="0.01"
            defaultValue={initialValues?.incomeAmount ?? "0"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="investment-scope" className="text-sm font-medium text-slate-700">
            Contabilização patrimonial
          </label>
          <select
            id="investment-scope"
            name="scopeMode"
            defaultValue={initialValues?.scopeMode ?? AccountInvestmentScopeMode.TOTAL}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value={AccountInvestmentScopeMode.TOTAL}>Total</option>
            <option value={AccountInvestmentScopeMode.INCOME_ONLY}>Apenas renda</option>
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="investment-date" className="text-sm font-medium text-slate-700">
            Data de início
          </label>
          <input
            id="investment-date"
            name="startedAt"
            type="date"
            defaultValue={initialValues?.startedAt ?? getTodayInputValue()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="investment-notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="investment-notes"
          name="notes"
          rows={3}
          defaultValue={initialValues?.notes}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>

      <p className="text-xs text-slate-500">
        Este investimento não vira transação comum. Ele representa patrimônio preso à conta, separado do disponível.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel ?? (method === "POST" ? "Salvar investimento" : "Salvar alterações")}
      </button>
    </form>
  );
}
