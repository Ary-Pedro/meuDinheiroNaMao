import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import { CreateAccountInvestmentController } from "@/modules/investments/controllers/create-account-investment-controller";
import { DeleteAccountInvestmentController } from "@/modules/investments/controllers/delete-account-investment-controller";
import { GetAccountInvestmentsOverviewController } from "@/modules/investments/controllers/get-account-investments-overview-controller";
import { UpdateAccountInvestmentController } from "@/modules/investments/controllers/update-account-investment-controller";
import { AccountInvestmentsRepository } from "@/modules/investments/repositories/account-investments-repository";
import { CreateAccountInvestmentService } from "@/modules/investments/services/create-account-investment-service";
import { DeleteAccountInvestmentService } from "@/modules/investments/services/delete-account-investment-service";
import { GetAccountInvestmentsOverviewService } from "@/modules/investments/services/get-account-investments-overview-service";
import { UpdateAccountInvestmentService } from "@/modules/investments/services/update-account-investment-service";

const accountsRepository = new AccountsRepository();
const accountInvestmentsRepository = new AccountInvestmentsRepository();

const getAccountInvestmentsOverviewService = new GetAccountInvestmentsOverviewService(accountInvestmentsRepository);
const createAccountInvestmentService = new CreateAccountInvestmentService(accountsRepository, accountInvestmentsRepository);
const updateAccountInvestmentService = new UpdateAccountInvestmentService(accountsRepository, accountInvestmentsRepository);
const deleteAccountInvestmentService = new DeleteAccountInvestmentService(accountInvestmentsRepository);

export const investmentsComposition = {
  getAccountInvestmentsOverviewController: new GetAccountInvestmentsOverviewController(getAccountInvestmentsOverviewService),
  createAccountInvestmentController: new CreateAccountInvestmentController(createAccountInvestmentService),
  updateAccountInvestmentController: new UpdateAccountInvestmentController(updateAccountInvestmentService),
  deleteAccountInvestmentController: new DeleteAccountInvestmentController(deleteAccountInvestmentService),
  getAccountInvestmentsOverviewService,
};
