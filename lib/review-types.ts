export const OWNERSHIP_DURATIONS = [
  { value: "lt_3m", label: "Under 3 months" },
  { value: "m3_6", label: "3–6 months" },
  { value: "m6_12", label: "6–12 months" },
  { value: "y1_2", label: "1–2 years" },
  { value: "y2_3", label: "2–3 years" },
  { value: "gt_3y", label: "3+ years" },
] as const;

export type OwnershipDuration = (typeof OWNERSHIP_DURATIONS)[number]["value"];

export function ownershipLabel(value: string): string {
  return OWNERSHIP_DURATIONS.find((d) => d.value === value)?.label ?? value;
}

export type WouldBuyAgain = "yes" | "maybe" | "no";

export const BUY_AGAIN_OPTIONS: { value: WouldBuyAgain; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

export const CATEGORY_RATING_FIELDS = [
  { key: "reliability", label: "Reliability" },
  { key: "performance", label: "Performance" },
  { key: "value", label: "Value for money" },
  { key: "after_sales", label: "After-sales service" },
] as const;

export const COMMON_PROS = [
  "Good cooling",
  "Low electricity bill",
  "Quiet operation",
  "Solid build quality",
  "Value for money",
  "Good after-sales service",
  "Easy to use",
  "Fast cooling",
];

export const COMMON_CONS = [
  "Noisy",
  "High electricity bill",
  "Cooling problem",
  "Poor after-sales service",
  "Build quality issues",
  "Service delay",
  "Expensive spare parts",
  "Frequent breakdowns",
];

export type ReviewAuthor = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  reputation: number;
};

export type Review = {
  id: string;
  productId: string;
  rating: number;
  ownershipDuration: OwnershipDuration;
  categoryRatings: Partial<Record<string, number>>;
  wouldBuyAgain: WouldBuyAgain;
  comment: string | null;
  pros: string[];
  cons: string[];
  purchasePrice: number | null;
  purchaseStore: string | null;
  store: { slug: string; name: string } | null;
  contentLang: "bn" | "en";
  status: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthor;
  viewerHasVoted: boolean;
  viewerCanEdit: boolean;
};

export type MyReview = Review & {
  product: { id: string; slug: string; name: string; primaryImage: string | null };
};
