"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TransfersForm } from "./transfers-form";

type Props = {
  transfer: {
    id: string;
    occurredAt: string;
    description: string | null;
    notes: string | null;
    sourceAccount: { id: string; name: string; currency: string };
    destinationAccount: { id: string; name: string; currency: string };
    sourceAmountNative: string;
  };
  accounts: { id: string; name: string; currency: string }[];
};

export function TransferRowActions({ transfer, accounts }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const response = await fetch(`/api/finance/transfers/${transfer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao excluir transferência." }));
        setDeleteError(body.error ?? "Falha ao excluir transferência.");
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
          <TransfersForm
            accounts={accounts}
            endpoint={`/api/finance/transfers/${transfer.id}`}
            method="PATCH"
            submitLabel="Salvar transferência"
            initialValues={{
              sourceAccountId: transfer.sourceAccount.id,
              destinationAccountId: transfer.destinationAccount.id,
              sourceAmountNative: transfer.sourceAmountNative,
              occurredAt: transfer.occurredAt.slice(0, 10),
              description: transfer.description ?? "",
              notes: transfer.notes ?? "",
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
