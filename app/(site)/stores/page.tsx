import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronRight, Star, Store } from "lucide-react";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type StoreItem = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  reviewCount: number;
  avgRating: number;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stores");
  return { title: t("metaTitle") };
}

export default async function StoresPage() {
  const [t, stores] = await Promise.all([
    getTranslations("stores"),
    apiGet<StoreItem[]>("/api/v1/stores").catch(() => [] as StoreItem[]),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("lede")}</p>
      </header>

      {stores.length === 0 ? (
        <p className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {stores.map((s) => (
            <li key={s.id}>
              <Link
                href={`/stores/${s.slug}`}
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Store className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.reviewCount > 0 ? (
                      <>
                        <Star className="mr-0.5 inline size-3 fill-amber-400 text-amber-400" />
                        {s.avgRating.toFixed(1)} · {t("reviewCount", { count: s.reviewCount })}
                      </>
                    ) : (
                      t("noReviews")
                    )}
                    {s.city ? ` · ${s.city}` : ""}
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
