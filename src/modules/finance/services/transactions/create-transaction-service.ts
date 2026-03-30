import { AppError } from "@/server/core/errors/app-error";
import type { CreateTransactionDto } from "../../dto/transaction-dto";
import type { TransactionResponse } from "../../models/finance-types";
import { serializeTransaction } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";
import { CategoriesRepository } from "../../repositories/categories-repository";
import { TransactionsRepository } from "../../repositories/transactions-repository";
import { ExchangeRatesService, normalizeSupportedCurrency } from "../exchange-rates/exchange-rates-service";

export class CreateTransactionService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly exchangeRatesService: ExchangeRatesService
  ) {}

  async execute(input: CreateTransactionDto & { userId: string }): Promise<TransactionResponse> {
    const account = await this.accountsRepository.findById(input.userId, input.accountId);
    if (!account || account.isArchived) {
      throw new AppError("Conta financeira inválida.", 404);
    }

    const category = await this.categoriesRepository.findById(input.userId, input.categoryId);
    if (!category) {
      throw new AppError("Categoria inválida.", 404);
    }

    if (category.kind !== input.type) {
      throw new AppError("O tipo da transação deve corresponder ao tipo da categoria.");
    }

    if (input.subcategoryId) {
      const belongs = await this.categoriesRepository.subcategoryBelongsToCategory(
        input.subcategoryId,
        input.categoryId
      );
      if (!belongs) {
        throw new AppError("A subcategoria não pertence à categoria informada.");
      }
    }

    const currency = normalizeSupportedCurrency(account.currency);
    const snapshot = await this.exchangeRatesService.resolveSnapshot(input.occurredAt, currency, "BRL", input.amountNative);

    const transaction = await this.transactionsRepository.create({
      ...input,
      userId: input.userId,
      currency,
      amountBrlSnapshot: snapshot.amountBrlSnapshot,
      fxRateApplied: snapshot.fxRateApplied,
      fxReferenceAt: new Date(snapshot.asOf),
    });

    return serializeTransaction(transaction);
  }
}
