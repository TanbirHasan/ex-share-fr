import Link from "next/link";
import { useTranslations } from "next-intl";
import { ImageOff, Star } from "lucide-react";
import { CompareRemove } from "@/components/site/compare-remove";
import { formatPrice } from "@/lib/format";
import { CATEGORY_RATING_FIELDS } from "@/lib/review-types";
import type { CompareProduct } from "@/lib/compare-types";
import { cn } from "@/lib/utils";

function bestSet(values: (number | null)[], dir: "max" | "min"): Set<number> {
  const present = values.filter((v): v is number => v != null);
  if (present.length < 2) return new Set();
  const target = dir === "max" ? Math.max(...present) : Math.min(...present);
  if (present.every((v) => v === target)) return new Set();
  const out = new Set<number>();
  values.forEach((v, i) => {
    if (v === target) out.add(i);
  });
  return out;
}

function priceMid(p: CompareProduct): number | null {
  if (p.priceMin != null && p.priceMax != null) return (p.priceMin + p.priceMax) / 2;
  return p.priceMin ?? p.priceMax ?? null;
}

export function CompareTable({ products }: { products: CompareProduct[] }) {
  const t = useTranslations("compare");
  const tEnum = useTranslations("enums");
  const slugs = products.map((p) => p.slug);
  const n = products.length;
  const cols = `170px repeat(${n}, minmax(190px, 1fr))`;

  const specKeys = [
    ...new Set(products.flatMap((p) => Object.keys(p.spec ?? {}))),
  ].sort((a, b) => a.localeCompare(b));

  const priceBest = bestSet(products.map(priceMid), "min");
  const ratingBest = bestSet(
    products.map((p) => (p.ratingCount > 0 ? Number(p.ratingAvg) : null)),
    "max",
  );
  const buyAgainBest = bestSet(
    products.map((p) => (p.ratingCount > 0 ? p.wouldBuyAgainPct : null)),
    "max",
  );
  const problemBest = bestSet(
    products.map((p) => p.problemCount),
    "min",
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <div className="grid min-w-[720px]" style={{ gridTemplateColumns: cols }}>
        {/* Header */}
        <div className="p-3" />
        {products.map((p) => (
          <div key={p.id} className="border-l p-3">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-muted">
              {p.primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="size-5 text-muted-foreground" />
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{p.brand.name}</p>
            <Link
              href={`/products/${p.slug}`}
              className="line-clamp-2 text-sm font-medium hover:text-primary"
            >
              {p.name}
            </Link>
            <div className="mt-1">
              <CompareRemove slug={p.slug} allSlugs={slugs} />
            </div>
          </div>
        ))}

        <Row
          label={t("price")}
          best={priceBest}
          cells={products.map((p) => (
            <span className="tabular-nums">{formatPrice(p.priceMin, p.priceMax)}</span>
          ))}
        />

        <Row
          label={t("communityRating")}
          best={ratingBest}
          cells={products.map((p) =>
            p.ratingCount > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {Number(p.ratingAvg).toFixed(1)}
                <span className="text-muted-foreground">({p.ratingCount})</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{t("noReviews")}</span>
            ),
          )}
        />

        <Row
          label={t("wouldBuyAgain")}
          best={buyAgainBest}
          cells={products.map((p) =>
            p.ratingCount > 0 ? (
              <span className="tabular-nums">{p.wouldBuyAgainPct}%</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
          )}
        />

        {CATEGORY_RATING_FIELDS.map((f) => {
          const vals = products.map((p) => {
            const v = (p.categoryRatingAvgs ?? {})[f.key];
            return typeof v === "number" ? v : null;
          });
          return (
            <Row
              key={f.key}
              label={tEnum(`categoryRating.${f.key}`)}
              best={bestSet(vals, "max")}
              cells={vals.map((v) =>
                v != null ? (
                  <span className="tabular-nums">{v.toFixed(1)}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                ),
              )}
            />
          );
        })}

        <Row
          label={t("reportedProblems")}
          best={problemBest}
          cells={products.map((p) =>
            p.problemCount > 0 ? (
              <Link href={`/products/${p.slug}`} className="text-primary hover:underline">
                {p.problemCount}
              </Link>
            ) : (
              <span className="text-muted-foreground">{t("none")}</span>
            ),
          )}
        />

        <Row
          label={t("warranty")}
          cells={products.map((p) => (
            <span className="text-xs">{p.warrantyText ?? "—"}</span>
          ))}
        />

        {specKeys.length > 0 && (
          <div
            className="col-span-full border-t bg-muted/40 px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            style={{ gridColumn: "1 / -1" }}
          >
            {t("specifications")}
          </div>
        )}
        {specKeys.map((key) => (
          <Row
            key={key}
            label={key}
            cells={products.map((p) => {
              const v = (p.spec ?? {})[key];
              return v == null || v === "" ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                <span>{String(v)}</span>
              );
            })}
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  cells,
  best,
}: {
  label: string;
  cells: React.ReactNode[];
  best?: Set<number>;
}) {
  return (
    <>
      <div className="border-t px-3 py-2.5 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      {cells.map((c, i) => (
        <div
          key={i}
          className={cn(
            "border-t border-l px-3 py-2.5 text-sm",
            best?.has(i) && "bg-primary/5 font-medium text-foreground",
          )}
        >
          {c}
        </div>
      ))}
    </>
  );
}
