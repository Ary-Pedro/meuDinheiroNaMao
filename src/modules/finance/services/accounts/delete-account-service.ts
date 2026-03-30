import { AppError } from "@/server/core/errors/app-error";
import { AccountsRepository } from "../../repositories/accounts-repository";

export class DeleteAccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(userId: string, accountId: string) {
    const existing = await this.accountsRepository.findById(userId, accountId);

    if (!existing) {
      throw new AppError("Conta financeira não encontrada.", 404);
    }

    return this.accountsRepository.deleteOrArchive(userId, accountId);
  }
}
