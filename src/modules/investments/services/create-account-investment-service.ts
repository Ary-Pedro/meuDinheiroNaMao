import { AppError } from "@/server/core/errors/app-error";
import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import type { CreateAccountInvestmentDto } from "../dto/account-investment-dto";
import type { AccountInvestmentResponse } from "../models/account-investments-types";
import { serializeAccountInvestment } from "../models/serializers";
import { AccountInvestmentsRepository } from "../repositories/account-investments-repository";

export class CreateAccountInvestmentService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly accountInvestmentsRepository: AccountInvestmentsRepository
  ) {}

  async execute(userId: string, input: CreateAccountInvestmentDto): Promise<AccountInvestmentResponse> {
    const account = await this.accountsRepository.findById(userId, input.accountId);
    if (!account || account.isArchived) {
      throw new AppError("Conta inválida para vincular o investimento.", 404);
    }

    const investment = await this.accountInvestmentsRepository.create({
      userId,
      ...input,
    });

    return serializeAccountInvestment(investment);
  }
}
