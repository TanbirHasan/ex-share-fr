import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ImageOff, Rss, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type Following = {
  products: {
    id: string;
    slug: string;
    name: string;
    primaryImage: string | null;
    ratingAvg: number;
    ratingCount: number;
    followedAt: string;
  }[];
  problems: {
    id: string;
    slug: string;
    title: string;
    reportCount: number;
    productName: string;
    followedAt: string;
  }[];
};

export default async function FollowingPage() {
  const [t, tProblems, data] = await Promise.all([
    getTranslations("dashboard.following"),
    getTranslations("problems"),
    apiGet<Following>("/api/v1/me/following"),
  ]);

  const empty = data.products.length === 0 && data.problems.length === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>

      {empty ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-12 text-center">
          <Rss className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{t("empty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <>
          {data.products.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold tracking-tight">{t("productsHeading")}</h2>
              <ul className="space-y-2">
                {data.products.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/40"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {p.primaryImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff className="size-5 text-muted-foreground" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.ratingCount > 0
                            ? `★ ${p.ratingAvg.toFixed(1)} · ${p.ratingCount}`
                            : t("noRatings")}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.problems.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold tracking-tight">{t("problemsHeading")}</h2>
              <ul className="space-y-2">
                {data.problems.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/problems/${p.slug}`}
                      className="block rounded-xl border bg-card p-3 transition-colors hover:border-primary/40"
                    >
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{p.productName}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <TriangleAlert className="size-3" />
                          {tProblems("reportCount", { count: p.reportCount })}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
