import { decimalToNumber, decimalToString } from "@/modules/shared/utils/decimal";
import type { InvestmentsOverviewResponse } from "../models/investments-types";
import { InvestmentsRepository } from "../repositories/investments-repository";

export class GetInvestmentsOverviewService {
  constructor(private readonly investmentsRepository: InvestmentsRepository) {}

  async execute(userId: string): Promise<InvestmentsOverviewResponse> {
    const { positions, recentOperations, operationsCount, snapshots } =
      await this.investmentsRepository.getOverviewData(userId);

    const latestSnapshot = snapshots[0];
    const totalCurrentValue = positions.reduce((sum, item) => sum + decimalToNumber(item.currentValue), 0);
    const totalInvestedFromPositions = positions.reduce(
      (sum, item) => sum + decimalToNumber(item.averagePrice) * decimalToNumber(item.quantity),
      0
    );

    const invested = latestSnapshot ? decimalToNumber(latestSnapshot.totalInvested) : totalInvestedFromPositions;
    const currentValue = latestSnapshot ? decimalToNumber(latestSnapshot.totalCurrentValue) : totalCurrentValue;
    const profitLoss = latestSnapshot ? decimalToNumber(latestSnapshot.totalProfitLoss) : currentValue - invested;

    const allocationByTypeMap = new Map<string, number>();

    for (const position of positions) {
      const current = decimalToNumber(position.currentValue);
      allocationByTypeMap.set(position.asset.assetType, (allocationByTypeMap.get(position.asset.assetType) ?? 0) + current);
    }

    return {
      totals: {
        invested: decimalToString(invested),
        currentValue: decimalToString(currentValue),
        profitLoss: decimalToString(profitLoss),
        positionsCount: positions.length,
        operationsCount,
      },
      allocationByType: Array.from(allocationByTypeMap.entries())
        .map(([assetType, allocationValue]) => ({
          assetType,
          currentValue: decimalToString(allocationValue),
          share: currentValue > 0 ? Number(((allocationValue / currentValue) * 100).toFixed(1)) : 0,
        }))
        .sort((left, right) => Number(right.currentValue) - Number(left.currentValue)),
      topPositions: positions.slice(0, 5).map((position) => {
        const investedValue = decimalToNumber(position.averagePrice) * decimalToNumber(position.quantity);
        const currentPositionValue = decimalToNumber(position.currentValue);

        return {
          id: position.id,
          assetName: position.asset.tickerOrName,
          assetType: position.asset.assetType,
          broker: position.asset.broker,
          quantity: decimalToString(position.quantity),
          averagePrice: decimalToString(position.averagePrice),
          investedValue: decimalToString(investedValue),
          currentValue: decimalToString(position.currentValue),
          profitLoss: decimalToString(currentPositionValue - investedValue),
          currency: position.asset.currency,
        };
      }),
      recentOperations: recentOperations.map((operation) => ({
        id: operation.id,
        type: operation.type,
        quantity: decimalToString(operation.quantity),
        unitPrice: decimalToString(operation.unitPrice),
        totalAmount: decimalToString(operation.totalAmount),
        fees: decimalToString(operation.fees),
        occurredAt: operation.occurredAt.toISOString(),
        asset: operation.asset,
        account: operation.account,
      })),
      history: snapshots
        .slice()
        .reverse()
        .map((snapshot) => ({
          referenceDate: snapshot.referenceDate.toISOString(),
          totalInvested: decimalToString(snapshot.totalInvested),
          totalCurrentValue: decimalToString(snapshot.totalCurrentValue),
          totalProfitLoss: decimalToString(snapshot.totalProfitLoss),
        })),
    };
  }
}
