import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { UpdateTransferService } from "../../services/transfers/update-transfer-service";
import { updateTransferSchema } from "../../validations/transaction-validation";

export class UpdateTransferController {
  constructor(private readonly updateTransferService: UpdateTransferService) {}

  async handle(request: Request, transferGroupId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const payload = updateTransferSchema.parse(await request.json());
    const transfer = await this.updateTransferService.execute(user.id, transferGroupId, payload);
    return { status: 200, body: transfer };
  }
}
