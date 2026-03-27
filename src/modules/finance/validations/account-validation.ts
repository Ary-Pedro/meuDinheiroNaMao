import { AccountType } from "@prisma/client";
import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(AccountType),
  institution: z.string().optional(),
  currency: z.string().min(3).max(3).optional(),
  initialBalance: z.coerce.number().optional().default(0),
});
