"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { dateInputToUtcIso, getTodayInputValue } from "@/modules/shared/utils/date";
import type { OptionItem } from "@/modules/shared/utils/labels";

type AccountOption = {
  id: string;
  name: string;
};

type CategoryOption = {
  id: string;
  name: string;
  kind: string;
  subcategories: { id: string; name: string }[];
};

type Props = {
  accounts: AccountOption[];
  categories: CategoryOption[];
  transactionTypes: OptionItem[];
};

export function TransactionsForm({ accounts, categories, transactionTypes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>(transactionTypes[0]?.value ?? "EXPENSE");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const availableCategories = useMemo(
    () => categories.filter((category) => category.kind === selectedType),
    [categories, selectedType]
  );

  const availableSubcategories = useMemo(
    () => availableCategories.find((category) => category.id === selectedCategoryId)?.subcategories ?? [],
    [availableCategories, selectedCategoryId]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      type: String(formData.get("type") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      accountId: String(formData.get("accountId") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      subcategoryId: String(formData.get("subcategoryId") ?? "") || undefined,
      occurredAt: dateInputToUtcIso(String(formData.get("occurredAt") ?? getTodayInputValue())),
      description: String(formData.get("description") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao salvar transação." }));
        setError(body.error ?? "Falha ao salvar transação.");
        return;
      }

      form.reset();
      setSelectedType(transactionTypes[0]?.value ?? "EXPENSE");
      setSelectedCategoryId("");
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <span className="text-sm font-medium text-slate-700">Tipo</span>
        <div className="grid grid-cols-3 gap-2">
          {transactionTypes.map((type) => (
            <label
              key={type.value}
              className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${
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
          <label htmlFor="transaction-amount" className="text-sm font-medium text-slate-700">
            Valor
          </label>
          <input
            id="transaction-amount"
            name="amount"
            type="number"
            step="0.01"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="transaction-date" className="text-sm font-medium text-slate-700">
            Data
          </label>
          <input
            id="transaction-date"
            name="occurredAt"
            type="date"
            defaultValue={getTodayInputValue()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="transaction-account" className="text-sm font-medium text-slate-700">
            Conta
          </label>
          <select
            id="transaction-account"
            name="accountId"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
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
          <label htmlFor="transaction-category" className="text-sm font-medium text-slate-700">
            Categoria
          </label>
          <select
            id="transaction-category"
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
        <label htmlFor="transaction-subcategory" className="text-sm font-medium text-slate-700">
          Subcategoria
        </label>
        <select
          id="transaction-subcategory"
          name="subcategoryId"
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
        <label htmlFor="transaction-description" className="text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          id="transaction-description"
          name="description"
          rows={3}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Opcional"
        />
      </div>

      <p className="text-xs text-slate-500">
        No incremento 1, transferências são registradas de forma isolada e aparecem separadas do saldo.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || !accounts.length || !availableCategories.length}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Salvar transação"}
      </button>
    </form>
  );
}
