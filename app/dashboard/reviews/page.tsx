import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ImageOff, Pencil, Star } from "lucide-react";
import { DeleteReviewButton } from "@/components/dashboard/delete-review-button";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { formatDate } from "@/lib/format";
import { type MyReview } from "@/lib/review-types";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const [t, tReviews, tEnum, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    getTranslations("reviews"),
    getTranslations("enums"),
    apiGet<Paginated<MyReview>>("/api/v1/me/reviews?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("reviewsTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("reviewsCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("reviewsEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((r) => (
            <li key={r.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {r.product.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.product.primaryImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff className="size-5 text-muted-foreground" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${r.product.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {r.product.name}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {r.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span>
                    {tReviews("ownedFor", {
                      duration: tEnum(`ownership.${r.ownershipDuration}`),
                    })}
                  </span>
                  <span>·</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{r.comment}</p>
                )}
              </div>

              <div className="flex shrink-0 items-start gap-1">
                <Button asChild variant="ghost" size="icon-sm" aria-label={t("editReview")}>
                  <Link href={`/contribute?product=${r.product.slug}`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <DeleteReviewButton id={r.id} productName={r.product.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
