import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(1),
  expectedContribution: z.coerce.number().nonnegative(),
  actualContribution: z.coerce.number().nonnegative(),
});

const costSchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
});

export const createSimulationScenarioSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  targetAmount: z.coerce.number().nonnegative().optional(),
  participants: z.array(participantSchema).min(1),
  costs: z.array(costSchema).min(1),
});

export const updateSimulationScenarioSchema = createSimulationScenarioSchema;
