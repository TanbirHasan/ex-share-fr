import Link from "next/link";
import { LifeBuoy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { problemCategoryLabel, type MyProblem } from "@/lib/problem-types";

export const dynamic = "force-dynamic";

export default async function MyProblemsPage() {
  const data = await apiGet<Paginated<MyProblem>>("/api/v1/me/problems?limit=50");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My problems</h1>
        <p className="text-sm text-muted-foreground">
          {data.total} problem{data.total === 1 ? "" : "s"} you&apos;ve reported.
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t reported any problems.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse products</Link>
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
                  <Badge variant="secondary">{problemCategoryLabel(p.category)}</Badge>
                  <span className="truncate text-xs text-muted-foreground">
                    {p.product.name}
                  </span>
                  {p.viewerIsCreator && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      You started this
                    </Badge>
                  )}
                </div>
                <p className="mt-2 font-medium">{p.title}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {p.reportCount} report{p.reportCount === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LifeBuoy className="size-3.5" />
                    {p.solutionCount} solution{p.solutionCount === 1 ? "" : "s"}
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
