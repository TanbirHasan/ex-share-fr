import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Search,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/lib/api";
import { categoryIcon } from "@/lib/category-icons";
import type { Category, Paginated, ProductListItem } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

const popularSearches = [
  "Walton Refrigerator",
  "Samsung TV",
  "LG AC",
  "Washing Machine",
];

type Stats = {
  reviews: number;
  problems: number;
  solutions: number;
  contributors: number;
  products: number;
};

const statCards = [
  { key: "reviews", icon: Star },
  { key: "problems", icon: TriangleAlert },
  { key: "solutions", icon: Lightbulb },
  { key: "contributors", icon: ThumbsUp },
] as const;

const valueProps = [
  { icon: ThumbsUp, key: "real" },
  { icon: TriangleAlert, key: "problems" },
  { icon: Lightbulb, key: "solutions" },
  { icon: BadgeCheck, key: "decisions" },
] as const;

export default async function HomePage() {
  const [t, tStats, categories, trending, stats] = await Promise.all([
    getTranslations("home"),
    getTranslations("stats"),
    apiGet<Category[]>("/api/v1/categories").catch(() => [] as Category[]),
    apiGet<Paginated<ProductListItem>>("/api/v1/products?sort=trending&limit=4").catch(
      () => ({ data: [], total: 0, limit: 4, offset: 0 }) as Paginated<ProductListItem>,
    ),
    apiGet<Stats>("/api/v1/stats").catch(
      () =>
        ({ reviews: 0, problems: 0, solutions: 0, contributors: 0, products: 0 }) as Stats,
    ),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/[0.06] to-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("titleLead")} <span className="text-primary">{t("titleAccent")}</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">{t("subtitle")}</p>

            <form action="/search" className="mt-7 flex max-w-xl gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder={t("searchPlaceholder")}
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                {t("searchButton")}
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("popular")}</span>
              {popularSearches.map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <Card className="self-start">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("communityGlance")}
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {t("live")}
                </Badge>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                {statCards.map(({ key, icon: Icon }) => (
                  <div key={key} className="rounded-xl border bg-muted/40 p-4">
                    <Icon className="size-4 text-primary" />
                    <dd className="mt-2 text-xl font-semibold text-foreground tabular-nums">
                      {stats[key].toLocaleString()}
                    </dd>
                    <dt className="text-xs text-muted-foreground">{tStats(key)}</dt>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeading
            title={t("browseByCategory")}
            href="/products"
            cta={t("viewAll")}
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => {
              const Icon = categoryIcon(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                    {c.nameEn}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.data.length > 0 && (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <SectionHeading
              title={t("trending")}
              href="/products?sort=trending"
              cta={t("viewAll")}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.data.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, key }) => (
            <div key={key}>
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {t(`valueProps.${key}Title`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`valueProps.${key}Body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="size-7 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">{t("ctaTitle")}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("ctaBody")}</p>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="shrink-0 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/contribute">
                  {t("ctaButton")} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {cta} <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
