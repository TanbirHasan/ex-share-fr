import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/site/product-grid";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated, ProductListItem } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

type SavedItem = { savedAt: string; product: ProductListItem };

export default async function SavedPage() {
  const [t, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    apiGet<Paginated<SavedItem>>("/api/v1/me/saved?limit=60"),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("savedTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("savedCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("savedEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={data.data.map((d) => d.product)} />
      )}
    </div>
  );
}
