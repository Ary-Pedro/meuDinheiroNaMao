import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

export async function GET() {
  return executeRoute(() => financeComposition.listAccountsController.handle());
}

export async function POST(request: Request) {
  return executeRoute(() => financeComposition.createAccountController.handle(request));
}
