import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { ProductTable } from "@/components/dashboard/catalog/product-table";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Brand, Category, Paginated, Product } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

const LIMIT = 20;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; categoryId?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const status = sp.status ?? "";
  const categoryId = sp.categoryId ?? "";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const offset = (page - 1) * LIMIT;

  const qs = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) });
  if (q) qs.set("q", q);
  if (status) qs.set("status", status);
  if (categoryId) qs.set("categoryId", categoryId);

  const [t, products, categories, brands] = await Promise.all([
    getTranslations("dashboard.admin"),
    apiGet<Paginated<Product>>(`/api/v1/products?${qs.toString()}`),
    apiGet<Category[]>("/api/v1/categories"),
    apiGet<Brand[]>("/api/v1/brands"),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("catalogTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("catalogLede", { categories: categories.length, brands: brands.length })}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalog/new">
            <Plus className="size-4" /> {t("newProduct")}
          </Link>
        </Button>
      </div>

      <ProductTable
        data={products.data}
        total={products.total}
        limit={products.limit}
        offset={products.offset}
        categories={categories}
        brands={brands}
        query={{ q, status, categoryId }}
      />
    </div>
  );
}
