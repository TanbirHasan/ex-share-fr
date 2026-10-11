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
  const [draft, setDraft] = useState<AiProductDraft | null>(null);
  const [draftVersion, setDraftVersion] = useState(0);

  function applyDraft(d: AiProductDraft) {
    setDraft(d);
    setDraftVersion((v) => v + 1);
  }

  const matchedCategoryId = draft
    ? findByName(categories, (c) => c.nameEn, draft.category)?.id
    : undefined;
  const matchedBrandId = draft ? findByName(brands, (b) => b.name, draft.brand)?.id : undefined;

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

      <div key={draftVersion} className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("name")}
          name="name"
          defaultValue={product?.name ?? draft?.name ?? ""}
          placeholder="Walton Smart Fridge WNM-2A3"
          required
        />
        <Field
          label={t("slug")}
          name="slug"
          defaultValue={product?.slug ?? (draft?.name ? slugify(draft.name) : "")}
          placeholder="walton-wnm-2a3"
          required
        />
        <Field
          label={t("modelNumber")}
          name="modelNo"
          defaultValue={product?.modelNo ?? draft?.modelNo ?? ""}
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
          <Select name="categoryId" defaultValue={product?.categoryId ?? matchedCategoryId} required>
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
          {draft && draft.category && !matchedCategoryId && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              {t("aiSuggested")}: {draft.category}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandId">{t("brand")}</Label>
          <BrandSelect
            brands={brands}
            defaultValue={product?.brandId ?? matchedBrandId}
            placeholder={t("selectBrand")}
            searchPlaceholder={t("searchBrand")}
            emptyLabel={t("noBrandFound")}
          />
          {draft && draft.brand && !matchedBrandId && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              {t("aiSuggested")}: {draft.brand}
            </p>
          )}
        </div>

        <Field
          label={t("priceMin")}
          name="priceMin"
          type="number"
          min={0}
          defaultValue={product?.priceMin ?? draft?.priceMin ?? ""}
        />
        <Field
          label={t("priceMax")}
          name="priceMax"
          type="number"
          min={0}
          defaultValue={product?.priceMax ?? draft?.priceMax ?? ""}
        />
      </div>

      <div key={draftVersion}>
        <TextareaField
          label={t("warrantyFreeText")}
          name="warrantyText"
          defaultValue={product?.warrantyText ?? draft?.warrantyText ?? ""}
          rows={2}
          placeholder={t("warrantyPlaceholder")}
        />
      </div>

      <SpecEditor key={draftVersion} initial={product?.spec ?? draft?.specs} />

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
