import type { Product } from "@/lib/catalog-types";

export type CompareProduct = Product & { problemCount: number };

export type CompareResult = { products: CompareProduct[] };

export const COMPARE_MAX = 4;
