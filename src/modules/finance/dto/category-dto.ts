import { CategoryKind } from "@prisma/client";

export type CreateCategoryDto = {
  name: string;
  kind: CategoryKind;
  subcategories?: string[];
};
