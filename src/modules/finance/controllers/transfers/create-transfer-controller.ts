import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { CreateTransferService } from "../../services/transfers/create-transfer-service";
import { createTransferSchema } from "../../validations/transaction-validation";

export class CreateTransferController {
  constructor(private readonly createTransferService: CreateTransferService) {}

  async handle(request: Request): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = createTransferSchema.parse(await request.json());
    const transfer = await this.createTransferService.execute(user.id, payload);
    return { status: 201, body: transfer };
  }
}
