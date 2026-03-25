import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { listTransactionsFiltersSchema } from "../../validations/transaction-validation";
import { ListTransactionsService } from "../../services/transactions/list-transactions-service";

export class ListTransactionsController {
  constructor(private readonly listTransactionsService: ListTransactionsService) {}

  async handle(url: URL): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = listTransactionsFiltersSchema.parse(Object.fromEntries(url.searchParams.entries()));
    const transactions = await this.listTransactionsService.execute(user.id, payload);
    return { status: 200, body: transactions };
  }
}
