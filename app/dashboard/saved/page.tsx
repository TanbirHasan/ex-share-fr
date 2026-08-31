import Link from "next/link";
import { ProductGrid } from "@/components/site/product-grid";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated, ProductListItem } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

type SavedItem = { savedAt: string; product: ProductListItem };

export default async function SavedPage() {
  const data = await apiGet<Paginated<SavedItem>>("/api/v1/me/saved?limit=60");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Saved products</h1>
        <p className="text-sm text-muted-foreground">
          {data.total} product{data.total === 1 ? "" : "s"} you&apos;ve saved for later.
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Tap the bookmark on any product to keep it here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={data.data.map((d) => d.product)} />
      )}
    </div>
  );
}
