import { CategoryKind } from "@prisma/client";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  kind: z.nativeEnum(CategoryKind),
  subcategories: z.array(z.string().min(1)).optional(),
});

export const updateCategorySchema = createCategorySchema;
