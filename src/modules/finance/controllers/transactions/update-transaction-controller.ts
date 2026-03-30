import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateTransactionService } from "../../services/transactions/update-transaction-service";
import { updateTransactionSchema } from "../../validations/transaction-validation";

export class UpdateTransactionController {
  constructor(private readonly updateTransactionService: UpdateTransactionService) {}

  async handle(request: Request, transactionId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateTransactionSchema.parse(await request.json());
    const transaction = await this.updateTransactionService.execute({ userId: user.id, transactionId, ...payload });
    return { status: 200, body: transaction };
  }
}
