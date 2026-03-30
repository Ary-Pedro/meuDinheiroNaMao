import type { TransferResponse } from "../../models/finance-types";
import { serializeTransfer } from "../../models/serializers";
import { TransfersRepository } from "../../repositories/transfers-repository";

export class ListTransfersService {
  constructor(private readonly transfersRepository: TransfersRepository) {}

  async execute(userId: string, filters?: { from?: Date; to?: Date; accountId?: string }): Promise<TransferResponse[]> {
    const groups = await this.transfersRepository.listByUser(userId, filters);
    return groups.map(serializeTransfer);
  }
}
