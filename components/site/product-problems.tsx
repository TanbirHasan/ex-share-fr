import Link from "next/link";
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
  const list = await apiGet<Paginated<ProblemListItem>>(
    `/api/v1/products/${productId}/problems?limit=10`,
  ).catch(() => ({ data: [], total: 0, limit: 10, offset: 0 }) as Paginated<ProblemListItem>);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Reported problems{list.total > 0 ? ` (${list.total})` : ""}
        </h2>
        <Button asChild size="sm" variant="outline">
          <Link href={`/contribute/problem?product=${productSlug}`}>
            <TriangleAlert className="size-4" />
            Report a problem
          </Link>
        </Button>
      </div>

      {list.data.length === 0 ? (
        <div className="flex gap-2.5 rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            No problems reported yet.{" "}
            <Link
              href={`/contribute/problem?product=${productSlug}`}
              className="text-primary hover:underline"
            >
              Hit a fault? Report it.
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
