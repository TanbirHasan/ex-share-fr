import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ChevronRight,
  ImageOff,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { CompareButton } from "@/components/site/compare-button";
import { ProductProblems } from "@/components/site/product-problems";
import { RecentlyViewed } from "@/components/site/recently-viewed";
import { RecentTracker } from "@/components/site/recent-tracker";
import { ProductQA } from "@/components/site/product-qa";
import { SaveButton } from "@/components/site/save-button";
import { RatingStars } from "@/components/site/rating-stars";
import { ServiceSection } from "@/components/site/service-section";
import { ReviewsSection } from "@/components/site/reviews-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { ApiError, apiGet } from "@/lib/api";
import type { Product } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/format";
import { localizedName } from "@/lib/i18n-content";

async function load(slug: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`/api/v1/products/by-slug/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) {
    const t = await getTranslations("product");
    return { title: t("notFound") };
  }
  return {
    title: p.name,
    description: `${p.brand.name} ${p.name} — community ratings, reported problems, solutions and real prices in Bangladesh.`,
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, locale, p] = await Promise.all([
    getTranslations("product"),
    getLocale() as Promise<Locale>,
    load(slug),
  ]);
  if (!p) notFound();

  const specEntries = Object.entries(p.spec ?? {});

  return (
    <>
    <div className="mx-auto max-w-6xl px-6 py-8">
      <RecentTracker product={p} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          {t("breadcrumbProducts")}
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href={`/products?category=${p.category.slug}`}
          className="hover:text-foreground"
        >
          {localizedName(locale, p.category)}
        </Link>
        <ChevronRight className="size-3" />
        <span className="truncate text-foreground">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {p.primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.primaryImage} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <ImageOff className="size-8 text-muted-foreground" />
            )}
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.images.slice(0, 8).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="aspect-square w-full rounded-lg border object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/brands/${p.brand.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {p.brand.name}
            </Link>
            <Badge variant="secondary" className="capitalize">
              {p.status}
            </Badge>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{p.name}</h1>
          {p.modelNo && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("model", { model: p.modelNo })}
            </p>
          )}

          <div className="mt-4">
            <RatingStars value={p.ratingAvg} count={p.ratingCount} />
          </div>

          <p className="mt-4 text-2xl font-semibold tabular-nums">
            {formatPrice(p.priceMin, p.priceMax)}
          </p>
          <p className="text-xs text-muted-foreground">{t("typicalPrice")}</p>

          {/* Community quick facts */}
          <dl className="mt-6 grid grid-cols-3 gap-3">
            <QuickStat
              icon={ThumbsUp}
              label={t("wouldBuyAgain")}
              value={p.ratingCount ? `${p.wouldBuyAgainPct}%` : "—"}
            />
            <QuickStat
              icon={MessageSquareText}
              label={t("reviews")}
              value={p.ratingCount.toLocaleString()}
            />
            <QuickStat
              icon={TriangleAlert}
              label={t("problems")}
              value="0"
            />
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href={`/contribute?product=${p.slug}`}>
                <PenLine className="size-4" /> {t("writeReview")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/contribute/problem?product=${p.slug}`}>
                <TriangleAlert className="size-4" /> {t("reportProblem")}
              </Link>
            </Button>
            <SaveButton productId={p.id} className="h-9 px-3" />
            <CompareButton slug={p.slug} name={p.name} className="h-9 px-3" />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <ReviewsSection product={p} />
          <ProductProblems productId={p.id} productSlug={p.slug} />
          <ProductQA product={p} />
          <ServiceSection product={p} />
        </div>

        <div className="space-y-10">
          <Section title={t("specifications")}>
            {specEntries.length ? (
              <dl className="divide-y rounded-xl border bg-card text-sm">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <EmptyNote>{t("noSpecs")}</EmptyNote>
            )}
          </Section>

          <Section title={t("warranty")}>
            {p.warrantyText ? (
              <p className="flex gap-2 rounded-xl border bg-card p-4 text-sm">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                {p.warrantyText}
              </p>
            ) : (
              <EmptyNote>{t("noWarranty")}</EmptyNote>
            )}
          </Section>
        </div>
      </div>
    </div>

    <RecentlyViewed excludeId={p.id} className="border-t" />
    </>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <Icon className="size-4 text-primary" />
      <dd className="mt-1.5 text-lg font-semibold tabular-nums">{value}</dd>
      <dt className="text-xs text-muted-foreground">{label}</dt>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function EmptyNote({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0" />}
      <p>{children}</p>
    </div>
  );
}
