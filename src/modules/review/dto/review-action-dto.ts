export type ResolveReviewItemDto = {
  accountId: string;
  categoryId: string;
  subcategoryId?: string;
};

export type DismissReviewItemDto = {
  reason?: string;
};
