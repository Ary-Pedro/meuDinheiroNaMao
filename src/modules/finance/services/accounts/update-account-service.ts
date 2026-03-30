import { AppError } from "@/server/core/errors/app-error";
import type { UpdateAccountDto } from "../../dto/account-dto";
import type { AccountResponse } from "../../models/finance-types";
import { serializeAccount } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";

export class UpdateAccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(input: UpdateAccountDto & { userId: string; accountId: string }): Promise<AccountResponse> {
    const existing = await this.accountsRepository.findById(input.userId, input.accountId);

    if (!existing || existing.isArchived) {
      throw new AppError("Conta financeira não encontrada.", 404);
    }

    if (input.currency && !["BRL", "USD", "EUR"].includes(input.currency.trim().toUpperCase())) {
      throw new AppError("Moeda inválida. Use BRL, USD ou EUR.");
    }

    const account = await this.accountsRepository.update({
      userId: input.userId,
      accountId: input.accountId,
      name: input.name.trim(),
      type: input.type,
      institution: input.institution?.trim() || undefined,
      currency: input.currency?.trim().toUpperCase() || "BRL",
      initialBalance: input.initialBalance ?? 0,
    });

    return serializeAccount(account);
  }
}
