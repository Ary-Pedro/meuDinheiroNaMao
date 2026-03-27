"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { formatCurrency } from "@/modules/shared/utils/currency";
import { dateInputToUtcIso, getTodayInputValue } from "@/modules/shared/utils/date";
import type { OptionItem } from "@/modules/shared/utils/labels";

const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR"] as const;
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

type AccountOption = {
  id: string;
  name: string;
  currency: string;
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

type ExchangeRatesResponse = {
  ratesInBrl: Record<SupportedCurrency, number>;
  asOf: string;
};

function normalizeCurrency(value?: string): SupportedCurrency {
  const normalized = (value ?? "BRL").trim().toUpperCase();
  if (normalized === "USD" || normalized === "EUR") {
    return normalized;
  }

  return "BRL";
}

function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  ratesInBrl: Record<SupportedCurrency, number>
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInBrl = fromCurrency === "BRL" ? amount : amount * ratesInBrl[fromCurrency];
  const converted = toCurrency === "BRL" ? amountInBrl : amountInBrl / ratesInBrl[toCurrency];
  return converted;
}

export function TransactionsForm({ accounts, categories, transactionTypes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>(transactionTypes[0]?.value ?? "EXPENSE");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<SupportedCurrency>("BRL");
  const [amountInput, setAmountInput] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number> | null>(null);
  const [exchangeAsOf, setExchangeAsOf] = useState<string | null>(null);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAccountCurrency = useMemo(() => {
    const account = accounts.find((item) => item.id === selectedAccountId);
    return normalizeCurrency(account?.currency);
  }, [accounts, selectedAccountId]);

  const parsedAmount = useMemo(() => Number(amountInput), [amountInput]);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const convertedAmount = useMemo(() => {
    if (!isAmountValid) {
      return 0;
    }

    if (!exchangeRates) {
      return inputCurrency === selectedAccountCurrency ? parsedAmount : 0;
    }

    return convertCurrency(parsedAmount, inputCurrency, selectedAccountCurrency, exchangeRates);
  }, [exchangeRates, inputCurrency, isAmountValid, parsedAmount, selectedAccountCurrency]);

  const canConvert = inputCurrency === selectedAccountCurrency || Boolean(exchangeRates);

  useEffect(() => {
    let cancelled = false;

    async function loadExchangeRates(background = true) {
      if (!background && !cancelled) {
        setIsRefreshingRates(true);
      }

      try {
        const response = await fetch("/api/finance/exchange-rates", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha na cotação");
        }

        const body = (await response.json()) as ExchangeRatesResponse;
        if (!cancelled) {
          setExchangeRates(body.ratesInBrl);
          setExchangeAsOf(body.asOf);
          setExchangeError(null);
        }
      } catch {
        if (!cancelled) {
          setExchangeError("Cotação indisponível no momento. Tente novamente em instantes.");
        }
      } finally {
        if (!background && !cancelled) {
          setIsRefreshingRates(false);
        }
      }
    }

    loadExchangeRates();
    const intervalId = setInterval(() => loadExchangeRates(), 15000);

    const onWindowFocus = () => {
      loadExchangeRates();
    };

    window.addEventListener("focus", onWindowFocus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, []);

  async function handleRefreshRates() {
    setExchangeError(null);
    setIsRefreshingRates(true);

    try {
      const response = await fetch("/api/finance/exchange-rates", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Falha na cotação");
      }

      const body = (await response.json()) as ExchangeRatesResponse;
      setExchangeRates(body.ratesInBrl);
      setExchangeAsOf(body.asOf);
      setExchangeError(null);
    } catch {
      setExchangeError("Cotação indisponível no momento. Tente novamente em instantes.");
    } finally {
      setIsRefreshingRates(false);
    }
  }

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

    if (!isAmountValid) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    if (!canConvert) {
      setError("Sem cotação em tempo real para converter a moeda escolhida.");
      return;
    }

    const payload = {
      type: String(formData.get("type") ?? ""),
      amount: Number(convertedAmount.toFixed(2)),
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
      setSelectedAccountId("");
      setInputCurrency("BRL");
      setAmountInput("");
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <span className="text-sm font-medium text-slate-700">Tipo</span>
        <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-full gap-2 sm:grid sm:grid-cols-3">
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
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
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
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value="">Selecione</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({normalizeCurrency(account.currency)})
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="transaction-input-currency" className="text-sm font-medium text-slate-700">
            Moeda informada
          </label>
          <select
            id="transaction-input-currency"
            value={inputCurrency}
            onChange={(event) => setInputCurrency(normalizeCurrency(event.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Moeda de salvamento</span>
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
            {selectedAccountCurrency} (pela conta selecionada)
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        {exchangeError ? (
          <p>{exchangeError}</p>
        ) : (
          <>
            {exchangeRates ? (
              <p>
                Cotação em tempo real: 1 USD = {formatCurrency(exchangeRates.USD, "BRL")} | 1 EUR = {formatCurrency(exchangeRates.EUR, "BRL")}
              </p>
            ) : (
              <p>Atualizando cotação em tempo real...</p>
            )}
            {selectedAccountId && isAmountValid ? (
              <p className="mt-1">
                Valor a salvar: {formatCurrency(convertedAmount, selectedAccountCurrency)} ({selectedAccountCurrency})
              </p>
            ) : null}
            {exchangeAsOf ? <p className="mt-1 text-slate-500">Atualizado em: {exchangeAsOf}</p> : null}
          </>
        )}

        <button
          type="button"
          onClick={handleRefreshRates}
          disabled={isRefreshingRates}
          className="mt-2 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {isRefreshingRates ? "Atualizando cotação..." : "Atualizar cotação agora"}
        </button>
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
        disabled={isPending || !accounts.length || !availableCategories.length || !canConvert}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Salvar transação"}
      </button>
    </form>
  );
}
