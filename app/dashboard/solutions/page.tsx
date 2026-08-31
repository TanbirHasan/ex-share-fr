import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, ThumbsUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { formatDate } from "@/lib/format";
import type { MySolution } from "@/lib/problem-types";

export const dynamic = "force-dynamic";

export default async function MySolutionsPage() {
  const [t, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    apiGet<Paginated<MySolution>>("/api/v1/me/solutions?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("solutionsTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("solutionsCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("solutionsEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/problems">{t("browseProblems")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((s) => (
            <li key={s.id} className="rounded-xl border bg-card p-4">
              <Link
                href={`/problems/${s.problem.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {s.problem.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {s.product.name} · {formatDate(s.createdAt)}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.body}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <Check className="size-3.5" />
                  {s.workedCount}
                </span>
                <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400">
                  <X className="size-3.5" />
                  {s.didntWorkCount}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3.5" />
                  {s.helpfulCount}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
