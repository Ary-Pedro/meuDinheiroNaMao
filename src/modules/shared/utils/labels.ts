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

export function toAccountTypeOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getAccountTypeLabel(value) }));
}

export function toCategoryKindOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getCategoryKindLabel(value) }));
}

export function toTransactionTypeOptions(values: string[]): OptionItem[] {
  return values.map((value) => ({ value, label: getTransactionTypeLabel(value) }));
}
