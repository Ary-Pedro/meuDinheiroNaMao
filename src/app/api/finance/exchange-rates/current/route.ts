import { executeRoute } from "@/server/core/http/execute-route";
import { getRatesInBrl } from "@/modules/finance/services/exchange-rates/exchange-rate-provider";

export async function GET() {
  return executeRoute(async () => {
    const quote = await getRatesInBrl();

    return {
      status: 200,
      body: quote,
    };
  });
}
