"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveProduct } from "@/app/dashboard/(admin)/catalog/actions";
import { Field, TextareaField } from "@/components/dashboard/catalog/field";
import { SpecEditor } from "@/components/dashboard/catalog/spec-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n-content";
import { PRODUCT_STATUSES, type Brand, type Category, type Product } from "@/lib/catalog-types";

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const t = useTranslations("catalog.form");
  const tEnum = useTranslations("enums");
  const locale = useLocale() as Locale;
  const [state, formAction, pending] = useActionState(saveProduct, { ok: false });

  useEffect(() => {
    if (!state.ok) return;
    if (!product && state.id) {
      toast.success(t("productCreated"));
      router.push(`/dashboard/catalog/${state.id}`);
    } else {
      toast.success(t("productSaved"));
      router.refresh();
    }
  }, [state, product, router, t]);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("name")}
          name="name"
          defaultValue={product?.name}
          placeholder="Walton Smart Fridge WNM-2A3"
          required
        />
        <Field
          label={t("slug")}
          name="slug"
          defaultValue={product?.slug}
          placeholder="walton-wnm-2a3"
          required
        />
        <Field
          label={t("modelNumber")}
          name="modelNo"
          defaultValue={product?.modelNo ?? ""}
          placeholder="WNM-2A3"
        />
        <div className="space-y-1.5">
          <Label htmlFor="status">{t("status")}</Label>
          <Select name="status" defaultValue={product?.status ?? "active"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {tEnum(`productStatus.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categoryId">{t("category")}</Label>
          <Select name="categoryId" defaultValue={product?.categoryId} required>
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {localizedName(locale, c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandId">{t("brand")}</Label>
          <Select name="brandId" defaultValue={product?.brandId} required>
            <SelectTrigger id="brandId" className="w-full">
              <SelectValue placeholder={t("selectBrand")} />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Field
          label={t("priceMin")}
          name="priceMin"
          type="number"
          min={0}
          defaultValue={product?.priceMin ?? ""}
        />
        <Field
          label={t("priceMax")}
          name="priceMax"
          type="number"
          min={0}
          defaultValue={product?.priceMax ?? ""}
        />
      </div>

      <TextareaField
        label={t("warrantyFreeText")}
        name="warrantyText"
        defaultValue={product?.warrantyText ?? ""}
        rows={2}
        placeholder={t("warrantyPlaceholder")}
      />

      <SpecEditor initial={product?.spec} />

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {product ? t("saveChanges") : t("createProduct")}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/catalog")}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
