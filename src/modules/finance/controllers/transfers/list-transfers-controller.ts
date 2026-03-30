import type { ControllerResponse } from "@/server/core/http/controller-response";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { ListTransfersService } from "../../services/transfers/list-transfers-service";

export class ListTransfersController {
  constructor(private readonly listTransfersService: ListTransfersService) {}

  async handle(url: URL): Promise<ControllerResponse> {
    const user = await getCurrentUser();
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const accountId = url.searchParams.get("accountId");

    const transfers = await this.listTransfersService.execute(user.id, {
      from: from ? new Date(`${from}T00:00:00.000Z`) : undefined,
      to: to ? new Date(`${to}T23:59:59.999Z`) : undefined,
      accountId: accountId || undefined,
    });

    return { status: 200, body: transfers };
  }
}
