import type { ProductListItem } from "@/lib/catalog-types";

export const PRIORITIES = [
  { value: "balanced", label: "A balance of everything" },
  { value: "reliability", label: "Reliability" },
  { value: "price", label: "Price & value" },
  { value: "performance", label: "Performance" },
  { value: "after_sales", label: "After-sales service" },
] as const;

export type Priority = (typeof PRIORITIES)[number]["value"];

export function priorityLabel(v: string): string {
  return PRIORITIES.find((p) => p.value === v)?.label ?? v;
}

export type RecommendResult = {
  product: ProductListItem;
  score: number;
  reasons: string[];
  problemCount: number;
  serviceRating: number | null;
};

export type Recommendation = {
  category: { slug: string; nameEn: string; nameBn: string } | null;
  budgetMax: number | null;
  priority: string;
  results: RecommendResult[];
};
