"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dateInputToUtcIso } from "@/modules/shared/utils/date";
import type { OptionItem } from "@/modules/shared/utils/labels";

type AccountOption = {
  id: string;
  name: string;
  currency?: string;
};

type CategoryOption = {
  id: string;
  name: string;
  kind: string;
  subcategories: { id: string; name: string }[];
};

type Props = {
  transactionId: string;
  transactionTypes: OptionItem[];
  accounts: AccountOption[];
  categories: CategoryOption[];
  initialValues: {
    type: string;
    amountNative: string;
    occurredAt: string;
    description: string;
    accountId: string;
    categoryId: string;
    subcategoryId: string;
  };
  onSuccess?: () => void;
};

export function TransactionEditForm({
  transactionId,
  transactionTypes,
  accounts,
  categories,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(initialValues.type);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialValues.categoryId);
  const [selectedAccountId, setSelectedAccountId] = useState(initialValues.accountId);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId),
    [accounts, selectedAccountId]
  );

  const availableCategories = useMemo(
    () => categories.filter((category) => category.kind === selectedType),
    [categories, selectedType]
  );

  const availableSubcategories = useMemo(
    () => availableCategories.find((category) => category.id === selectedCategoryId)?.subcategories ?? [],
    [availableCategories, selectedCategoryId]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      type: String(formData.get("type") ?? ""),
      amountNative: Number(formData.get("amountNative") ?? 0),
      accountId: String(formData.get("accountId") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      subcategoryId: String(formData.get("subcategoryId") ?? "") || undefined,
      occurredAt: dateInputToUtcIso(String(formData.get("occurredAt") ?? "")),
      description: String(formData.get("description") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch(`/api/finance/transactions/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao salvar transação." }));
        setError(body.error ?? "Falha ao salvar transação.");
        return;
      }

      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <span className="text-sm font-medium text-slate-700">Tipo</span>
        <div className="flex min-w-full gap-2 sm:grid sm:grid-cols-2">
          {transactionTypes.map((type) => (
            <label
              key={type.value}
              className={`min-w-[8.5rem] cursor-pointer rounded-xl border px-3 py-2 text-center text-sm font-medium transition sm:min-w-0 ${
                selectedType === type.value
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={type.value}
                className="sr-only"
                checked={selectedType === type.value}
                onChange={() => {
                  setSelectedType(type.value);
                  setSelectedCategoryId("");
                }}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor={`transaction-edit-account-${transactionId}`} className="text-sm font-medium text-slate-700">
            Conta
          </label>
          <select
            id={`transaction-edit-account-${transactionId}`}
            name="accountId"
            required
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
                {account.currency ? ` (${account.currency})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor={`transaction-edit-date-${transactionId}`} className="text-sm font-medium text-slate-700">
            Data
          </label>
          <input
            id={`transaction-edit-date-${transactionId}`}
            name="occurredAt"
            type="date"
            defaultValue={initialValues.occurredAt}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor={`transaction-edit-amount-${transactionId}`} className="text-sm font-medium text-slate-700">
            Valor na moeda da conta
          </label>
          <input
            id={`transaction-edit-amount-${transactionId}`}
            name="amountNative"
            type="number"
            step="0.01"
            required
            defaultValue={initialValues.amountNative}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
          <p className="text-xs text-slate-500">Moeda atual da conta: {selectedAccount?.currency ?? "BRL"}.</p>
        </div>

        <div className="grid gap-1">
          <label htmlFor={`transaction-edit-category-${transactionId}`} className="text-sm font-medium text-slate-700">
            Categoria
          </label>
          <select
            id={`transaction-edit-category-${transactionId}`}
            name="categoryId"
            required
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value="">Selecione</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor={`transaction-edit-subcategory-${transactionId}`} className="text-sm font-medium text-slate-700">
          Subcategoria
        </label>
        <select
          id={`transaction-edit-subcategory-${transactionId}`}
          name="subcategoryId"
          defaultValue={initialValues.subcategoryId}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        >
          <option value="">Sem subcategoria</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor={`transaction-edit-description-${transactionId}`} className="text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          id={`transaction-edit-description-${transactionId}`}
          name="description"
          rows={3}
          defaultValue={initialValues.description}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Salvar lançamento"}
      </button>
    </form>
  );
}
