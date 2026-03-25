import type { AccountResponse } from "../../models/finance-types";
import { serializeAccount } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";

export class ListAccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(userId: string): Promise<AccountResponse[]> {
    const accounts = await this.accountsRepository.listByUser(userId);
    return accounts.map(serializeAccount);
  }
}
