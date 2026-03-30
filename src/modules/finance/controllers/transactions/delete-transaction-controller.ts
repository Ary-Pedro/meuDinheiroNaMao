import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteTransactionService } from "../../services/transactions/delete-transaction-service";

export class DeleteTransactionController {
  constructor(private readonly deleteTransactionService: DeleteTransactionService) {}

  async handle(transactionId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteTransactionService.execute(user.id, transactionId);
    return { status: 200, body: result };
  }
}
