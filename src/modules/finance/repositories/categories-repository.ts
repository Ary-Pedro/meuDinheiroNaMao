import { type CategoryKind } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export class CategoriesRepository {
  async listByUser(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: [{ kind: "asc" }, { name: "asc" }],
    });
  }

  async create(input: {
    userId: string;
    name: string;
    kind: CategoryKind;
    subcategories?: string[];
  }) {
    return prisma.category.create({
      data: {
        userId: input.userId,
        name: input.name,
        kind: input.kind,
        subcategories: input.subcategories?.length
          ? {
              createMany: {
                data: input.subcategories.map((name) => ({ name })),
              },
            }
          : undefined,
      },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });
  }

  async findById(userId: string, categoryId: string) {
    return prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true, kind: true, name: true },
    });
  }

  async subcategoryBelongsToCategory(subcategoryId: string, categoryId: string) {
    const subcategory = await prisma.subcategory.findFirst({
      where: { id: subcategoryId, categoryId },
      select: { id: true },
    });

    return Boolean(subcategory);
  }
}
