import { AccountType } from "@prisma/client";

export type CreateAccountDto = {
  name: string;
  type: AccountType;
  institution?: string;
  currency?: string;
  initialBalance?: number;
};

export type UpdateAccountDto = CreateAccountDto;
