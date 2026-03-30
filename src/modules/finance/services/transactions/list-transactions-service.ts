import type { ListTransactionsFilters } from "../../dto/transaction-dto";
import type { TransactionResponse } from "../../models/finance-types";
import { serializeTransaction } from "../../models/serializers";
import { TransactionsRepository } from "../../repositories/transactions-repository";

export class ListTransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute(userId: string, filters: ListTransactionsFilters = {}): Promise<TransactionResponse[]> {
    const transactions = await this.transactionsRepository.listOperationalByUser(userId, filters);
    return transactions.map(serializeTransaction);
  }
}
