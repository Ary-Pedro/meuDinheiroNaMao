"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OptionItem } from "@/modules/shared/utils/labels";
import { AccountsForm } from "./accounts-form";

type Props = {
  account: {
    id: string;
    name: string;
    type: string;
    institution: string | null;
    currency: string;
    initialBalance: string;
  };
  accountTypes: OptionItem[];
};

export function AccountRowActions({ account, accountTypes }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const response = await fetch(`/api/finance/accounts/${account.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao excluir conta." }));
        setDeleteError(body.error ?? "Falha ao excluir conta.");
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
          {isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {deleteError ? <p className="text-sm text-red-600">{deleteError}</p> : null}

      {isEditing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <AccountsForm
            accountTypes={accountTypes}
            endpoint={`/api/finance/accounts/${account.id}`}
            method="PATCH"
            submitLabel="Salvar alterações"
            initialValues={{
              name: account.name,
              type: account.type,
              institution: account.institution ?? "",
              currency: account.currency,
              initialBalance: account.initialBalance,
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
