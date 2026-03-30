import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

type Params = {
  params: Promise<{
    accountId: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { accountId } = await params;
  return executeRoute(() => financeComposition.updateAccountController.handle(request, accountId));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { accountId } = await params;
  return executeRoute(() => financeComposition.deleteAccountController.handle(accountId));
}
