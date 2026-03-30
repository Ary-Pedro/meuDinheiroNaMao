import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

export async function GET(request: Request) {
  return executeRoute(() => financeComposition.listTransfersController.handle(new URL(request.url)));
}

export async function POST(request: Request) {
  return executeRoute(() => financeComposition.createTransferController.handle(request));
}
