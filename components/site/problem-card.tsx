import Link from "next/link";
import { useTranslations } from "next-intl";
import { LifeBuoy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ProblemListItem } from "@/lib/problem-types";

export function ProblemCard({
  problem,
  showProduct = true,
}: {
  problem: ProblemListItem;
  showProduct?: boolean;
}) {
  const t = useTranslations("problems");
  const tEnum = useTranslations("enums");
  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="block rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{tEnum(`problemCategory.${problem.category}`)}</Badge>
        {showProduct && (
          <span className="truncate text-xs text-muted-foreground">{problem.product.name}</span>
        )}
      </div>
      <h3 className="mt-2 font-medium text-foreground">{problem.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{problem.description}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" />
          {t("reportCount", { count: problem.reportCount })}
        </span>
        <span className="inline-flex items-center gap-1">
          <LifeBuoy className="size-3.5" />
          {t("solutionCount", { count: problem.solutionCount })}
        </span>
      </div>
    </Link>
  );
}
