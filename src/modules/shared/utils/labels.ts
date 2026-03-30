const accountTypeLabels: Record<string, string> = {
  CHECKING: "Conta corrente",
  SAVINGS: "Poupança",
  CASH: "Carteira",
  CREDIT: "Crédito",
  INVESTMENT: "Investimento",
  OTHER: "Outro",
};

const categoryKindLabels: Record<string, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  TRANSFER: "Transferência",
};

const transactionTypeLabels: Record<string, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  TRANSFER: "Transferência",
};

const transactionStatusLabels: Record<string, string> = {
  CONFIRMED: "Confirmada",
  PENDING_REVIEW: "Pendente de revisão",
  ARCHIVED: "Arquivada",
};

const assetTypeLabels: Record<string, string> = {
  STOCK: "Ação",
  ETF: "ETF",
  FII: "FII",
  BOND: "Renda fixa",
  CRYPTO: "Cripto",
  CASH_EQUIVALENT: "Caixa / pós-fixado",
  CAIXINHA: "Caixinha",
  CDB: "CDB",
  FUND: "Fundo",
  OTHER: "Outro",
};

const investmentOperationTypeLabels: Record<string, string> = {
  BUY: "Compra",
  SELL: "Venda",
  DIVIDEND: "Provento",
  TRANSFER_IN: "Transferência de entrada",
  TRANSFER_OUT: "Transferência de saída",
};

const simulationBaseContextLabels: Record<string, string> = {
  FINANCE: "Financeiro real",
  INVESTMENT: "Investimentos",
  MIXED: "Misto",
};

const simulationStatusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  CALCULATED: "Calculada",
  ARCHIVED: "Arquivada",
};

const reviewItemStatusLabels: Record<string, string> = {
  OPEN: "Aberto",
  RESOLVED: "Resolvido",
  DISMISSED: "Descartado",
};

const importBatchStatusLabels: Record<string, string> = {
  RECEIVED: "Recebido",
  PROCESSING: "Processando",
  REVIEW_REQUIRED: "Revisão necessária",
  COMPLETED: "Concluído",
  FAILED: "Falhou",
};

const importedEntryStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  MATCHED: "Conciliado",
  REVIEW_REQUIRED: "Revisão necessária",
  IMPORTED: "Importado",
  DISCARDED: "Descartado",
};

export type OptionItem = {
  value: string;
  label: string;
};

export function getAccountTypeLabel(value: string) {
  return accountTypeLabels[value] ?? value;
}

export function getCategoryKindLabel(value: string) {
  return categoryKindLabels[value] ?? value;
}

export function getTransactionTypeLabel(value: string) {
  return transactionTypeLabels[value] ?? value;
}

export function getTransactionStatusLabel(value: string) {
  return transactionStatusLabels[value] ?? value;
}

export function getAssetTypeLabel(value: string) {
  return assetTypeLabels[value] ?? value;
}

export function getInvestmentOperationTypeLabel(value: string) {
  return investmentOperationTypeLabels[value] ?? value;
}

export function getSimulationBaseContextLabel(value: string) {
  return simulationBaseContextLabels[value] ?? value;
}

export function getSimulationStatusLabel(value: string) {
  return simulationStatusLabels[value] ?? value;
}

export function getReviewItemStatusLabel(value: string) {
  return reviewItemStatusLabels[value] ?? value;
}

export function getImportBatchStatusLabel(value: string) {
  return importBatchStatusLabels[value] ?? value;
}

export function getImportedEntryStatusLabel(value: string) {
  return importedEntryStatusLabels[value] ?? value;
}

export function toAccountTypeOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getAccountTypeLabel(value) }));
}

export function toCategoryKindOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getCategoryKindLabel(value) }));
}

export function toTransactionTypeOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getTransactionTypeLabel(value) }));
}
