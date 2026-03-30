"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AccountInvestmentForm } from "./account-investment-form";

type Props = {
  investment: {
    id: string;
    name: string;
    investmentType: string;
    principalAmount: string;
    currentValue: string;
    incomeAmount: string;
    scopeMode: string;
    startedAt: string;
    notes: string | null;
    account: { id: string; name: string; currency: string };
  };
  accounts: { id: string; name: string; currency: string }[];
};

export function AccountInvestmentRowActions({ investment, accounts }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/investments/operations/${investment.id}`, { method: "DELETE" });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao arquivar investimento." }));
        setError(body.error ?? "Falha ao arquivar investimento.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        >
          {isEditing ? "Fechar edição" : "Editar"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 disabled:opacity-70"
        >
          {isPending ? "Arquivando..." : "Arquivar"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {isEditing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <AccountInvestmentForm
            accounts={accounts}
            endpoint={`/api/investments/operations/${investment.id}`}
            method="PATCH"
            submitLabel="Salvar investimento"
            initialValues={{
              accountId: investment.account.id,
              name: investment.name,
              investmentType: investment.investmentType,
              principalAmount: investment.principalAmount,
              currentValue: investment.currentValue,
              incomeAmount: investment.incomeAmount,
              scopeMode: investment.scopeMode,
              startedAt: investment.startedAt.slice(0, 10),
              notes: investment.notes ?? "",
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
