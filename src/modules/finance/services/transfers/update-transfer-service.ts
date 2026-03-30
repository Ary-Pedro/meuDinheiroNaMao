import { AppError } from "@/server/core/errors/app-error";
import type { TransferResponse } from "../../models/finance-types";
import { serializeTransfer } from "../../models/serializers";
import { AccountsRepository } from "../../repositories/accounts-repository";
import { TransfersRepository } from "../../repositories/transfers-repository";
import type { UpdateTransferDto } from "../../dto/transaction-dto";
import { convertAmount, getRatesInBrl, normalizeCurrency } from "../exchange-rates/exchange-rate-provider";

export class UpdateTransferService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly transfersRepository: TransfersRepository
  ) {}

  async execute(userId: string, transferGroupId: string, input: UpdateTransferDto): Promise<TransferResponse> {
    const existing = await this.transfersRepository.findById(userId, transferGroupId);
    if (!existing) {
      throw new AppError("Transferência não encontrada.", 404);
    }

    if (input.sourceAccountId === input.destinationAccountId) {
      throw new AppError("Escolha contas diferentes para a transferência.");
    }

    const [sourceAccount, destinationAccount] = await Promise.all([
      this.accountsRepository.findById(userId, input.sourceAccountId),
      this.accountsRepository.findById(userId, input.destinationAccountId),
    ]);

    if (!sourceAccount || !destinationAccount) {
      throw new AppError("Conta de origem ou destino inválida.", 404);
    }

    const sourceCurrency = normalizeCurrency(sourceAccount.currency);
    const destinationCurrency = normalizeCurrency(destinationAccount.currency);
    const quote = await getRatesInBrl(input.occurredAt);

    const destinationAmountNative = convertAmount(
      input.sourceAmountNative,
      sourceCurrency,
      destinationCurrency,
      quote.ratesInBrl
    );

    const sourceAmountBrlSnapshot = convertAmount(input.sourceAmountNative, sourceCurrency, "BRL", quote.ratesInBrl);
    const destinationAmountBrlSnapshot = convertAmount(
      destinationAmountNative,
      destinationCurrency,
      "BRL",
      quote.ratesInBrl
    );

    const transfer = await this.transfersRepository.update(transferGroupId, {
      userId,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destinationAccount.id,
      sourceCurrency,
      destinationCurrency,
      sourceAmountNative: input.sourceAmountNative,
      destinationAmountNative,
      sourceAmountBrlSnapshot,
      destinationAmountBrlSnapshot,
      fxRateApplied:
        sourceCurrency === destinationCurrency
          ? 1
          : convertAmount(1, sourceCurrency, destinationCurrency, quote.ratesInBrl),
      fxReferenceAt: new Date(quote.asOf),
      occurredAt: input.occurredAt,
      description: input.description,
      notes: input.notes,
    });

    return serializeTransfer(transfer);
  }
}
