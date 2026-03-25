import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { createTransactionSchema } from "../../validations/transaction-validation";
import { CreateTransactionService } from "../../services/transactions/create-transaction-service";

export class CreateTransactionController {
  constructor(private readonly createTransactionService: CreateTransactionService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createTransactionSchema.parse(await request.json());
    const transaction = await this.createTransactionService.execute({ userId: user.id, ...payload });
    return { status: 201, body: transaction };
  }
}
