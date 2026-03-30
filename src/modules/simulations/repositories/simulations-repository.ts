import { Prisma, SimulationScenarioStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import type { CreateSimulationScenarioDto, UpdateSimulationScenarioDto } from "../dto/simulation-scenario-dto";

export class SimulationsRepository {
  async listByUser(userId: string) {
    return prisma.simulationScenario.findMany({
      where: { userId },
      include: {
        participants: {
          orderBy: [{ createdAt: "asc" }],
        },
        costs: {
          orderBy: [{ createdAt: "asc" }],
        },
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async findById(userId: string, scenarioId: string) {
    return prisma.simulationScenario.findFirst({
      where: { id: scenarioId, userId },
      include: {
        participants: true,
        costs: true,
      },
    });
  }

  async create(userId: string, input: CreateSimulationScenarioDto) {
    return prisma.simulationScenario.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        baseContext: "FINANCE",
        status: SimulationScenarioStatus.CALCULATED,
        targetAmount: input.targetAmount !== undefined ? new Prisma.Decimal(input.targetAmount) : undefined,
        participants: {
          create: input.participants.map((participant) => ({
            name: participant.name,
            expectedContribution: new Prisma.Decimal(participant.expectedContribution),
            actualContribution: new Prisma.Decimal(participant.actualContribution),
          })),
        },
        costs: {
          create: input.costs.map((cost) => ({
            name: cost.name,
            amount: new Prisma.Decimal(cost.amount),
          })),
        },
      },
      include: {
        participants: true,
        costs: true,
      },
    });
  }

  async update(userId: string, scenarioId: string, input: UpdateSimulationScenarioDto) {
    return prisma.$transaction(async (tx) => {
      await tx.simulationScenario.update({
        where: { id: scenarioId },
        data: {
          name: input.name,
          description: input.description,
          targetAmount: input.targetAmount !== undefined ? new Prisma.Decimal(input.targetAmount) : null,
          status: SimulationScenarioStatus.CALCULATED,
        },
      });

      await tx.simulationParticipant.deleteMany({ where: { scenarioId } });
      await tx.simulationCost.deleteMany({ where: { scenarioId } });

      await tx.simulationParticipant.createMany({
        data: input.participants.map((participant) => ({
          scenarioId,
          name: participant.name,
          expectedContribution: new Prisma.Decimal(participant.expectedContribution),
          actualContribution: new Prisma.Decimal(participant.actualContribution),
        })),
      });

      await tx.simulationCost.createMany({
        data: input.costs.map((cost) => ({
          scenarioId,
          name: cost.name,
          amount: new Prisma.Decimal(cost.amount),
        })),
      });

      return tx.simulationScenario.findUniqueOrThrow({
        where: { id: scenarioId },
        include: {
          participants: true,
          costs: true,
        },
      });
    });
  }

  async deleteById(userId: string, scenarioId: string) {
    await prisma.simulationScenario.deleteMany({
      where: { id: scenarioId, userId },
    });
  }
}
