import { executeRoute } from "@/server/core/http/execute-route";
import { getRatesInBrl } from "@/modules/finance/services/exchange-rates/exchange-rate-provider";

function toUtcDate(value: string | null) {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0));
}

export async function GET(request: Request) {
  return executeRoute(async () => {
    const { searchParams } = new URL(request.url);
    const date = toUtcDate(searchParams.get("date"));

    if (!date) {
      return {
        status: 400,
        body: { error: "Informe uma data válida no formato YYYY-MM-DD." },
      };
    }

    const quote = await getRatesInBrl(date);

    return {
      status: 200,
      body: quote,
    };
  });
}
