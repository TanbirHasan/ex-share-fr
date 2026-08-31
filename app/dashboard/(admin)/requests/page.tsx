import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { PackageSearch } from "lucide-react";
import { RequestActions } from "@/components/dashboard/request-actions";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type ProductRequest = {
  id: string;
  rawText: string;
  categoryGuess: string | null;
  status: "open" | "added" | "rejected";
  createdAt: string;
  requester: { id: string; name: string | null } | null;
};

type List = {
  data: ProductRequest[];
  total: number;
  limit: number;
  offset: number;
};

const TABS = ["open", "added", "rejected"] as const;

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (TABS as readonly string[]).includes(sp.status ?? "")
    ? (sp.status as (typeof TABS)[number])
    : "open";

  const [t, format, data] = await Promise.all([
    getTranslations("dashboard.requests"),
    getFormatter(),
    apiGet<List>(`/api/v1/admin/product-requests?status=${status}&limit=100`),
  ]);

  const tabLabel = (tab: (typeof TABS)[number]) =>
    tab === "open" ? t("tabOpen") : tab === "added" ? t("tabAdded") : t("tabRejected");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`/dashboard/requests?status=${tab}`}
            className={
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors " +
              (tab === status
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {tabLabel(tab)}
          </Link>
        ))}
      </div>

      {data.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <PackageSearch className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {status === "open" ? t("queueEmpty") : t("noneWithStatus", { status: tabLabel(status) })}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((req) => (
            <li key={req.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {req.categoryGuess && (
                  <Badge variant="secondary">{req.categoryGuess}</Badge>
                )}
                <span>
                  {t("by", { name: req.requester?.name?.trim() || t("someone") })}
                </span>
                <span aria-hidden>·</span>
                <span>{format.dateTime(new Date(req.createdAt), { dateStyle: "medium" })}</span>
              </div>

              <p className="mt-2 text-sm whitespace-pre-line text-foreground">{req.rawText}</p>

              {status === "open" && (
                <div className="mt-3">
                  <RequestActions requestId={req.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
