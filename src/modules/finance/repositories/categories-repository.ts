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

  async update(input: {
    userId: string;
    categoryId: string;
    name: string;
    kind: CategoryKind;
    subcategories?: string[];
  }) {
    const current = await prisma.category.findFirst({
      where: { id: input.categoryId, userId: input.userId },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!current) {
      return null;
    }

    if (current.kind !== input.kind) {
      const transactionCount = await prisma.transaction.count({
        where: {
          userId: input.userId,
          categoryId: input.categoryId,
        },
      });

      if (transactionCount > 0) {
        throw new Error("CATEGORY_KIND_IN_USE");
      }
    }

    const desiredNames = Array.from(new Set((input.subcategories ?? []).map((item) => item.trim()).filter(Boolean)));
    const currentByName = new Map(current.subcategories.map((item) => [item.name.toLowerCase(), item]));
    const desiredKeySet = new Set(desiredNames.map((item) => item.toLowerCase()));

    const removableSubcategories = current.subcategories.filter((item) => !desiredKeySet.has(item.name.toLowerCase()));

    if (removableSubcategories.length) {
      const inUseCount = await prisma.transaction.count({
        where: {
          categoryId: input.categoryId,
          subcategoryId: { in: removableSubcategories.map((item) => item.id) },
        },
      });

      if (inUseCount > 0) {
        throw new Error("SUBCATEGORY_IN_USE");
      }
    }

    return prisma.$transaction(async (tx) => {
      await tx.category.update({
        where: { id: input.categoryId },
        data: {
          name: input.name,
          kind: input.kind,
        },
      });

      if (removableSubcategories.length) {
        await tx.subcategory.deleteMany({
          where: {
            id: { in: removableSubcategories.map((item) => item.id) },
          },
        });
      }

      const subcategoriesToCreate = desiredNames.filter((name) => !currentByName.has(name.toLowerCase()));

      if (subcategoriesToCreate.length) {
        await tx.subcategory.createMany({
          data: subcategoriesToCreate.map((name) => ({
            categoryId: input.categoryId,
            name,
          })),
        });
      }

      return tx.category.findUniqueOrThrow({
        where: { id: input.categoryId },
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
    });
  }

  async findById(userId: string, categoryId: string) {
    return prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true, kind: true, name: true },
    });
  }

  async findFirstByKind(userId: string, kind: CategoryKind) {
    return prisma.category.findFirst({
      where: { userId, kind },
      select: { id: true, kind: true, name: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async deleteById(userId: string, categoryId: string) {
    const [transactionCount, importedEntryCount] = await prisma.$transaction([
      prisma.transaction.count({
        where: { userId, categoryId },
      }),
      prisma.importedEntry.count({
        where: { userId, suggestedCategoryId: categoryId },
      }),
    ]);

    if (transactionCount > 0 || importedEntryCount > 0) {
      return { blocked: true as const };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { blocked: false as const };
  }

  async subcategoryBelongsToCategory(subcategoryId: string, categoryId: string) {
    const subcategory = await prisma.subcategory.findFirst({
      where: { id: subcategoryId, categoryId },
      select: { id: true },
    });

    return Boolean(subcategory);
  }
}
