import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pager({
  basePath,
  page,
  totalPages,
  params,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  const t = useTranslations("common");
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v && k !== "page") sp.set(k, v);
    }
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const base =
    "flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium";

  return (
    <nav className="flex items-center justify-between pt-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(base, "hover:bg-muted")}>
          <ChevronLeft className="size-4" /> {t("previous")}
        </Link>
      ) : (
        <span className={cn(base, "text-muted-foreground opacity-50")}>
          <ChevronLeft className="size-4" /> {t("previous")}
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        {t("pageOf", { page, totalPages })}
      </span>

      {page < totalPages ? (
        <Link href={href(page + 1)} className={cn(base, "hover:bg-muted")}>
          {t("next")} <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(base, "text-muted-foreground opacity-50")}>
          {t("next")} <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
