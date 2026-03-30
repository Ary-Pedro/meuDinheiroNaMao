import { executeRoute } from "@/server/core/http/execute-route";
import { financeComposition } from "@/server/composition/finance";

type Params = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { categoryId } = await params;
  return executeRoute(() => financeComposition.updateCategoryController.handle(request, categoryId));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { categoryId } = await params;
  return executeRoute(() => financeComposition.deleteCategoryController.handle(categoryId));
}
