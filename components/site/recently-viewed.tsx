"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/site/product-card";
import { readRecentlyViewed } from "@/lib/recently-viewed";
import type { ProductListItem } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

/**
 * A strip of the viewer's recently-opened products, read from localStorage on
 * mount. Renders nothing until it has something to show (so it never flashes
 * empty and is invisible to first-time visitors).
 */
export function RecentlyViewed({
  excludeId,
  limit = 8,
  className,
}: {
  excludeId?: string;
  limit?: number;
  className?: string;
}) {
  const t = useTranslations("home");
  const [items, setItems] = useState<ProductListItem[]>([]);

  useEffect(() => {
    setItems(
      readRecentlyViewed()
        .filter((p) => p.id !== excludeId)
        .slice(0, limit),
    );
  }, [excludeId, limit]);

  if (items.length === 0) return null;

  return (
    <section className={cn("mx-auto max-w-7xl px-6 py-12", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {t("recentlyViewed")}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
