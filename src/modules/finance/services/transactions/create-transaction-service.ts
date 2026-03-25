import { TransactionType } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import type { CreateTransactionDto } from "../../dto/transaction-dto";
import type { TransactionResponse } from "../../models/finance-types";
import { serializeTransaction } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";
import { CategoriesRepository } from "../../repositories/categories-repository";
import { TransactionsRepository } from "../../repositories/transactions-repository";

export class CreateTransactionService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async execute(input: CreateTransactionDto & { userId: string }): Promise<TransactionResponse> {
    const accountExists = await this.accountsRepository.existsById(input.userId, input.accountId);
    if (!accountExists) {
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

    if (input.type === TransactionType.TRANSFER) {
      /**
       * Regra do incremento 1:
       * transferência é registrada como evento isolado na conta selecionada,
       * não entra em receitas/despesas e aparece separadamente no dashboard.
       * A compensação entre contas ficará para o próximo incremento.
       */
    }

    const transaction = await this.transactionsRepository.create({
      ...input,
      userId: input.userId,
    });

    return serializeTransaction(transaction);
  }
}
