"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OptionItem } from "@/modules/shared/utils/labels";
import { TransactionEditForm } from "./transaction-edit-form";

type Props = {
  transaction: {
    id: string;
    type: string;
    amountNative: string;
    occurredAt: string;
    description: string | null;
    account: { id: string; name: string; currency: string };
    category: { id: string; name: string; kind: string } | null;
    subcategory: { id: string; name: string } | null;
  };
  transactionTypes: OptionItem[];
  accounts: { id: string; name: string; currency: string }[];
  categories: { id: string; name: string; kind: string; subcategories: { id: string; name: string }[] }[];
};

export function TransactionRowActions({ transaction, transactionTypes, accounts, categories }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const response = await fetch(`/api/finance/transactions/${transaction.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao excluir transação." }));
        setDeleteError(body.error ?? "Falha ao excluir transação.");
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
          <TransactionEditForm
            transactionId={transaction.id}
            transactionTypes={transactionTypes}
            accounts={accounts}
            categories={categories}
            initialValues={{
              type: transaction.type,
              amountNative: transaction.amountNative,
              occurredAt: transaction.occurredAt.slice(0, 10),
              description: transaction.description ?? "",
              accountId: transaction.account.id,
              categoryId: transaction.category?.id ?? "",
              subcategoryId: transaction.subcategory?.id ?? "",
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
