import { AppError } from "@/server/core/errors/app-error";
import type { CreateAccountDto } from "../../dto/account-dto";
import type { AccountResponse } from "../../models/finance-types";
import { serializeAccount } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";

export class CreateAccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(input: CreateAccountDto & { userId: string }): Promise<AccountResponse> {
    if (input.currency && input.currency.length !== 3) {
      throw new AppError("A moeda deve ter 3 caracteres.");
    }

    const account = await this.accountsRepository.create({
      userId: input.userId,
      name: input.name.trim(),
      type: input.type,
      institution: input.institution?.trim() || undefined,
      currency: input.currency?.trim().toUpperCase() || "BRL",
      initialBalance: input.initialBalance ?? 0,
    });

    return serializeAccount(account);
  }
}
