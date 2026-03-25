import { CreateAccountController } from "@/modules/finance/controllers/accounts/create-account-controller";
import { ListAccountsController } from "@/modules/finance/controllers/accounts/list-accounts-controller";
import { CreateCategoryController } from "@/modules/finance/controllers/categories/create-category-controller";
import { ListCategoriesController } from "@/modules/finance/controllers/categories/list-categories-controller";
import { GetFinanceDashboardController } from "@/modules/finance/controllers/dashboard/get-finance-dashboard-controller";
import { CreateTransactionController } from "@/modules/finance/controllers/transactions/create-transaction-controller";
import { ListTransactionsController } from "@/modules/finance/controllers/transactions/list-transactions-controller";
import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import { CategoriesRepository } from "@/modules/finance/repositories/categories-repository";
import { TransactionsRepository } from "@/modules/finance/repositories/transactions-repository";
import { CreateAccountService } from "@/modules/finance/services/accounts/create-account-service";
import { ListAccountsService } from "@/modules/finance/services/accounts/list-accounts-service";
import { CreateCategoryService } from "@/modules/finance/services/categories/create-category-service";
import { ListCategoriesService } from "@/modules/finance/services/categories/list-categories-service";
import { GetFinanceDashboardService } from "@/modules/finance/services/dashboard/get-finance-dashboard-service";
import { CreateTransactionService } from "@/modules/finance/services/transactions/create-transaction-service";
import { ListTransactionsService } from "@/modules/finance/services/transactions/list-transactions-service";

const accountsRepository = new AccountsRepository();
const categoriesRepository = new CategoriesRepository();
const transactionsRepository = new TransactionsRepository();

const listAccountsService = new ListAccountsService(accountsRepository);
const createAccountService = new CreateAccountService(accountsRepository);
const listCategoriesService = new ListCategoriesService(categoriesRepository);
const createCategoryService = new CreateCategoryService(categoriesRepository);
const listTransactionsService = new ListTransactionsService(transactionsRepository);
const createTransactionService = new CreateTransactionService(
  accountsRepository,
  categoriesRepository,
  transactionsRepository
);
const getFinanceDashboardService = new GetFinanceDashboardService(transactionsRepository);

export const financeComposition = {
  listAccountsController: new ListAccountsController(listAccountsService),
  createAccountController: new CreateAccountController(createAccountService),
  listCategoriesController: new ListCategoriesController(listCategoriesService),
  createCategoryController: new CreateCategoryController(createCategoryService),
  listTransactionsController: new ListTransactionsController(listTransactionsService),
  createTransactionController: new CreateTransactionController(createTransactionService),
  getFinanceDashboardController: new GetFinanceDashboardController(getFinanceDashboardService),
  listAccountsService,
  listCategoriesService,
  listTransactionsService,
  getFinanceDashboardService,
};
