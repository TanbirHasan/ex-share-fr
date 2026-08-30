import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/site/product-grid";
import { apiGet } from "@/lib/api";
import type { Brand, Paginated, ProductListItem } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

async function getBrand(slug: string) {
  const brands = await apiGet<Brand[]>("/api/v1/brands");
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  return {
    title: brand ? brand.name : "Brand not found",
    description: brand
      ? `${brand.name} products with community ratings and reported problems in Bangladesh.`
      : undefined,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const list = await apiGet<Paginated<ProductListItem>>(
    `/api/v1/products?brandSlug=${encodeURIComponent(slug)}&limit=48`,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Brand
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {brand.name}
        </h1>
        {brand.aboutEn && (
          <p className="mt-2 text-sm text-muted-foreground">{brand.aboutEn}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {list.total} {list.total === 1 ? "product" : "products"}
        </p>
      </header>

      <ProductGrid products={list.data} empty="No products from this brand yet." />
    </div>
  );
}
