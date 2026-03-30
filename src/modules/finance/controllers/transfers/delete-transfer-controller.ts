import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DeleteTransferService } from "../../services/transfers/delete-transfer-service";

export class DeleteTransferController {
  constructor(private readonly deleteTransferService: DeleteTransferService) {}

  async handle(transferGroupId: string): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const result = await this.deleteTransferService.execute(user.id, transferGroupId);
    return { status: 200, body: result };
  }
}
