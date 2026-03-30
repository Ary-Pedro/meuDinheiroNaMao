"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { dateInputToUtcIso, getTodayInputValue } from "@/modules/shared/utils/date";
import { formatCurrency } from "@/modules/shared/utils/currency";

type AccountOption = {
  id: string;
  name: string;
  currency: string;
};

type QuoteResponse = {
  ratesInBrl: Record<"BRL" | "USD" | "EUR", number>;
  asOf: string;
};

type Props = {
  accounts: AccountOption[];
  endpoint?: string;
  method?: "POST" | "PATCH";
  submitLabel?: string;
  initialValues?: {
    sourceAccountId: string;
    destinationAccountId: string;
    sourceAmountNative: string;
    occurredAt: string;
    description: string;
    notes: string;
  };
  onSuccess?: () => void;
};

function normalizeCurrency(value?: string): "BRL" | "USD" | "EUR" {
  const normalized = (value ?? "BRL").toUpperCase();
  if (normalized === "USD" || normalized === "EUR") {
    return normalized;
  }

  return "BRL";
}

function convertAmount(amount: number, fromCurrency: "BRL" | "USD" | "EUR", toCurrency: "BRL" | "USD" | "EUR", ratesInBrl: Record<"BRL" | "USD" | "EUR", number>) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInBrl = fromCurrency === "BRL" ? amount : amount * ratesInBrl[fromCurrency];
  return toCurrency === "BRL" ? amountInBrl : amountInBrl / ratesInBrl[toCurrency];
}

export function TransfersForm({
  accounts,
  endpoint = "/api/finance/transfers",
  method = "POST",
  submitLabel,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sourceAccountId, setSourceAccountId] = useState(initialValues?.sourceAccountId ?? accounts[0]?.id ?? "");
  const [destinationAccountId, setDestinationAccountId] = useState(
    initialValues?.destinationAccountId ?? accounts[1]?.id ?? accounts[0]?.id ?? ""
  );
  const [sourceAmountNative, setSourceAmountNative] = useState(initialValues?.sourceAmountNative ?? "");
  const [occurredAt, setOccurredAt] = useState(initialValues?.occurredAt ?? getTodayInputValue());
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sourceAccount = useMemo(() => accounts.find((item) => item.id === sourceAccountId), [accounts, sourceAccountId]);
  const destinationAccount = useMemo(
    () => accounts.find((item) => item.id === destinationAccountId),
    [accounts, destinationAccountId]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadQuote() {
      const endpointUrl =
        occurredAt === getTodayInputValue()
          ? "/api/finance/exchange-rates/current"
          : `/api/finance/exchange-rates/historical?date=${occurredAt}`;

      try {
        const response = await fetch(endpointUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha na cotação");
        }

        const body = (await response.json()) as QuoteResponse;
        if (!cancelled) {
          setQuote(body);
          setQuoteError(null);
        }
      } catch {
        if (!cancelled) {
          setQuote(null);
          setQuoteError("Não foi possível carregar a cotação desta data.");
        }
      }
    }

    loadQuote();

    return () => {
      cancelled = true;
    };
  }, [occurredAt]);

  const estimatedDestinationAmount = useMemo(() => {
    const parsedAmount = Number(sourceAmountNative);
    if (!quote || !sourceAccount || !destinationAccount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return 0;
    }

    return convertAmount(
      parsedAmount,
      normalizeCurrency(sourceAccount.currency),
      normalizeCurrency(destinationAccount.currency),
      quote.ratesInBrl
    );
  }, [destinationAccount, quote, sourceAccount, sourceAmountNative]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      sourceAccountId: String(formData.get("sourceAccountId") ?? ""),
      destinationAccountId: String(formData.get("destinationAccountId") ?? ""),
      sourceAmountNative: Number(formData.get("sourceAmountNative") ?? 0),
      occurredAt: dateInputToUtcIso(String(formData.get("occurredAt") ?? getTodayInputValue())),
      description: String(formData.get("description") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao salvar transferência." }));
        setError(body.error ?? "Falha ao salvar transferência.");
        return;
      }

      form.reset();
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="transfer-source-account" className="text-sm font-medium text-slate-700">
            Banco origem
          </label>
          <select
            id="transfer-source-account"
            name="sourceAccountId"
            required
            value={sourceAccountId}
            onChange={(event) => setSourceAccountId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="transfer-destination-account" className="text-sm font-medium text-slate-700">
            Banco destino
          </label>
          <select
            id="transfer-destination-account"
            name="destinationAccountId"
            required
            value={destinationAccountId}
            onChange={(event) => setDestinationAccountId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="transfer-source-amount" className="text-sm font-medium text-slate-700">
            Valor na moeda de origem
          </label>
          <input
            id="transfer-source-amount"
            name="sourceAmountNative"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={sourceAmountNative}
            onChange={(event) => setSourceAmountNative(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="transfer-date" className="text-sm font-medium text-slate-700">
            Data da transferência
          </label>
          <input
            id="transfer-date"
            name="occurredAt"
            type="date"
            value={occurredAt}
            onChange={(event) => setOccurredAt(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Prévia da transferência</p>
        <p className="mt-1">
          {sourceAccount ? `${sourceAccount.name}: ${sourceAccount.currency}` : "Origem"} →{" "}
          {destinationAccount ? `${destinationAccount.name}: ${destinationAccount.currency}` : "Destino"}
        </p>
        <p className="mt-1">
          Entrada estimada:{" "}
          <strong className="text-slate-900">
            {destinationAccount
              ? formatCurrency(estimatedDestinationAmount, destinationAccount.currency)
              : formatCurrency(estimatedDestinationAmount)}
          </strong>
        </p>
        {quote ? <p className="mt-1 text-xs text-slate-500">Cotação usada: {quote.asOf}</p> : null}
        {quoteError ? <p className="mt-1 text-xs text-rose-600">{quoteError}</p> : null}
      </div>

      <div className="grid gap-1">
        <label htmlFor="transfer-description" className="text-sm font-medium text-slate-700">
          Descrição
        </label>
        <input
          id="transfer-description"
          name="description"
          defaultValue={initialValues?.description}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Ex.: Intercâmbio Nubank → Itaú"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="transfer-notes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="transfer-notes"
          name="notes"
          rows={3}
          defaultValue={initialValues?.notes}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel ?? (method === "POST" ? "Salvar transferência" : "Atualizar transferência")}
      </button>
    </form>
  );
}
