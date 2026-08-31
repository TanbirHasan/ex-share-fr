import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/dashboard/catalog/product-form";
import { apiGet } from "@/lib/api";
import type { Brand, Category } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [t, categories, brands] = await Promise.all([
    getTranslations("dashboard.admin"),
    apiGet<Category[]>("/api/v1/categories"),
    apiGet<Brand[]>("/api/v1/brands"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t("backCatalog")}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{t("newProduct")}</h1>
      {categories.length === 0 || brands.length === 0 ? (
        <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          {t("needCategoryBrand")}{" "}
          <Link href="/dashboard/taxonomy" className="text-primary hover:underline">
            {t("categoriesBrands")}
          </Link>
          .
        </p>
      ) : (
        <ProductForm categories={categories} brands={brands} />
      )}
    </div>
  );
}
