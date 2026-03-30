import { AppError } from "@/server/core/errors/app-error";
import { TransactionsRepository } from "../../repositories/transactions-repository";

export class DeleteTransactionService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute(userId: string, transactionId: string) {
    const existing = await this.transactionsRepository.findById(userId, transactionId);

    if (!existing) {
      throw new AppError("Transação não encontrada.", 404);
    }

    if (existing.transferGroupId) {
      throw new AppError("Use o fluxo de transferência para excluir esta movimentação.", 400);
    }

    await this.transactionsRepository.deleteById(userId, transactionId);
    return { ok: true };
  }
}
