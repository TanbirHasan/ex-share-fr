import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/site/product-grid";
import type { Locale } from "@/i18n/config";
import { apiGet } from "@/lib/api";
import { localized } from "@/lib/i18n-content";
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
  const t = await getTranslations("brands");
  return {
    title: brand ? brand.name : t("brandNotFound"),
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
  const [t, locale, brand] = await Promise.all([
    getTranslations("brands"),
    getLocale() as Promise<Locale>,
    getBrand(slug),
  ]);
  if (!brand) notFound();

  const list = await apiGet<Paginated<ProductListItem>>(
    `/api/v1/products?brandSlug=${encodeURIComponent(slug)}&limit=48`,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("brandEyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {brand.name}
        </h1>
        {localized(locale, brand.aboutEn, brand.aboutBn) && (
          <p className="mt-2 text-sm text-muted-foreground">
            {localized(locale, brand.aboutEn, brand.aboutBn)}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {t("productCount", { count: list.total })}
        </p>
      </header>

      <ProductGrid products={list.data} empty={t("noProductsFromBrand")} />
    </div>
  );
}
