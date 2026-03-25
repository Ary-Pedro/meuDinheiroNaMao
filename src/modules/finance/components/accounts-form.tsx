"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import type { OptionItem } from "@/modules/shared/utils/labels";

type Props = {
  accountTypes: OptionItem[];
};

export function AccountsForm({ accountTypes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      type: String(formData.get("type") ?? ""),
      institution: String(formData.get("institution") ?? ""),
      currency: String(formData.get("currency") ?? "BRL"),
      initialBalance: Number(formData.get("initialBalance") ?? 0),
    };

    startTransition(async () => {
      const response = await fetch("/api/finance/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao criar conta." }));
        setError(body.error ?? "Falha ao criar conta.");
        return;
      }

      event.currentTarget.reset();
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="account-name" className="text-sm font-medium text-slate-700">
          Nome da conta
        </label>
        <input
          id="account-name"
          name="name"
          required
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Ex.: Nubank"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="account-type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select id="account-type" name="type" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900">
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="account-balance" className="text-sm font-medium text-slate-700">
            Saldo inicial
          </label>
          <input
            id="account-balance"
            name="initialBalance"
            type="number"
            step="0.01"
            defaultValue="0"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="account-institution" className="text-sm font-medium text-slate-700">
            Instituição
          </label>
          <input
            id="account-institution"
            name="institution"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            placeholder="Opcional"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="account-currency" className="text-sm font-medium text-slate-700">
            Moeda
          </label>
          <input
            id="account-currency"
            name="currency"
            maxLength={3}
            defaultValue="BRL"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 uppercase text-slate-900"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Criar conta"}
      </button>
    </form>
  );
}