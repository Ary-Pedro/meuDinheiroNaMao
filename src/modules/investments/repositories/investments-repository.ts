import { prisma } from "@/server/db/prisma";

export class InvestmentsRepository {
  async getOverviewData(userId: string) {
    const [positions, recentOperations, operationsCount, snapshots] = await prisma.$transaction([
      prisma.investmentPosition.findMany({
        where: { userId },
        include: {
          asset: {
            select: {
              id: true,
              tickerOrName: true,
              assetType: true,
              broker: true,
              currency: true,
            },
          },
        },
        orderBy: [{ currentValue: "desc" }, { updatedAt: "desc" }],
      }),
      prisma.investmentOperation.findMany({
        where: { userId },
        include: {
          asset: {
            select: {
              id: true,
              tickerOrName: true,
              assetType: true,
              currency: true,
            },
          },
          account: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.investmentOperation.count({
        where: { userId },
      }),
      prisma.portfolioSnapshot.findMany({
        where: { userId },
        orderBy: [{ referenceDate: "desc" }],
        take: 6,
      }),
    ]);

    return {
      positions,
      recentOperations,
      operationsCount,
      snapshots,
    };
  }
}
