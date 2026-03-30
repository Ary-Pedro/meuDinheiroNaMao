import { executeRoute } from "@/server/core/http/execute-route";
import { investmentsComposition } from "@/server/composition/investments";

type Params = {
  investmentId: string;
};

export async function PATCH(request: Request, { params }: { params: Promise<Params> }) {
  const { investmentId } = await params;
  return executeRoute(() => investmentsComposition.updateAccountInvestmentController.handle(request, investmentId));
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const { investmentId } = await params;
  return executeRoute(() => investmentsComposition.deleteAccountInvestmentController.handle(investmentId));
}
