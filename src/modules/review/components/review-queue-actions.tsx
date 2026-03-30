"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AccountOption = {
  id: string;
  name: string;
};

type CategoryOption = {
  id: string;
  name: string;
  kind: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

type Props = {
  reviewItemId: string;
  importedEntry: {
    suggestedCategoryId: string | null;
  };
  accounts: AccountOption[];
  categories: CategoryOption[];
};

export function ReviewQueueActions({ reviewItemId, importedEntry, accounts, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState(importedEntry.suggestedCategoryId ?? "");
  const [error, setError] = useState<string | null>(null);

  const availableSubcategories = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId)?.subcategories ?? [],
    [categories, selectedCategoryId]
  );

  function handleResolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      action: "resolve",
      accountId: String(formData.get("accountId") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      subcategoryId: String(formData.get("subcategoryId") ?? "") || undefined,
    };

    startTransition(async () => {
      const response = await fetch(`/api/review/queue/${reviewItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao aprovar item." }));
        setError(body.error ?? "Falha ao aprovar item.");
        return;
      }

      router.refresh();
    });
  }

  function handleDismiss() {
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/review/queue/${reviewItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss" }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao descartar item." }));
        setError(body.error ?? "Falha ao descartar item.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <form className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-white p-3" onSubmit={handleResolve}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-slate-700" htmlFor={`review-account-${reviewItemId}`}>
            Conta de destino
          </label>
          <select
            id={`review-account-${reviewItemId}`}
            name="accountId"
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            defaultValue=""
          >
            <option value="">Selecione</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium text-slate-700" htmlFor={`review-category-${reviewItemId}`}>
            Categoria real
          </label>
          <select
            id={`review-category-${reviewItemId}`}
            name="categoryId"
            required
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-slate-700" htmlFor={`review-subcategory-${reviewItemId}`}>
          Subcategoria
        </label>
        <select
          id={`review-subcategory-${reviewItemId}`}
          name="subcategoryId"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          defaultValue=""
        >
          <option value="">Sem subcategoria</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {isPending ? "Processando..." : "Aprovar e virar transação"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDismiss}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-70"
        >
          Descartar item
        </button>
      </div>
    </form>
  );
}
