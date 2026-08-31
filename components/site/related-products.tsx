import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/site/product-card";
import { apiGet } from "@/lib/api";
import type { ProductListItem } from "@/lib/catalog-types";

export async function RelatedProducts({ productId }: { productId: string }) {
  const [t, items] = await Promise.all([
    getTranslations("product"),
    apiGet<ProductListItem[]>(`/api/v1/products/${productId}/related?limit=4`).catch(
      () => [] as ProductListItem[],
    ),
  ]);

  if (items.length === 0) return null;

  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {t("relatedHeading")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
