import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ImageOff, Pencil, Star } from "lucide-react";
import { DeleteServiceButton } from "@/components/dashboard/delete-service-button";
import { ModerationBadge } from "@/components/dashboard/moderation-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { formatDate } from "@/lib/format";
import { type MyServiceExperience } from "@/lib/service-types";

export const dynamic = "force-dynamic";

export default async function MyServicePage() {
  const [t, tEnum, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    getTranslations("enums"),
    apiGet<Paginated<MyServiceExperience>>("/api/v1/me/service?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("serviceTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("serviceCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("serviceEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((it) => (
            <li key={it.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {it.product.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.product.primaryImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff className="size-5 text-muted-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/products/${it.product.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {it.product.name}
                  </Link>
                  <ModerationBadge status={it.status} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {it.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <Badge variant="secondary">{tEnum(`repairOutcome.${it.repairOutcome}`)}</Badge>
                  <span>·</span>
                  <span>{formatDate(it.createdAt)}</span>
                </div>
                {it.comment && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{it.comment}</p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-1">
                <Button asChild variant="ghost" size="icon-sm" aria-label={t("edit")}>
                  <Link href={`/contribute/service?product=${it.product.slug}`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <DeleteServiceButton id={it.id} productName={it.product.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
