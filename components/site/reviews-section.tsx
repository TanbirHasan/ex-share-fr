import Link from "next/link";
import { MessageSquareText, PenLine, Star } from "lucide-react";
import { auth } from "@/auth";
import { ReviewCard } from "@/components/site/review-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/backend";
import type { Paginated } from "@/lib/catalog-types";
import type { Product } from "@/lib/catalog-types";
import { CATEGORY_RATING_FIELDS, type Review } from "@/lib/review-types";

function topTags(reviews: Review[], key: "pros" | "cons", n = 4) {
  const freq = new Map<string, number>();
  for (const r of reviews) for (const t of r[key]) freq.set(t, (freq.get(t) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag, count]) => ({ tag, count }));
}

export async function ReviewsSection({ product }: { product: Product }) {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  const [listRes, mineRes] = await Promise.all([
    apiFetch(`/api/v1/products/${product.id}/reviews?limit=20&sort=helpful`),
    signedIn
      ? apiFetch(`/api/v1/products/${product.id}/reviews/mine`)
      : Promise.resolve(null),
  ]);

  const list: Paginated<Review> = listRes.ok
    ? await listRes.json()
    : { data: [], total: 0, limit: 20, offset: 0 };
  const mine: Review | null = mineRes && mineRes.ok ? await mineRes.json() : null;

  const pros = topTags(list.data, "pros");
  const cons = topTags(list.data, "cons");
  const catAvgs = product.categoryRatingAvgs ?? {};

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Reviews{product.ratingCount > 0 ? ` (${product.ratingCount})` : ""}
        </h2>
        <Button asChild size="sm" variant={mine ? "outline" : "default"}>
          <Link href={`/contribute?product=${product.slug}`}>
            <PenLine className="size-4" />
            {mine ? "Edit your review" : "Write a review"}
          </Link>
        </Button>
      </div>

      {product.ratingCount === 0 ? (
        <div className="flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
          <MessageSquareText className="mt-0.5 size-4 shrink-0" />
          <p>
            No reviews yet.{" "}
            {signedIn ? "Own it? Be the first to share your experience." : (
              <Link href={`/contribute?product=${product.slug}`} className="text-primary hover:underline">
                Be the first to review it.
              </Link>
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-semibold">
                    {Number(product.ratingAvg).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 5</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.ratingCount} review{product.ratingCount === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {product.wouldBuyAgainPct}%
                </p>
                <p className="text-xs text-muted-foreground">would buy again</p>
              </div>
            </div>

            {Object.keys(catAvgs).length > 0 && (
              <dl className="mt-5 grid gap-2 sm:grid-cols-2">
                {CATEGORY_RATING_FIELDS.filter((f) => catAvgs[f.key] != null).map((f) => (
                  <div key={f.key} className="flex items-center gap-3">
                    <dt className="w-32 shrink-0 text-xs text-muted-foreground">{f.label}</dt>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(catAvgs[f.key]! / 5) * 100}%` }}
                      />
                    </div>
                    <dd className="w-8 text-right text-xs font-medium tabular-nums">
                      {catAvgs[f.key]!.toFixed(1)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {(pros.length > 0 || cons.length > 0) && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {pros.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Most mentioned</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {pros.map(({ tag, count }) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        >
                          + {tag} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {cons.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Common complaints</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {cons.map(({ tag, count }) => (
                        <span
                          key={tag}
                          className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400"
                        >
                          − {tag} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div className="mt-4 space-y-3">
            {list.data.map((r) => (
              <ReviewCard key={r.id} review={r} canVote={signedIn} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
