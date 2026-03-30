import { AppError } from "@/server/core/errors/app-error";
import { AccountInvestmentsRepository } from "../repositories/account-investments-repository";

export class DeleteAccountInvestmentService {
  constructor(private readonly accountInvestmentsRepository: AccountInvestmentsRepository) {}

  async execute(userId: string, investmentId: string) {
    const existing = await this.accountInvestmentsRepository.findById(userId, investmentId);
    if (!existing) {
      throw new AppError("Investimento não encontrado.", 404);
    }

    await this.accountInvestmentsRepository.deleteById(userId, investmentId);
    return { ok: true };
  }
}
