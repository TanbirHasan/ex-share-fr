import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { ClipboardCheck } from "lucide-react";
import { PendingActions } from "@/components/dashboard/pending-actions";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type PendingItem = {
  type: "review" | "problem" | "solution" | "service";
  id: string;
  createdAt: string;
  author: { id: string; name: string | null } | null;
  product: { slug: string; name: string };
  headline: string;
  snippet: string;
  href: string;
};

export default async function PendingPage() {
  const [t, format, items] = await Promise.all([
    getTranslations("dashboard.pendingQueue"),
    getFormatter(),
    apiGet<PendingItem[]>("/api/v1/admin/pending"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <ClipboardCheck className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{t(`type.${item.type}`)}</Badge>
                <Link
                  href={item.href}
                  className="truncate font-medium text-primary hover:underline"
                >
                  {item.headline}
                </Link>
                <span aria-hidden>·</span>
                <span>{item.product.name}</span>
                <span aria-hidden>·</span>
                <span>{t("by", { name: item.author?.name?.trim() || t("someone") })}</span>
                <span aria-hidden>·</span>
                <span>{format.dateTime(new Date(item.createdAt), { dateStyle: "medium" })}</span>
              </div>

              {item.snippet && (
                <p className="mt-2 line-clamp-3 text-sm whitespace-pre-line text-foreground/90">
                  {item.snippet}
                </p>
              )}

              <div className="mt-3">
                <PendingActions type={item.type} id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
