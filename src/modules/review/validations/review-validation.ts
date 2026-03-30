import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();
  return normalized.length ? normalized : undefined;
}, z.string().optional());

export const reviewQueueActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("resolve"),
    accountId: z.string().min(1),
    categoryId: z.string().min(1),
    subcategoryId: optionalString,
  }),
  z.object({
    action: z.literal("dismiss"),
    reason: optionalString,
  }),
]);
