import { getTranslations } from "next-intl/server";
import { BrandManager } from "@/components/dashboard/catalog/brand-manager";
import { CategoryManager } from "@/components/dashboard/catalog/category-manager";
import { apiGet } from "@/lib/api";
import type { Brand, Category } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export default async function TaxonomyPage() {
  const [t, categories, brands] = await Promise.all([
    getTranslations("dashboard.admin"),
    apiGet<Category[]>("/api/v1/categories"),
    apiGet<Brand[]>("/api/v1/brands"),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("taxonomyTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("taxonomyLede")}</p>
      </div>
      <CategoryManager rows={categories} />
      <BrandManager rows={brands} />
    </div>
  );
}
