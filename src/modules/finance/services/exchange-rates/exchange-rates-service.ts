export const supportedCurrencies = ["BRL", "USD", "EUR"] as const;

export type SupportedCurrency = (typeof supportedCurrencies)[number];

type AwesomeRate = {
  bid?: string;
  create_date?: string;
  timestamp?: string;
};

type AwesomeResponse = {
  USDBRL?: AwesomeRate;
  EURBRL?: AwesomeRate;
};

type RateSnapshot = {
  ratesInBrl: Record<SupportedCurrency, number>;
  asOf: string;
};

function toDateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function endOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function nowUtc() {
  return new Date();
}

function parseBid(value?: string) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

async function fetchAwesomeJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Falha ao obter cotação.");
  }

  return response.json();
}

export class ExchangeRatesService {
  async getCurrentRates(): Promise<RateSnapshot> {
    const body = (await fetchAwesomeJson(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"
    )) as AwesomeResponse;

    const usdBrl = parseBid(body.USDBRL?.bid);
    const eurBrl = parseBid(body.EURBRL?.bid);

    if (!usdBrl || !eurBrl) {
      throw new Error("Cotação atual inválida.");
    }

    return {
      ratesInBrl: {
        BRL: 1,
        USD: usdBrl,
        EUR: eurBrl,
      },
      asOf: body.USDBRL?.create_date ?? body.EURBRL?.create_date ?? nowUtc().toISOString(),
    };
  }

  async getRatesForDate(referenceDate: Date): Promise<RateSnapshot> {
    const safeDate = new Date(referenceDate);

    if (endOfUtcDay(safeDate) >= nowUtc()) {
      return this.getCurrentRates();
    }

    const dateKey = toDateKey(safeDate);
    const [usdBody, eurBody] = (await Promise.all([
      fetchAwesomeJson(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/1?start_date=${dateKey}&end_date=${dateKey}`),
      fetchAwesomeJson(`https://economia.awesomeapi.com.br/json/daily/EUR-BRL/1?start_date=${dateKey}&end_date=${dateKey}`),
    ])) as [AwesomeRate | AwesomeRate[], AwesomeRate | AwesomeRate[]];

    const usdRate = Array.isArray(usdBody) ? usdBody[0] : usdBody;
    const eurRate = Array.isArray(eurBody) ? eurBody[0] : eurBody;

    const usdBrl = parseBid(usdRate?.bid);
    const eurBrl = parseBid(eurRate?.bid);

    if (!usdBrl || !eurBrl) {
      throw new Error("Cotação histórica inválida.");
    }

    return {
      ratesInBrl: {
        BRL: 1,
        USD: usdBrl,
        EUR: eurBrl,
      },
      asOf: usdRate?.create_date ?? eurRate?.create_date ?? safeDate.toISOString(),
    };
  }

  convert(amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency, ratesInBrl: Record<SupportedCurrency, number>) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const amountInBrl = fromCurrency === "BRL" ? amount : amount * ratesInBrl[fromCurrency];
    return toCurrency === "BRL" ? amountInBrl : amountInBrl / ratesInBrl[toCurrency];
  }

  async resolveSnapshot(referenceDate: Date, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency, amount: number) {
    const snapshot = await this.getRatesForDate(referenceDate);
    const converted = this.convert(amount, fromCurrency, toCurrency, snapshot.ratesInBrl);

    return {
      ...snapshot,
      convertedAmount: Number(converted.toFixed(2)),
      amountBrlSnapshot:
        fromCurrency === "BRL" ? Number(amount.toFixed(2)) : Number((amount * snapshot.ratesInBrl[fromCurrency]).toFixed(2)),
      fxRateApplied:
        fromCurrency === toCurrency ? 1 : Number((snapshot.ratesInBrl[fromCurrency] / snapshot.ratesInBrl[toCurrency]).toFixed(8)),
    };
  }
}

export function normalizeSupportedCurrency(value?: string): SupportedCurrency {
  const normalized = (value ?? "BRL").trim().toUpperCase();
  if (normalized === "USD" || normalized === "EUR") {
    return normalized;
  }

  return "BRL";
}
