import { getFormatter, getTranslations } from "next-intl/server";
import { TrendingDown } from "lucide-react";
import { PriceAlertControl } from "@/components/site/price-alert-control";
import { ReportPrice } from "@/components/site/report-price";
import { apiGet } from "@/lib/api";

type Point = {
  id: string;
  price: number;
  source: "review" | "manual";
  storeName: string | null;
  note: string | null;
  observedAt: string;
};

type Prices = {
  current: { min: number | null; max: number | null };
  lowest: { price: number; storeName: string | null; observedAt: string } | null;
  points: Point[];
  viewerAlert: { targetPrice: number } | null;
};

const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

export async function PricePanel({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const [t, format, data] = await Promise.all([
    getTranslations("prices"),
    getFormatter(),
    apiGet<Prices>(`/api/v1/products/${productId}/prices`).catch(() => null),
  ]);

  if (!data) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{t("heading")}</h2>
      <div className="rounded-xl border bg-card p-4 text-sm">
        {data.lowest ? (
          <p className="flex items-center gap-2 font-medium">
            <TrendingDown className="size-4 text-emerald-600 dark:text-emerald-400" />
            {t("lowestReported", { price: taka(data.lowest.price) })}
            {data.lowest.storeName && (
              <span className="font-normal text-muted-foreground">
                · {data.lowest.storeName}
              </span>
            )}
          </p>
        ) : (
          <p className="text-muted-foreground">{t("noneReported")}</p>
        )}

        {data.points.length > 0 && (
          <ul className="mt-3 divide-y border-t pt-1">
            {data.points.slice(0, 8).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-2 text-xs"
              >
                <span className="font-medium tabular-nums">{taka(p.price)}</span>
                <span className="truncate text-muted-foreground">
                  {p.storeName ?? t(`source.${p.source}`)}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {format.dateTime(new Date(p.observedAt), { dateStyle: "medium" })}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-x-4">
          <ReportPrice productId={productId} slug={slug} />
          <PriceAlertControl
            productId={productId}
            slug={slug}
            current={data.viewerAlert}
          />
        </div>
      </div>
    </section>
  );
}
