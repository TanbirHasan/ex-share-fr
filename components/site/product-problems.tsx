import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";
import { ProblemCard } from "@/components/site/problem-card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import type { ProblemListItem } from "@/lib/problem-types";

export async function ProductProblems({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [t, list] = await Promise.all([
    getTranslations("problems"),
    apiGet<Paginated<ProblemListItem>>(
      `/api/v1/products/${productId}/problems?limit=10`,
    ).catch(
      () => ({ data: [], total: 0, limit: 10, offset: 0 }) as Paginated<ProblemListItem>,
    ),
  ]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {list.total > 0
            ? t("reportedProblemsCount", { count: list.total })
            : t("reportedProblems")}
        </h2>
        <Button asChild size="sm" variant="outline">
          <Link href={`/contribute/problem?product=${productSlug}`}>
            <TriangleAlert className="size-4" />
            {t("reportAProblem")}
          </Link>
        </Button>
      </div>

      {list.data.length === 0 ? (
        <div className="flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            {t("noProblemsYet")}{" "}
            <Link
              href={`/contribute/problem?product=${productSlug}`}
              className="text-primary hover:underline"
            >
              {t("hitFaultReport")}
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.data.map((p) => (
            <ProblemCard key={p.id} problem={p} showProduct={false} />
          ))}
        </div>
      )}
    </section>
  );
}
