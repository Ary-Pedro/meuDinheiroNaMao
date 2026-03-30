import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

type Params = {
  params: Promise<{
    transactionId: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { transactionId } = await params;
  return executeRoute(() => financeComposition.updateTransactionController.handle(request, transactionId));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { transactionId } = await params;
  return executeRoute(() => financeComposition.deleteTransactionController.handle(transactionId));
}
