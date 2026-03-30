import { AccountType } from "@prisma/client";
import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(AccountType),
  institution: z.string().optional(),
  currency: z.enum(["BRL", "USD", "EUR"]).optional(),
  initialBalance: z.coerce.number().optional().default(0),
});

export const updateAccountSchema = createAccountSchema;
