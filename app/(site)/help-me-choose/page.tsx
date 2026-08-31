import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Check, ImageOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import { apiGet } from "@/lib/api";
import type { Category } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/format";
import { localized, localizedName } from "@/lib/i18n-content";
import {
  PRIORITIES,
  type Recommendation,
  type RecommendResult,
} from "@/lib/recommend-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("helpMeChoose");
  return {
    title: t("metaTitle"),
    description:
      "Answer three questions and get product picks scored from real owner experiences.",
  };
}

export default async function HelpMeChoosePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; budgetMax?: string; priority?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const budgetMax = sp.budgetMax ?? "";
  const priority = sp.priority ?? "balanced";

  const [t, tEnum, locale, categories] = await Promise.all([
    getTranslations("helpMeChoose"),
    getTranslations("enums"),
    getLocale() as Promise<Locale>,
    apiGet<Category[]>("/api/v1/categories").catch(() => [] as Category[]),
  ]);

  let rec: Recommendation | null = null;
  if (category) {
    const qs = new URLSearchParams({ category, priority });
    if (budgetMax) qs.set("budgetMax", budgetMax);
    rec = await apiGet<Recommendation>(`/api/v1/recommend?${qs.toString()}`).catch(() => null);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary uppercase">
          <Sparkles className="size-3.5" />
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("lede")}</p>
      </header>

      <form
        method="get"
        action="/help-me-choose"
        className="mt-6 rounded-xl border bg-card p-5"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="category">{t("category")}</Label>
            <Select name="category" defaultValue={category || undefined}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder={t("pickOne")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {localizedName(locale, c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budgetMax">{t("maxBudget")}</Label>
            <Input
              id="budgetMax"
              name="budgetMax"
              type="number"
              min={0}
              defaultValue={budgetMax}
              placeholder={t("optional")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="priority">{t("whatMatters")}</Label>
            <Select name="priority" defaultValue={priority}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {tEnum(`priority.${p.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          {t("showPicks")}
        </Button>
      </form>

      {!category && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t("pickCategoryToStart")}
        </p>
      )}

      {category && rec && (
        <div className="mt-8">
          {rec.category == null ? (
            <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
              {t("noSuchCategory")}
            </p>
          ) : rec.results.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
              {t("nothingIn", {
                category: localized(locale, rec.category.nameEn, rec.category.nameBn),
                budget: rec.budgetMax
                  ? t("underBudget", { amount: rec.budgetMax.toLocaleString() })
                  : "",
              })}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {t("topPicksFor", {
                  category: localized(locale, rec.category.nameEn, rec.category.nameBn),
                  budget: rec.budgetMax
                    ? t("underBudget", { amount: rec.budgetMax.toLocaleString() })
                    : "",
                  priority: tEnum(`priority.${rec.priority}`).toLowerCase(),
                })}
              </p>
              <div className="mt-4 space-y-3">
                {rec.results.map((r, i) => (
                  <ResultCard key={r.product.id} rank={i + 1} result={r} matchLabel={t("match")} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  rank,
  result,
  matchLabel,
}: {
  rank: number;
  result: RecommendResult;
  matchLabel: string;
}) {
  const p = result.product;
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {rank}
      </div>
      <Link
        href={`/products/${p.slug}`}
        className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted"
      >
        {p.primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="size-5 text-muted-foreground" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{p.brand.name}</p>
        <Link href={`/products/${p.slug}`} className="font-medium hover:text-primary">
          {p.name}
        </Link>
        <p className="text-sm font-semibold tabular-nums">
          {formatPrice(p.priceMin, p.priceMax)}
        </p>
        <ul className="mt-2 space-y-0.5">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-1.5 text-xs text-muted-foreground">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-lg font-semibold tabular-nums">{result.score}</div>
        <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
          {matchLabel}
        </div>
      </div>
    </div>
  );
}
