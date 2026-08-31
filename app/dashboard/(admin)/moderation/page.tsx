import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ReportActions } from "@/components/dashboard/report-actions";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  targetType: "review" | "problem" | "solution";
  targetId: string;
  reason: string;
  status: "open" | "reviewing" | "actioned" | "dismissed";
  createdAt: string;
  reporter: { id: string; name: string | null };
  reportCount: number;
  target: {
    exists: boolean;
    snippet: string;
    status: string | null;
    authorName: string | null;
    href: string | null;
    productName: string | null;
  };
};

const TABS = ["open", "actioned", "dismissed"] as const;

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (TABS as readonly string[]).includes(sp.status ?? "")
    ? (sp.status as (typeof TABS)[number])
    : "open";

  const data = await apiGet<Paginated<Report>>(
    `/api/v1/admin/reports?status=${status}&limit=50`,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="text-sm text-muted-foreground">
          Content flagged by the community. Actioning a report also hides or restores
          the content.
        </p>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/dashboard/moderation?status=${t}`}
            className={
              "border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors " +
              (t === status
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {t}
          </Link>
        ))}
      </div>

      {data.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <ShieldCheck className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {status === "open" ? "Nothing in the queue. Nice." : `No ${status} reports.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {data.data.map((r) => (
            <li key={r.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {r.targetType}
                </Badge>
                <Badge variant="outline">{r.reason.split(" — ")[0]}</Badge>
                {r.reportCount > 1 && (
                  <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
                    {r.reportCount} reports
                  </Badge>
                )}
                {r.target.status && (
                  <Badge
                    variant={r.target.status === "rejected" ? "destructive" : "secondary"}
                  >
                    content: {r.target.status}
                  </Badge>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <blockquote className="mt-3 rounded-lg border-l-2 border-muted-foreground/30 bg-muted/40 px-3 py-2 text-sm">
                {r.target.exists ? (
                  r.target.snippet
                ) : (
                  <span className="text-muted-foreground">(content deleted)</span>
                )}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {r.target.authorName ?? "unknown"}
                  {r.target.productName ? ` · ${r.target.productName}` : ""}
                  {r.target.href && (
                    <>
                      {" · "}
                      <Link href={r.target.href} className="text-primary hover:underline">
                        view in context
                      </Link>
                    </>
                  )}
                </span>
              </blockquote>

              <p className="mt-2 text-xs text-muted-foreground">
                Reported by {r.reporter.name ?? "a user"}
                {r.reason.includes(" — ") ? ` — “${r.reason.split(" — ").slice(1).join(" — ")}”` : ""}
              </p>

              {status === "open" && (
                <div className="mt-3">
                  <ReportActions reportId={r.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
