import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

export async function GET(request: Request) {
  return executeRoute(async () => {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    try {
      const snapshot = dateParam
        ? await financeComposition.exchangeRatesService.getRatesForDate(new Date(dateParam))
        : await financeComposition.exchangeRatesService.getCurrentRates();

      return {
        status: 200,
        body: {
          base: "BRL",
          supported: ["BRL", "USD", "EUR"],
          ratesInBrl: snapshot.ratesInBrl,
          asOf: snapshot.asOf,
          mode: dateParam ? "historical" : "current",
        },
      };
    } catch {
      return {
        status: 502,
        body: { error: dateParam ? "Falha ao obter cotação histórica." : "Falha ao obter cotação atual." },
      };
    }
  });
}
