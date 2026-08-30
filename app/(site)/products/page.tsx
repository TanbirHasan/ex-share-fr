import type { Metadata } from "next";
import { BrowseToolbar } from "@/components/site/browse-toolbar";
import { Pager } from "@/components/site/pager";
import { ProductGrid } from "@/components/site/product-grid";
import { apiGet } from "@/lib/api";
import type { Brand, Category, Paginated, ProductListItem } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

const LIMIT = 12;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse everyday electronics with community ratings, reported problems, and real prices in Bangladesh.",
};

type SP = Promise<{
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "";
  const brand = sp.brand ?? "";
  const sort = sp.sort ?? "";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const offset = (page - 1) * LIMIT;

  const qs = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) });
  if (q) qs.set("q", q);
  if (category) qs.set("categorySlug", category);
  if (brand) qs.set("brandSlug", brand);
  if (sort) qs.set("sort", sort);

  const [list, categories, brands] = await Promise.all([
    apiGet<Paginated<ProductListItem>>(`/api/v1/products?${qs.toString()}`),
    apiGet<Category[]>("/api/v1/categories"),
    apiGet<Brand[]>("/api/v1/brands"),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);
  const heading = activeCategory?.nameEn ?? activeBrand?.name ?? "All products";
  const totalPages = Math.max(1, Math.ceil(list.total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Products
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {list.total} {list.total === 1 ? "product" : "products"}
        </p>
      </header>

      <BrowseToolbar
        categories={categories}
        brands={brands}
        current={{ q, category, brand, sort }}
      />

      <div className="mt-6 space-y-6">
        <ProductGrid
          products={list.data}
          empty={q ? `Nothing matches “${q}”.` : "No products here yet."}
        />
        <Pager
          basePath="/products"
          page={page}
          totalPages={totalPages}
          params={{ q, category, brand, sort }}
        />
      </div>
    </div>
  );
}
