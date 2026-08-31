import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LifeBuoy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { type MyProblem } from "@/lib/problem-types";

export const dynamic = "force-dynamic";

export default async function MyProblemsPage() {
  const [t, tProblems, tEnum, data] = await Promise.all([
    getTranslations("dashboard.pages"),
    getTranslations("problems"),
    getTranslations("enums"),
    apiGet<Paginated<MyProblem>>("/api/v1/me/problems?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("problemsTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("problemsCount", { count: data.total })}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t("problemsEmpty")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((p) => (
            <li key={p.id}>
              <Link
                href={`/problems/${p.slug}`}
                className="block rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{tEnum(`problemCategory.${p.category}`)}</Badge>
                  <span className="truncate text-xs text-muted-foreground">
                    {p.product.name}
                  </span>
                  {p.viewerIsCreator && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {t("youStartedThis")}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 font-medium">{p.title}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {tProblems("reportCount", { count: p.reportCount })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LifeBuoy className="size-3.5" />
                    {tProblems("solutionCount", { count: p.solutionCount })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
