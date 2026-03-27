import { executeRoute } from "@/server/core/http/execute-route";

const SUPPORTED = ["BRL", "USD", "EUR"] as const;

type SupportedCurrency = (typeof SUPPORTED)[number];

type AwesomeRate = {
  bid?: string;
  create_date?: string;
};

type AwesomeResponse = {
  USDBRL?: AwesomeRate;
  EURBRL?: AwesomeRate;
};

export async function GET() {
  return executeRoute(async () => {
    const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: 502,
        body: { error: "Falha ao obter cotação em tempo real." },
      };
    }

    const body = (await response.json()) as AwesomeResponse;

    const usdBrl = Number(body.USDBRL?.bid ?? 0);
    const eurBrl = Number(body.EURBRL?.bid ?? 0);

    if (!Number.isFinite(usdBrl) || usdBrl <= 0 || !Number.isFinite(eurBrl) || eurBrl <= 0) {
      return {
        status: 502,
        body: { error: "Cotação retornou em formato inválido." },
      };
    }

    const now = new Date().toISOString();

    const ratesInBrl: Record<SupportedCurrency, number> = {
      BRL: 1,
      USD: usdBrl,
      EUR: eurBrl,
    };

    return {
      status: 200,
      body: {
        base: "BRL",
        supported: SUPPORTED,
        ratesInBrl,
        asOf: body.USDBRL?.create_date ?? body.EURBRL?.create_date ?? now,
      },
    };
  });
}
