const SUPPORTED_CURRENCIES = new Set(["BRL", "USD", "EUR"]);

export function formatCurrency(value: string | number, currency = "BRL") {
  const numeric = typeof value === "string" ? Number(value) : value;
  const safeCurrency = SUPPORTED_CURRENCIES.has(currency.toUpperCase())
    ? currency.toUpperCase()
    : "BRL";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}
