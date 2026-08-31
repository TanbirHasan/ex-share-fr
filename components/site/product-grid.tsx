import { useTranslations } from "next-intl";
import { PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import type { ProductListItem } from "@/lib/catalog-types";

export function ProductGrid({
  products,
  empty,
}: {
  products: ProductListItem[];
  empty?: string;
}) {
  const t = useTranslations("common");
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border bg-card p-14 text-center">
        <PackageOpen className="size-7 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">{empty ?? t("noProductsFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
