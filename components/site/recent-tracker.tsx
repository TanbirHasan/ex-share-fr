"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/recently-viewed";
import type { ProductListItem } from "@/lib/catalog-types";

/** Renders nothing — records that the viewer opened this product page. */
export function RecentTracker({ product }: { product: ProductListItem }) {
  useEffect(() => {
    pushRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
