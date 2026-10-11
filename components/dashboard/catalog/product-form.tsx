"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveProduct, type AiProductDraft } from "@/app/dashboard/(admin)/catalog/actions";
import { fulfillRequest } from "@/app/dashboard/(admin)/requests/actions";
import { AiAssist } from "@/components/dashboard/catalog/ai-assist";
import { BrandSelect } from "@/components/dashboard/catalog/brand-select";
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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findByName<T extends { id: string }>(
  items: T[],
  name: (item: T) => string,
  guess: string | undefined,
): T | undefined {
  if (!guess) return undefined;
  const g = guess.trim().toLowerCase();
  if (!g) return undefined;
  return (
    items.find((i) => name(i).toLowerCase() === g) ??
    items.find((i) => name(i).toLowerCase().includes(g) || g.includes(name(i).toLowerCase()))
  );
}

export function ProductForm({
  product,
  categories,
  brands,
  requestId,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  requestId?: string;
}) {
  const router = useRouter();
  const t = useTranslations("catalog.form");
  const tEnum = useTranslations("enums");
  const locale = useLocale() as Locale;
  const [state, formAction, pending] = useActionState(saveProduct, { ok: false });

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [modelNo, setModelNo] = useState(product?.modelNo ?? "");
  const [status, setStatus] = useState<string>(product?.status ?? "active");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [priceMin, setPriceMin] = useState(product?.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(product?.priceMax?.toString() ?? "");
  const [warrantyText, setWarrantyText] = useState(product?.warrantyText ?? "");
  const [spec, setSpec] = useState<Record<string, string>>(() => {
    const entries = Object.entries(product?.spec ?? {});
    return Object.fromEntries(entries.map(([k, v]) => [k, String(v)]));
  });
  const [categoryHint, setCategoryHint] = useState<string | undefined>(undefined);
  const [brandHint, setBrandHint] = useState<string | undefined>(undefined);

  function applyDraft(d: AiProductDraft) {
    if (d.name) {
      setName(d.name);
      setSlug(slugify(d.name));
    }
    if (d.modelNo) setModelNo(d.modelNo);
    if (d.priceMin != null) setPriceMin(String(d.priceMin));
    if (d.priceMax != null) setPriceMax(String(d.priceMax));
    if (d.warrantyText) setWarrantyText(d.warrantyText);
    if (d.specs && Object.keys(d.specs).length > 0) setSpec(d.specs);

    const matchedCategory = findByName(categories, (c) => c.nameEn, d.category);
    if (matchedCategory) setCategoryId(matchedCategory.id);
    setCategoryHint(matchedCategory ? undefined : d.category);

    const matchedBrand = findByName(brands, (b) => b.name, d.brand);
    if (matchedBrand) setBrandId(matchedBrand.id);
    setBrandHint(matchedBrand ? undefined : d.brand);
  }

  useEffect(() => {
    if (!state.ok) return;
    if (!product && state.id) {
      if (requestId) {
        fulfillRequest(requestId, state.id).then((res) => {
          if (res.ok) toast.success(t("productCreatedAndLinked"));
          else toast.error(res.error ?? t("productCreated"));
        });
      } else {
        toast.success(t("productCreated"));
      }
      router.push(`/dashboard/catalog/${state.id}`);
    } else {
      toast.success(t("productSaved"));
      router.refresh();
    }
  }, [state, product, requestId, router, t]);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {!product && <AiAssist onApply={applyDraft} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("name")}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Walton Smart Fridge WNM-2A3"
          required
        />
        <Field
          label={t("slug")}
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="walton-wnm-2a3"
          required
        />
        <Field
          label={t("modelNumber")}
          name="modelNo"
          value={modelNo}
          onChange={(e) => setModelNo(e.target.value)}
          placeholder="WNM-2A3"
        />
        <div className="space-y-1.5">
          <Label htmlFor="status">{t("status")}</Label>
          <Select name="status" value={status} onValueChange={setStatus}>
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
          <Select name="categoryId" value={categoryId} onValueChange={setCategoryId} required>
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
          {categoryHint && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              {t("aiSuggested")}: {categoryHint}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandId">{t("brand")}</Label>
          <BrandSelect
            brands={brands}
            value={brandId}
            onChange={(id) => setBrandId(id)}
            placeholder={t("selectBrand")}
            searchPlaceholder={t("searchBrand")}
            emptyLabel={t("noBrandFound")}
          />
          {brandHint && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              {t("aiSuggested")}: {brandHint}
            </p>
          )}
        </div>

        <Field
          label={t("priceMin")}
          name="priceMin"
          type="number"
          min={0}
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />
        <Field
          label={t("priceMax")}
          name="priceMax"
          type="number"
          min={0}
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />
      </div>

      <TextareaField
        label={t("warrantyFreeText")}
        name="warrantyText"
        value={warrantyText}
        onChange={(e) => setWarrantyText(e.target.value)}
        rows={2}
        placeholder={t("warrantyPlaceholder")}
      />

      <SpecEditor value={spec} onChange={setSpec} />

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
