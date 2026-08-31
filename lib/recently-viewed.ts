import type { ProductListItem } from "@/lib/catalog-types";

const KEY = "eh-recently-viewed";
const MAX = 12;

/** Read the recently-viewed product list, newest first. Safe on the server / private mode. */
export function readRecentlyViewed(): ProductListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductListItem[]) : [];
  } catch {
    return [];
  }
}

/** Record a product view: move it to the front, dedupe by id, cap the list. */
export function pushRecentlyViewed(product: ProductListItem): void {
  if (typeof window === "undefined") return;
  try {
    const next = [product, ...readRecentlyViewed().filter((p) => p.id !== product.id)].slice(
      0,
      MAX,
    );
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — recently-viewed is a nicety, not critical
  }
}
