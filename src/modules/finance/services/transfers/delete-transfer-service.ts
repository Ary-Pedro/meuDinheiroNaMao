import { AppError } from "@/server/core/errors/app-error";
import { TransfersRepository } from "../../repositories/transfers-repository";

export class DeleteTransferService {
  constructor(private readonly transfersRepository: TransfersRepository) {}

  async execute(userId: string, transferGroupId: string) {
    const existing = await this.transfersRepository.findById(userId, transferGroupId);
    if (!existing) {
      throw new AppError("Transferência não encontrada.", 404);
    }

    await this.transfersRepository.deleteById(transferGroupId);
    return { success: true };
  }
}
