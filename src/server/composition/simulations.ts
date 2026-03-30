import { CreateSimulationScenarioController } from "@/modules/simulations/controllers/create-simulation-scenario-controller";
import { DeleteSimulationScenarioController } from "@/modules/simulations/controllers/delete-simulation-scenario-controller";
import { GetSimulationsOverviewController } from "@/modules/simulations/controllers/get-simulations-overview-controller";
import { UpdateSimulationScenarioController } from "@/modules/simulations/controllers/update-simulation-scenario-controller";
import { SimulationsRepository } from "@/modules/simulations/repositories/simulations-repository";
import { CreateSimulationScenarioService } from "@/modules/simulations/services/create-simulation-scenario-service";
import { DeleteSimulationScenarioService } from "@/modules/simulations/services/delete-simulation-scenario-service";
import { GetSimulationsOverviewService } from "@/modules/simulations/services/get-simulations-overview-service";
import { UpdateSimulationScenarioService } from "@/modules/simulations/services/update-simulation-scenario-service";

const simulationsRepository = new SimulationsRepository();
const getSimulationsOverviewService = new GetSimulationsOverviewService(simulationsRepository);
const createSimulationScenarioService = new CreateSimulationScenarioService(
  simulationsRepository,
  getSimulationsOverviewService
);
const updateSimulationScenarioService = new UpdateSimulationScenarioService(
  simulationsRepository,
  getSimulationsOverviewService
);
const deleteSimulationScenarioService = new DeleteSimulationScenarioService(simulationsRepository);

export const simulationsComposition = {
  getSimulationsOverviewController: new GetSimulationsOverviewController(getSimulationsOverviewService),
  createSimulationScenarioController: new CreateSimulationScenarioController(createSimulationScenarioService),
  updateSimulationScenarioController: new UpdateSimulationScenarioController(updateSimulationScenarioService),
  deleteSimulationScenarioController: new DeleteSimulationScenarioController(deleteSimulationScenarioService),
  getSimulationsOverviewService,
};
