import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { MapPin, Star, Store } from "lucide-react";
import { ApiError, apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  note: string | null;
  reviewCount: number;
  avgRating: number;
  wouldBuyAgainPct: number;
  recentReviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    authorName: string | null;
    product: { slug: string; name: string };
  }[];
};

async function load(slug: string): Promise<Profile | null> {
  try {
    return await apiGet<Profile>(`/api/v1/stores/${slug}`);
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
  const s = await load(slug);
  const t = await getTranslations("stores");
  return { title: s ? s.name : t("notFound") };
}

export default async function StoreProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, tReviews, format, store] = await Promise.all([
    getTranslations("stores"),
    getTranslations("reviews"),
    getFormatter(),
    load(slug),
  ]);
  if (!store) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/stores" className="text-sm text-muted-foreground hover:text-foreground">
        ← {t("title")}
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Store className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{store.name}</h1>
          {store.city && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {store.city}
            </p>
          )}
        </div>
      </header>

      {store.note && <p className="mt-4 text-sm text-muted-foreground">{store.note}</p>}

      {store.reviewCount > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <span className="inline-flex items-center gap-1.5 text-2xl font-semibold">
              <Star className="size-5 fill-amber-400 text-amber-400" />
              {store.avgRating.toFixed(1)}
            </span>
            <p className="text-xs text-muted-foreground">{t("avgRating")}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-semibold tabular-nums">{store.wouldBuyAgainPct}%</p>
            <p className="text-xs text-muted-foreground">{tReviews("wouldBuyAgainLower")}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-semibold tabular-nums">{store.reviewCount}</p>
            <p className="text-xs text-muted-foreground">{t("reviewsFromHere")}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
          {t("noReviewsYet")}
        </p>
      )}

      {store.recentReviews.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">{t("recentReviews")}</h2>
          <ul className="space-y-2">
            {store.recentReviews.map((r) => (
              <li key={r.id} className="rounded-xl border bg-card p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {r.rating.toFixed(1)}
                  </span>
                  <Link
                    href={`/products/${r.product.slug}`}
                    className="truncate text-primary hover:underline"
                  >
                    {r.product.name}
                  </Link>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {format.dateTime(new Date(r.createdAt), { dateStyle: "medium" })}
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-1 line-clamp-2 text-muted-foreground">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
