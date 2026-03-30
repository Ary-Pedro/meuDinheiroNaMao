import { AccountsRepository } from "@/modules/finance/repositories/accounts-repository";
import { CategoriesRepository } from "@/modules/finance/repositories/categories-repository";
import { GetReviewOverviewController } from "@/modules/review/controllers/get-review-overview-controller";
import { UpdateReviewQueueItemController } from "@/modules/review/controllers/update-review-queue-item-controller";
import { ReviewRepository } from "@/modules/review/repositories/review-repository";
import { DismissReviewItemService } from "@/modules/review/services/dismiss-review-item-service";
import { GetReviewOverviewService } from "@/modules/review/services/get-review-overview-service";
import { ResolveReviewItemService } from "@/modules/review/services/resolve-review-item-service";

const reviewRepository = new ReviewRepository();
const accountsRepository = new AccountsRepository();
const categoriesRepository = new CategoriesRepository();
const getReviewOverviewService = new GetReviewOverviewService(reviewRepository);
const resolveReviewItemService = new ResolveReviewItemService(reviewRepository, accountsRepository, categoriesRepository);
const dismissReviewItemService = new DismissReviewItemService(reviewRepository);

export const reviewComposition = {
  getReviewOverviewController: new GetReviewOverviewController(getReviewOverviewService),
  getReviewOverviewService,
  updateReviewQueueItemController: new UpdateReviewQueueItemController(resolveReviewItemService, dismissReviewItemService),
};
