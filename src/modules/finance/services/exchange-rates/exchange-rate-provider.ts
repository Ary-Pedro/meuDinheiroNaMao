const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

type AwesomeRate = {
  bid?: string;
  create_date?: string;
};

type AwesomeResponse = {
  USDBRL?: AwesomeRate;
  EURBRL?: AwesomeRate;
};

function toYmd(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

export function normalizeCurrency(value?: string): SupportedCurrency {
  const normalized = (value ?? "BRL").trim().toUpperCase();
  if (normalized === "USD" || normalized === "EUR") {
    return normalized;
  }

  return "BRL";
}

export function isSameUtcDay(left: Date, right: Date) {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

export async function getRatesInBrl(referenceDate?: Date) {
  const targetDate = referenceDate ? startOfUtcDay(referenceDate) : null;
  const today = startOfUtcDay(new Date());
  const useHistorical = targetDate ? !isSameUtcDay(targetDate, today) : false;

  const endpoint = useHistorical
    ? `https://economia.awesomeapi.com.br/json/daily/USD-BRL,EUR-BRL/1?start_date=${toYmd(targetDate!)}&end_date=${toYmd(
        targetDate!
      )}`
    : "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL";

  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Falha ao obter cotação.");
  }

  const body = (await response.json()) as AwesomeResponse | AwesomeRate[];
  const usd = Array.isArray(body) ? body.find((entry) => (entry as { code?: string }).code === "USD") : body.USDBRL;
  const eur = Array.isArray(body) ? body.find((entry) => (entry as { code?: string }).code === "EUR") : body.EURBRL;

  const usdBrl = Number(usd?.bid ?? 0);
  const eurBrl = Number(eur?.bid ?? 0);

  if (!Number.isFinite(usdBrl) || usdBrl <= 0 || !Number.isFinite(eurBrl) || eurBrl <= 0) {
    throw new Error("Cotação retornou em formato inválido.");
  }

  return {
    supported: SUPPORTED_CURRENCIES,
    base: "BRL" as const,
    ratesInBrl: {
      BRL: 1,
      USD: usdBrl,
      EUR: eurBrl,
    } satisfies Record<SupportedCurrency, number>,
    asOf: usd?.create_date ?? eur?.create_date ?? new Date().toISOString(),
    source: useHistorical ? ("historical" as const) : ("current" as const),
  };
}

export function convertAmount(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  ratesInBrl: Record<SupportedCurrency, number>
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInBrl = fromCurrency === "BRL" ? amount : amount * ratesInBrl[fromCurrency];
  return toCurrency === "BRL" ? amountInBrl : amountInBrl / ratesInBrl[toCurrency];
}

export async function buildCurrencySnapshot(amountNative: number, currency: SupportedCurrency, referenceDate: Date) {
  const quote = await getRatesInBrl(referenceDate);
  const amountBrlSnapshot = convertAmount(amountNative, currency, "BRL", quote.ratesInBrl);
  const fxRateApplied = currency === "BRL" ? 1 : quote.ratesInBrl[currency];

  return {
    currency,
    amountNative,
    amountBrlSnapshot,
    fxRateApplied,
    fxReferenceAt: new Date(quote.asOf),
    quote,
  };
}
