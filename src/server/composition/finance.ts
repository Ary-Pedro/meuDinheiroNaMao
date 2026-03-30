import { CreateAccountController } from "@/modules/finance/controllers/accounts/create-account-controller";
import { DeleteAccountController } from "@/modules/finance/controllers/accounts/delete-account-controller";
import { ListAccountsController } from "@/modules/finance/controllers/accounts/list-accounts-controller";
import { UpdateAccountController } from "@/modules/finance/controllers/accounts/update-account-controller";
import { CreateCategoryController } from "@/modules/finance/controllers/categories/create-category-controller";
import { DeleteCategoryController } from "@/modules/finance/controllers/categories/delete-category-controller";
import { ListCategoriesController } from "@/modules/finance/controllers/categories/list-categories-controller";
import { UpdateCategoryController } from "@/modules/finance/controllers/categories/update-category-controller";
import { GetFinanceDashboardController } from "@/modules/finance/controllers/dashboard/get-finance-dashboard-controller";
import { CreateTransactionController } from "@/modules/finance/controllers/transactions/create-transaction-controller";
import { DeleteTransactionController } from "@/modules/finance/controllers/transactions/delete-transaction-controller";
import { ListTransactionsController } from "@/modules/finance/controllers/transactions/list-transactions-controller";
import { UpdateTransactionController } from "@/modules/finance/controllers/transactions/update-transaction-controller";
import { CreateTransferController } from "@/modules/finance/controllers/transfers/create-transfer-controller";
import { DeleteTransferController } from "@/modules/finance/controllers/transfers/delete-transfer-controller";
import { ListTransfersController } from "@/modules/finance/controllers/transfers/list-transfers-controller";
import { UpdateTransferController } from "@/modules/finance/controllers/transfers/update-transfer-controller";
import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import { CategoriesRepository } from "@/modules/finance/repositories/categories-repository";
import { TransactionsRepository } from "@/modules/finance/repositories/transactions-repository";
import { TransfersRepository } from "@/modules/finance/repositories/transfers-repository";
import { CreateAccountService } from "@/modules/finance/services/accounts/create-account-service";
import { DeleteAccountService } from "@/modules/finance/services/accounts/delete-account-service";
import { ListAccountsService } from "@/modules/finance/services/accounts/list-accounts-service";
import { UpdateAccountService } from "@/modules/finance/services/accounts/update-account-service";
import { CreateCategoryService } from "@/modules/finance/services/categories/create-category-service";
import { DeleteCategoryService } from "@/modules/finance/services/categories/delete-category-service";
import { ListCategoriesService } from "@/modules/finance/services/categories/list-categories-service";
import { UpdateCategoryService } from "@/modules/finance/services/categories/update-category-service";
import { GetFinanceDashboardService } from "@/modules/finance/services/dashboard/get-finance-dashboard-service";
import { ExchangeRatesService } from "@/modules/finance/services/exchange-rates/exchange-rates-service";
import { CreateTransactionService } from "@/modules/finance/services/transactions/create-transaction-service";
import { DeleteTransactionService } from "@/modules/finance/services/transactions/delete-transaction-service";
import { ListTransactionsService } from "@/modules/finance/services/transactions/list-transactions-service";
import { UpdateTransactionService } from "@/modules/finance/services/transactions/update-transaction-service";
import { CreateTransferService } from "@/modules/finance/services/transfers/create-transfer-service";
import { DeleteTransferService } from "@/modules/finance/services/transfers/delete-transfer-service";
import { ListTransfersService } from "@/modules/finance/services/transfers/list-transfers-service";
import { UpdateTransferService } from "@/modules/finance/services/transfers/update-transfer-service";
import { AccountInvestmentsRepository } from "@/modules/investments/repositories/account-investments-repository";

const accountsRepository = new AccountsRepository();
const categoriesRepository = new CategoriesRepository();
const transactionsRepository = new TransactionsRepository();
const transfersRepository = new TransfersRepository();
const accountInvestmentsRepository = new AccountInvestmentsRepository();
const exchangeRatesService = new ExchangeRatesService();

const listAccountsService = new ListAccountsService(
  accountsRepository,
  transactionsRepository,
  accountInvestmentsRepository
);
const createAccountService = new CreateAccountService(accountsRepository);
const updateAccountService = new UpdateAccountService(accountsRepository);
const deleteAccountService = new DeleteAccountService(accountsRepository);
const listCategoriesService = new ListCategoriesService(categoriesRepository);
const createCategoryService = new CreateCategoryService(categoriesRepository);
const updateCategoryService = new UpdateCategoryService(categoriesRepository);
const deleteCategoryService = new DeleteCategoryService(categoriesRepository);
const listTransactionsService = new ListTransactionsService(transactionsRepository);
const createTransactionService = new CreateTransactionService(
  accountsRepository,
  categoriesRepository,
  transactionsRepository,
  exchangeRatesService
);
const updateTransactionService = new UpdateTransactionService(
  accountsRepository,
  categoriesRepository,
  transactionsRepository,
  exchangeRatesService
);
const deleteTransactionService = new DeleteTransactionService(transactionsRepository);
const listTransfersService = new ListTransfersService(transfersRepository);
const createTransferService = new CreateTransferService(accountsRepository, transfersRepository);
const updateTransferService = new UpdateTransferService(accountsRepository, transfersRepository);
const deleteTransferService = new DeleteTransferService(transfersRepository);
const getFinanceDashboardService = new GetFinanceDashboardService(
  transactionsRepository,
  transfersRepository,
  listAccountsService
);

export const financeComposition = {
  listAccountsController: new ListAccountsController(listAccountsService),
  createAccountController: new CreateAccountController(createAccountService),
  updateAccountController: new UpdateAccountController(updateAccountService),
  deleteAccountController: new DeleteAccountController(deleteAccountService),
  listCategoriesController: new ListCategoriesController(listCategoriesService),
  createCategoryController: new CreateCategoryController(createCategoryService),
  updateCategoryController: new UpdateCategoryController(updateCategoryService),
  deleteCategoryController: new DeleteCategoryController(deleteCategoryService),
  listTransactionsController: new ListTransactionsController(listTransactionsService),
  createTransactionController: new CreateTransactionController(createTransactionService),
  updateTransactionController: new UpdateTransactionController(updateTransactionService),
  deleteTransactionController: new DeleteTransactionController(deleteTransactionService),
  listTransfersController: new ListTransfersController(listTransfersService),
  createTransferController: new CreateTransferController(createTransferService),
  updateTransferController: new UpdateTransferController(updateTransferService),
  deleteTransferController: new DeleteTransferController(deleteTransferService),
  getFinanceDashboardController: new GetFinanceDashboardController(getFinanceDashboardService),
  listAccountsService,
  listCategoriesService,
  listTransactionsService,
  listTransfersService,
  getFinanceDashboardService,
  exchangeRatesService,
};
