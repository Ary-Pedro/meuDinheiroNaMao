"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import type { OptionItem } from "@/modules/shared/utils/labels";

type Props = {
  accountTypes: OptionItem[];
  endpoint?: string;
  method?: "POST" | "PATCH";
  submitLabel?: string;
  initialValues?: {
    name: string;
    type: string;
    institution: string;
    currency: string;
    initialBalance: string;
  };
  onSuccess?: () => void;
};

export function AccountsForm({
  accountTypes,
  endpoint = "/api/finance/accounts",
  method = "POST",
  submitLabel,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      type: String(formData.get("type") ?? ""),
      institution: String(formData.get("institution") ?? ""),
      currency: String(formData.get("currency") ?? "BRL"),
      initialBalance: Number(formData.get("initialBalance") ?? 0),
    };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao criar conta." }));
        setError(body.error ?? "Falha ao criar conta.");
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
        <label htmlFor="account-name" className="text-sm font-medium text-slate-700">
          Nome da conta
        </label>
        <input
          id="account-name"
          name="name"
          required
          defaultValue={initialValues?.name}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Ex.: Nubank"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="account-type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="account-type"
            name="type"
            defaultValue={initialValues?.type ?? accountTypes[0]?.value}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="account-balance" className="text-sm font-medium text-slate-700">
            Saldo de abertura (opcional)
          </label>
          <input
            id="account-balance"
            name="initialBalance"
            type="number"
            step="0.01"
            defaultValue={initialValues?.initialBalance ?? "0"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        O saldo atual da conta é calculado dinamicamente pelo histórico de transações vinculadas.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="account-institution" className="text-sm font-medium text-slate-700">
            Instituição
          </label>
          <input
            id="account-institution"
            name="institution"
            defaultValue={initialValues?.institution}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            placeholder="Opcional"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="account-currency" className="text-sm font-medium text-slate-700">
            Moeda
          </label>
          <select
            id="account-currency"
            name="currency"
            defaultValue={initialValues?.currency ?? "BRL"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel ?? (method === "POST" ? "Criar conta" : "Salvar conta")}
      </button>
    </form>
  );
}
