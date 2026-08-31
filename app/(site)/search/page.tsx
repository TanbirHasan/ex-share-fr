import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PackageOpen, Search, Store, Tag } from "lucide-react";
import { ProductGrid } from "@/components/site/product-grid";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { apiGet } from "@/lib/api";
import { localizedName } from "@/lib/i18n-content";
import type { SearchResult } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

type SP = Promise<{ q?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { q } = await searchParams;
  const t = await getTranslations("search");
  return { title: q ? t("metaSearchFor", { q }) : t("metaSearch") };
}

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const [t, locale] = await Promise.all([
    getTranslations("search"),
    getLocale() as Promise<Locale>,
  ]);

  if (!query) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Search className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("lede")}</p>
      </div>
    );
  }

  const result = await apiGet<SearchResult>(
    `/api/v1/search?q=${encodeURIComponent(query)}&limit=40`,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("resultsFor", { query })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("matches", { count: result.total })}
        </p>
      </header>

      {(result.brands.length > 0 || result.categories.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {result.brands.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/40"
            >
              <Store className="size-3.5 text-muted-foreground" />
              {b.name}
            </Link>
          ))}
          {result.categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/40"
            >
              <Tag className="size-3.5 text-muted-foreground" />
              {localizedName(locale, c)}
            </Link>
          ))}
        </div>
      )}

      {result.products.length > 0 ? (
        <ProductGrid products={result.products} />
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <PackageOpen className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">{t("noProductsMatch", { query })}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("tellUs")}</p>
          <Button asChild className="mt-4">
            <Link href={`/contribute/request?q=${encodeURIComponent(query)}`}>
              {t("requestThisProduct")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
